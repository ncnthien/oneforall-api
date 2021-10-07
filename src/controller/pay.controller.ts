import { Request, Response } from 'express'
import Joi from 'joi'
import httpStatus from '../constant/status.constant'
import OrderModel from '../model/order.model'
import UserModel from '../model/user.model'

const paySchema = Joi.object({
  phone: Joi.string().required(),
  deliveryAddress: Joi.object({
    address: Joi.string().required(),
    ward: Joi.string().required(),
    district: Joi.string().required(),
    city: Joi.string().required(),
  }).required(),
  cart: Joi.array()
    .items(
      Joi.object({
        productRef: Joi.string().required(),
        quantity: Joi.number().required(),
        cost: Joi.number().required(),
      })
    )
    .min(1)
    .required(),
})

export const getUserInformation = async (req: Request, res: Response) => {
  const { _id } = req.payloadToken

  try {
    const queryUser = await UserModel.findById(_id)
    if (!queryUser) {
      return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR)
    }
    const { username, phone, deliveryAddress } = queryUser
    res.status(httpStatus.OK).json({ username, phone, deliveryAddress })
  } catch (error) {
    res.status(httpStatus.BAD_REQUEST).send(error)
  }
}

export const pay = async (req: Request, res: Response) => {
  const { _id } = req.payloadToken
  // check if requestBody invalid then respond BAD REQUEST status otherwise  handle value (pay)
  const { value: pay, error: payError } = paySchema.validate(req.body)
  if (payError) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .send({ message: payError.details[0].message })
  }

  try {
    const user = await UserModel.findByIdAndUpdate(
      _id,
      {
        ...pay,
      },
      { new: true }
    )

    await new OrderModel({
      code: Date.now(),
      products: pay.cart,
      status: 'pending',
      user: _id,
    }).save()

    res.status(httpStatus.OK).json('OK')
  } catch (error) {
    res.status(httpStatus.BAD_REQUEST).send(error)
  }
}
