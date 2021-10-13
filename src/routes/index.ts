import { Application } from 'express'
import { checkAdminAuthorized } from '../middleware/admin.authorization.middleware'
import { checkAuthorized } from '../middleware/authorization.middleware'
import adminAuthRoute from './admin.auth.route'
import adminBrandRoute from './admin.brand.route'
import adminEventRoute from './admin.event.route'
import adminOrderRoute from './admin.order.route'
import adminProductRoute from './admin.product.route'
import adminSubBrandRoute from './admin.subBrand.route'
import adminUserRoute from './admin.user.route'
import authRoute from './auth.route'
import eventRoute from './event.route'
import homeRoute from './home.route'
import payRoute from './pay.route'
import productRoute from './product.route'
import profileRoute from './profile.route'
import searchRoute from './search.route'

const routes = (app: Application) => {
  app.use('/api/admin/auth', adminAuthRoute)
  app.use('/api/admin/brand', checkAdminAuthorized, adminBrandRoute)
  app.use('/api/admin/event', checkAdminAuthorized, adminEventRoute)
  app.use('/api/admin/order', checkAdminAuthorized, adminOrderRoute)
  app.use('/api/admin/product', checkAdminAuthorized, adminProductRoute)
  app.use('/api/admin/sub-brand', checkAdminAuthorized, adminSubBrandRoute)
  app.use('/api/admin/user', checkAdminAuthorized, adminUserRoute)
  app.use('/api/auth', authRoute)
  app.use('/api/event', eventRoute)
  app.use('/api/home', homeRoute)
  app.use('/api/pay', checkAuthorized, payRoute)
  app.use('/api/product', productRoute)
  app.use('/api/profile', checkAuthorized, profileRoute)
  app.use('/api/search', searchRoute)
}

export default routes
