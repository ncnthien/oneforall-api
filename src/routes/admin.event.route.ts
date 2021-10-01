import { Router } from 'express'
import {
  addEvent,
  getEvents,
  updateEvent,
} from '../controller/admin.event.controller'
const router = Router()

router.get('/', getEvents)
router.post('/', addEvent)
router.put('/:eventId/update', updateEvent)

export default router
