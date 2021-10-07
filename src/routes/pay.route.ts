import { Router } from 'express'
import { getUserInformation, pay } from '../controller/pay.controller'
const router = Router()

router.get('/', getUserInformation)
router.post('/', pay)

export default router
