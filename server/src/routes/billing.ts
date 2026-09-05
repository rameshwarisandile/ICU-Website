import { Router } from 'express'
import { createBillingEntry, listBillingEntries, updateBillingEntry } from '../controllers/billingController.js'
import { requireAuth, requireRole } from '../middleware/auth.js'

const router = Router()

router.use(requireAuth)
router.get('/', requireRole('ADMIN', 'DOCTOR', 'NURSE', 'BILLING_STAFF', 'PATIENT'), listBillingEntries)
router.post('/', requireRole('ADMIN', 'DOCTOR', 'NURSE', 'BILLING_STAFF'), createBillingEntry)
router.patch('/:id', requireRole('ADMIN', 'BILLING_STAFF'), updateBillingEntry)

export default router