import { Request, Response } from 'express'
import Joi from 'joi'
import httpStatus from '../constant/status.constant'
import OrderModel from '../model/order.model'
import ProductModel from '../model/product.model'
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

interface cartItem {
  productRef: string
  quantity: number
  cost: number
}

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
    await UserModel.findByIdAndUpdate(
      _id,
      {
        phone: pay.phone,
        deliveryAddress: pay.deliveryAddress,
      },
      { new: true }
    )

    pay.cart.forEach(async (item: cartItem) => {
      try {
        const queryProduct = await ProductModel.findById(item.productRef)
        if (!queryProduct) {
          return res.sendStatus(httpStatus.BAD_REQUEST)
        }

        await ProductModel.findByIdAndUpdate(
          item.productRef,
          { quantity: queryProduct.quantity - item.quantity },
          { new: true }
        )
      } catch (error) {
        res.status(httpStatus.BAD_REQUEST).send(error)
      }
    })

    await new OrderModel({
      code: Date.now(),
      products: pay.cart,
      status: 'pending',
      user: _id,
    }).save()

    res.status(httpStatus.OK).send('OK')
  } catch (error) {
    res.status(httpStatus.BAD_REQUEST).send(error)
  }
}
