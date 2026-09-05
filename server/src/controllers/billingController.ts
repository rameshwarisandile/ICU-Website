import type { Response } from 'express'
import { prisma } from '../lib/prisma.js'
import type { AuthenticatedRequest } from '../middleware/auth.js'

const isSuspiciousBilling = (message: string) => /death|discharge|unauthori|blocked|outside admission/i.test(message)

const assertBillingAllowed = async (patientId: string, serviceDateTime: Date) => {
  const patient = await prisma.patient.findUnique({
    where: { id: patientId },
    select: {
      id: true,
      status: true,
      admissionDate: true,
      dischargeDate: true,
      deathDateTime: true,
      billingLocked: true,
    },
  })

  if (!patient) {
    return { patient: null, message: 'Patient not found.' }
  }

  if (patient.billingLocked || patient.status === 'DECEASED' || patient.deathDateTime) {
    return { patient, message: 'Billing is locked for deceased patients.' }
  }

  if (patient.status === 'DISCHARGED' || patient.dischargeDate) {
    return { patient, message: 'Billing is not allowed after discharge.' }
  }

  if (serviceDateTime < patient.admissionDate) {
    return { patient, message: 'Billing service is outside the admission period.' }
  }

  return { patient, message: null }
}

export const listBillingEntries = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const patientId = req.user?.role === 'PATIENT' ? req.user.patientId : req.query.patientId?.toString()

    if (req.user?.role === 'PATIENT' && !patientId) {
      return res.status(400).json({ message: 'Patient record is missing from the authenticated user.' })
    }

    const entries = await prisma.billingEntry.findMany({
      where: patientId ? { patientId } : undefined,
      orderBy: { billedAt: 'desc' },
      include: {
        patient: {
          select: { id: true, patientNumber: true, firstName: true, lastName: true, status: true },
        },
      },
    })

    return res.json(entries)
  } catch (error) {
    console.error('List billing entries error:', error)
    return res.status(500).json({ message: 'Unable to load billing entries.' })
  }
}

export const createBillingEntry = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { patientId, serviceName, serviceCategory, amount, serviceDateTime, notes } = req.body

    if (!patientId || !serviceName || amount === undefined || !serviceDateTime) {
      return res.status(400).json({ message: 'Patient, service, amount, and service date are required.' })
    }

    const serviceDate = new Date(serviceDateTime)
    const validation = await assertBillingAllowed(patientId, serviceDate)

    if (validation.message) {
      await prisma.billingAuditLog.create({
        data: {
          patientId,
          action: 'BLOCKED_CREATE',
          message: validation.message,
          details: { patientId, serviceName, serviceCategory, amount, serviceDateTime },
          wasBlocked: true,
          createdByUserId: req.user?.id,
        },
      })

      if (isSuspiciousBilling(validation.message)) {
        await prisma.notification.create({
          data: {
            patientId,
            title: 'Suspicious billing attempt blocked',
            message: validation.message,
            type: 'GENERAL',
          },
        })
      }

      return res.status(403).json({ message: validation.message })
    }

    const billingEntry = await prisma.billingEntry.create({
      data: {
        patientId,
        serviceName,
        serviceCategory: serviceCategory ?? null,
        amount: Number(amount),
        serviceDateTime: serviceDate,
        notes: notes ?? null,
        createdByUserId: req.user?.id,
        status: 'POSTED',
      },
    })

    await prisma.billingAuditLog.create({
      data: {
        billingEntryId: billingEntry.id,
        patientId,
        action: 'CREATE',
        message: 'Billing entry created.',
        details: { serviceName, serviceCategory, amount },
        createdByUserId: req.user?.id,
      },
    })

    return res.status(201).json(billingEntry)
  } catch (error) {
    console.error('Create billing entry error:', error)
    return res.status(500).json({ message: 'Unable to create billing entry.' })
  }
}

export const updateBillingEntry = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params
    const { status, amount, notes, refundReason } = req.body

    const existing = await prisma.billingEntry.findUnique({ where: { id } })

    if (!existing) {
      return res.status(404).json({ message: 'Billing entry not found.' })
    }

    const patientValidation = await assertBillingAllowed(existing.patientId, existing.serviceDateTime)

    if (existing.status === 'VOIDED') {
      return res.status(409).json({ message: 'Voided billing entries cannot be modified.' })
    }

    if (patientValidation.message && status !== 'VOIDED') {
      await prisma.billingAuditLog.create({
        data: {
          billingEntryId: existing.id,
          patientId: existing.patientId,
          action: 'BLOCKED_UPDATE',
          message: patientValidation.message,
          details: { id, status, amount, notes, refundReason },
          wasBlocked: true,
          createdByUserId: req.user?.id,
        },
      })

      return res.status(403).json({ message: patientValidation.message })
    }

    const updated = await prisma.billingEntry.update({
      where: { id },
      data: {
        status: status ?? existing.status,
        amount: amount === undefined ? existing.amount : Number(amount),
        notes: notes ?? existing.notes,
        refundReason: refundReason ?? existing.refundReason,
        updatedByUserId: req.user?.id,
        voidedAt: status === 'VOIDED' ? new Date() : existing.voidedAt,
      },
    })

    await prisma.billingAuditLog.create({
      data: {
        billingEntryId: updated.id,
        patientId: updated.patientId,
        action: status === 'VOIDED' ? 'VOID' : 'UPDATE',
        message: `Billing entry ${status === 'VOIDED' ? 'voided' : 'updated'}.`,
        details: { status, amount, notes, refundReason },
        createdByUserId: req.user?.id,
      },
    })

    return res.json(updated)
  } catch (error) {
    console.error('Update billing entry error:', error)
    return res.status(500).json({ message: 'Unable to update billing entry.' })
  }
}