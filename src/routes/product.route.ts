import { Router } from 'express'
import {
  getProductDetail,
  getProductList,
  getProductListOfBrand,
} from '../controller/product.controller'
const router = Router()

router.get('/', getProductList)
router.get('/:productId/detail', getProductDetail)
router.get('/:brandId/brand', getProductListOfBrand)

export default router
