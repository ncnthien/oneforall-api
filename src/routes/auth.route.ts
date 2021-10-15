import { Router } from 'express'
import {
  facebookLogin,
  googleLogin,
  login,
  register,
} from '../controller/auth.controller'
const router = Router()

router.post('/login', login)
router.post('/register', register)
router.post('/google-login', googleLogin)
router.post('/facebook-login', facebookLogin)

export default router
