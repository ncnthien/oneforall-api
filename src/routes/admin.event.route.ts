import { Router } from 'express'
import {
  addEvent,
  deleteEvent,
  getEvents,
  updateEvent,
  getEvent,
} from '../controller/admin.event.controller'
const router = Router()

router.get('/', getEvents)
router.get('/:eventId', getEvent)
router.post('/', addEvent)
router.put('/:eventId/update', updateEvent)
router.delete('/:eventId/delete', deleteEvent)

export default router
