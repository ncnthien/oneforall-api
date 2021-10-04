import { Application } from 'express'
import { checkAuthorized } from '../middleware/authorization.middleware'
import adminAuthRoute from './admin.auth.route'
import adminProductRoute from './admin.product.route'
import adminUserRoute from './admin.user.route'
import authRoute from './auth.route'
import productRoute from './product.route'
import profileRoute from './profile.route'

const routes = (app: Application) => {
  app.use('/api/admin/auth', adminAuthRoute)
  app.use('/api/admin/user', checkAuthorized, adminUserRoute)
  app.use('/api/admin/product', adminProductRoute)
  app.use('/api/auth', authRoute)
  app.use('/api/product', productRoute)
  app.use('/api/profile', checkAuthorized, profileRoute)
}

export default routes
