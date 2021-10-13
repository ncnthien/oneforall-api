import { Router } from 'express'
import { getData } from '../controller/home.controller'

const router = Router()

router.get('/', getData)

export default router
