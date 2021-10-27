import { Router } from 'express'
import {
  getUsers,
  searchUser,
  blockUser,
} from '../controller/admin.user.controller'
const router = Router()

router.get('/', getUsers)
router.post('/search', searchUser)
router.patch('/:userId/block', blockUser)

export default router
