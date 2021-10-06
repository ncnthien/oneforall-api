import { Request, Response } from 'express'
import Joi from 'joi'
import httpStatus from '../constant/status.constant'
import OrderModel from '../model/order.model'
import ProductModel from '../model/product.model'

const orderSchema = Joi.object({
  code: Joi.string().required(),
  date: Joi.date().default(Date.now),
  products: Joi.array()
    .items(
      Joi.object({
        ref: Joi.string().required(),
        quantity: Joi.number().required(),
        cost: Joi.number().required(),
      })
    )
    .min(1)
    .required(),
  status: Joi.string()
    .valid('pending', 'claimed', 'delivering', 'delivered')
    .required(),
  user: Joi.number().required(),
})

export const getOrderList = async (req: Request, res: Response) => {
  try {
    const orderList = await OrderModel.find()

    return res.status(httpStatus.OK).json({ orderList })
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).send(error)
  }
}

export const updateOrder = async (req: Request, res: Response) => {
  const { orderId: _id } = req.params
  // check if requestBody invalid then respond BAD REQUEST status otherwise  handle value (order)
  const { value: order, error: orderError } = orderSchema.validate(req.body)
  if (orderError) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .send({ message: orderError.details[0].message })
  }

  try {
    // find and update order document
    const updatedOrder = await ProductModel.findByIdAndUpdate(
      _id,
      {
        ...order,
      },
      { new: true }
    )

    // respond OK status with updated order
    return res.status(httpStatus.OK).json({ updatedOrder })
  } catch (err) {
    // if orderId value or order value is not valid then respond status BAD REQUEST with err
    return res.status(httpStatus.BAD_REQUEST).send(err)
  }
}

export const deleteOrder = async (req: Request, res: Response) => {
  const { orderId: _id } = req.params

  try {
    await OrderModel.findByIdAndDelete(_id)

    return res.status(httpStatus.OK).send('successful delete')
  } catch (err) {
    return res.status(httpStatus.BAD_REQUEST).send(err)
  }
}
