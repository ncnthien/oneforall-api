import { Application } from 'express'
import { checkAuthorized } from '../middleware/authorization.middleware'
import adminAuthRoute from './admin.auth.route'
import adminBrandRoute from './admin.brand.route'
import adminEventRoute from './admin.event.route'
import adminProductRoute from './admin.product.route'
import adminSubBrandRoute from './admin.subBrand.route'
import adminUserRoute from './admin.user.route'
import authRoute from './auth.route'
import productRoute from './product.route'
import profileRoute from './profile.route'

const routes = (app: Application) => {
  app.use('/api/admin/auth', adminAuthRoute)
  app.use('/api/admin/user', checkAuthorized, adminUserRoute)
  app.use('/api/admin/product', checkAuthorized, adminProductRoute)
  app.use('/api/admin/brand', checkAuthorized, adminBrandRoute)
  app.use('/api/admin/sub-brand', checkAuthorized, adminSubBrandRoute)
  app.use('/api/admin/event', checkAuthorized, adminEventRoute)
  app.use('/api/auth', authRoute)
  app.use('/api/product', productRoute)
  app.use('/api/profile', checkAuthorized, profileRoute)
}

export default routes
