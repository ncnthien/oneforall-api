import { Router } from 'express'
import { getOrderList } from '../controller/order.controller'
const router = Router()

router.get('/', getOrderList)

export default router
