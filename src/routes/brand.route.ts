import { Router } from 'express'
import { getBrand, getProductList } from '../controller/brand.controller'

const router = Router()

router.get('/:brandName/detail', getBrand)
router.get('/:brandId/product', getProductList)

export default router
