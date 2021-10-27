import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import config from '../config'
import httpStatus from '../constant/status.constant'
import UserModel from '../model/user.model'

export const checkAuthorized = async (
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
      const queryUser = await UserModel.findById(payload._id)

      if (!queryUser || queryUser.disable) {
        return res.status(httpStatus.FORBIDDEN).send('Forbidden')
      }
    }
    req.payloadToken = payload

    next()
  } catch (error) {
    return res.status(httpStatus.FORBIDDEN).send('Forbidden')
  }
}
