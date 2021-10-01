import { Router } from 'express'
import {
  addBrand,
  getBrands,
  getBrand,
  updateBrand,
} from '../controller/admin.brand.controller'
const router = Router()

router.get('/', getBrands)
router.get('/:brandId', getBrand)
router.post('/', addBrand)
router.put('/:brandId/update', updateBrand)

export default router
