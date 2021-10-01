import { Application } from 'express'
import { checkAuthorized } from '../middleware/authorization.middleware'
import adminAuthRoute from './admin.auth.route'
import adminBrandRoute from './admin.brand.route'
import adminUserRoute from './admin.user.route'
import authRoute from './auth.route'
import profileRoute from './profile.route'
import testRoute from './test.route'

const routes = (app: Application) => {
  app.use('/test', testRoute)
  app.use('/api/admin/auth', adminAuthRoute)
  app.use('/api/admin/user', checkAuthorized, adminUserRoute)
  app.use('/api/admin/brand', checkAuthorized, adminBrandRoute)
  app.use('/api/auth', authRoute)
  app.use('/api/profile', checkAuthorized, profileRoute)
}

export default routes
