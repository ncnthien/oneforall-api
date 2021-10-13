import { Router } from 'express'
import { getDropdown } from '../controller/dropdown.controller'

const router = Router()

router.get('/', getDropdown)

export default router
