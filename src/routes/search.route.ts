import { Router } from 'express'
import { search } from '../controller/search.controller'

const router = Router()

router.post('/', search)

export default router
