import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import config from '../config'
import httpStatus from '../constant/status.constant'
import adminModel from '../model/admin.model'

export const checkAdminAuthorized = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.headers['authorization']) {
    return res.status(httpStatus.UNAUTHORIZED).send('Unauthorized')
  }

  try {
    const payload = jwt.verify(
      req.headers['authorization'] || '',
      config.jwtPrivateKey
    )

    if (typeof payload === 'object') {
      const existingAdmin = adminModel.findById(payload._id)

      if (!existingAdmin) {
        return res.status(httpStatus.FORBIDDEN).send('Forbidden')
      }
    }

    req.payloadToken = payload
    next()
  } catch (error) {
    return res.status(httpStatus.FORBIDDEN).send('Forbidden')
  }
}
