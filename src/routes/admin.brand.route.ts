import { Router } from 'express'
import {
  addBrand,
  getBrands,
  getBrand,
  updateBrand,
  deleteBrand,
} from '../controller/admin.brand.controller'
const router = Router()

router.get('/', getBrands)
router.get('/:brandId', getBrand)
router.post('/', addBrand)
router.put('/:brandId/update', updateBrand)
router.delete('/:brandId/delete', deleteBrand)

export default router
