import { Router } from 'express'
import { addEvent, getEvents } from '../controller/admin.event.controller'
const router = Router()

router.get('/', getEvents)
router.post('/', addEvent)

export default router
