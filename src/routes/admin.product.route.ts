import { Router } from 'express'
import {
  addProduct,
  deleteProduct,
  getProductList,
  updateProduct,
} from '../controller/admin.product.controller'
const router = Router()

router.get('/', getProductList)
router.post('/', addProduct)
router.put('/:productId/update', updateProduct)
router.delete('/:productId/delete', deleteProduct)

export default router
