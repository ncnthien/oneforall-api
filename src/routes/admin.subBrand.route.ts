import { Router } from 'express'
import {
  getSubBrands,
  addSubBrand,
  updateSubBrand,
  deleteSubBrand,
} from '../controller/admin.subBrand.controller'
const router = Router()

router.get('/:brandId', getSubBrands)
router.post('/:brandId', addSubBrand)
router.patch('/:brandId/:subBrandId/update', updateSubBrand)
router.delete('/:subBrandId/delete', deleteSubBrand)

export default router
