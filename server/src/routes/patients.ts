import { Router } from 'express'
import { getDashboardOverview, getPatientById, getPatients } from '../controllers/patientController.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.get('/', requireAuth, getPatients)
router.get('/overview', requireAuth, getDashboardOverview)
router.get('/:id', requireAuth, getPatientById)

export default router
