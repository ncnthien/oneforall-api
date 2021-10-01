import { Router } from 'express'
import {
  addBrand,
  getBrands,
  getBrand,
} from '../controller/admin.brand.controller'
const router = Router()

router.get('/', getBrands)
router.get('/:brandId', getBrand)
router.post('/', addBrand)

export default router
