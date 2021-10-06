import { Router } from 'express'
import {
  deleteOrder,
  getOrderList,
  updateOrder,
} from '../controller/admin.order.controller'

const router = Router()

router.get('/', getOrderList)
router.put('/:orderId/update', updateOrder)
router.delete('/:orderId/delete', deleteOrder)

export default router
