import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import type { Request, Response } from 'express'
import { prisma } from '../lib/prisma.js'
import { env } from '../config/env.js'

const normalizeRole = (role?: string) => {
  const normalized = String(role ?? 'DOCTOR').trim().toUpperCase()

  if (normalized === 'ADMIN' || normalized === 'ADMINISTRATOR') return 'ADMIN'
  if (normalized === 'NURSE') return 'NURSE'
  if (normalized === 'ANALYST') return 'ANALYST'
  if (normalized.includes('CONSULT') || normalized.includes('DOCTOR')) return 'DOCTOR'
  return 'DOCTOR'
}

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name, role, department, phone } = req.body

    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Email, password, and name are required.' })
    }

    const existingUser = await prisma.user.findUnique({ where: { email } })

    if (existingUser) {
      return res.status(409).json({ message: 'A user with this email already exists.' })
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        email,
        name,
        role: normalizeRole(role),
        passwordHash,
        department: department ?? null,
        phone: phone ?? null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatarUrl: true,
        phone: true,
        department: true,
        isActive: true,
        createdAt: true,
      },
    })

    await prisma.auditLog.create({
      data: {
        action: 'USER_REGISTERED',
        entityType: 'User',
        entityId: user.id,
        details: {
          email: user.email,
          role: user.role,
          department: user.department,
        },
      },
    })

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, env.jwtSecret, {
      expiresIn: '8h',
    })

    return res.status(201).json({ token, user })
  } catch (error) {
    console.error('Register error:', error)
    return res.status(500).json({ message: 'Unable to register user.' })
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' })
    }

    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' })
    }

    const isValid = await bcrypt.compare(password, user.passwordHash)

    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials.' })
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, env.jwtSecret, {
      expiresIn: '8h',
    })

    await prisma.auditLog.create({
      data: {
        action: 'USER_LOGIN',
        entityType: 'User',
        entityId: user.id,
        details: {
          email: user.email,
          role: user.role,
        },
      },
    })

    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatarUrl: user.avatarUrl,
        phone: user.phone,
        department: user.department,
        isActive: user.isActive,
        createdAt: user.createdAt,
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    return res.status(500).json({ message: 'Unable to authenticate user.' })
  }
}

export const me = async (req: Request & { user?: { id: string } }, res: Response) => {
  try {
    const userId = req.user?.id

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated.' })
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatarUrl: true,
        phone: true,
        department: true,
        isActive: true,
        createdAt: true,
      },
    })

    if (!user) {
      return res.status(404).json({ message: 'User not found.' })
    }

    return res.json({ user })
  } catch (error) {
    console.error('Me error:', error)
    return res.status(500).json({ message: 'Unable to load profile.' })
  }
}
