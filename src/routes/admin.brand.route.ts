import { Router } from 'express'
import { addBrand } from '../controller/admin.brand.controller'
const router = Router()

router.post('/', addBrand)

export default router
