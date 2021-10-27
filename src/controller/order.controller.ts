import { Request, Response } from 'express'
import httpStatus from '../constant/status.constant'
import OrderModel from '../model/order.model'

export const getOrderList = async (req: Request, res: Response) => {
  const { _id } = req.payloadToken

  try {
    const orderList = await OrderModel.find({ user: _id }).populate(
      'products.productRef',
      'name'
    )
    let total = 0

    orderList.forEach((order) => {
      order.products.forEach((item) => {
        total += item.cost
      })
    })

    return res.status(httpStatus.OK).json({ orderList, total })
  } catch (error) {
    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR)
  }
}
