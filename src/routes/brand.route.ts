import { Router } from 'express'
import { getBrandDetail } from '../controller/brand.controller'

const router = Router()

router.get('/:brandName/detail', getBrandDetail)

export default router
