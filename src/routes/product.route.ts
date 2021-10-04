import { Router } from 'express'
import {
  getProductDetail,
  getProductList,
} from '../controller/product.controller'
const router = Router()

router.get('/', getProductList)
router.get('/:productId/detail', getProductDetail)

export default router
