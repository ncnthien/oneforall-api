import { Router } from 'express'
import {
  getSubBrands,
  addSubBrand,
  // updateSubBrand,
} from '../controller/admin.subBrand.controller'
const router = Router()

router.get('/:brandId', getSubBrands)
router.post('/:brandId', addSubBrand)
// router.put('/:subBrandId/update', updateSubBrand)

export default router
