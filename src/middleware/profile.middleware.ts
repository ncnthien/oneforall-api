import { Request, Response, NextFunction } from 'express'
import Joi from 'joi'
import httpStatus from '../constant/status.constant'

export const validateUpdatedProfile = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const updatedUserSchema = Joi.object({
    _id: Joi.string(),
    username: Joi.string().min(1).required(),
    email: Joi.string(),
    avatar: Joi.string().allow('').required(),
    phone: Joi.string().allow('').required(),
    deliveryAddress: Joi.object({
      address: Joi.string().allow('').required(),
      ward: Joi.string().allow('').required(),
      district: Joi.string().allow('').required(),
      city: Joi.string().allow('').required(),
      _id: Joi.string(),
    }),
    disable: Joi.boolean().required(),
    __v: Joi.number(),
  })

  const { error } = updatedUserSchema.validate(req.body)

  if (error) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .send({ message: error.details[0].message })
  }

  next()
}
