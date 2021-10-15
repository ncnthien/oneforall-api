import { Request, Response } from 'express'
import httpStatus from '../constant/status.constant'
import EventModel from '../model/event.model'
import ProductModel from '../model/product.model'

export const getData = async (req: Request, res: Response) => {
  try {
    const eventList = await EventModel.find({ isActive: true }).limit(10)
    const saleLaptopList = await ProductModel.find({
      type: 'laptop',
      isSale: true,
    }).limit(10)
    const laptopList = await ProductModel.find({ type: 'laptop' }).limit(10)
    const pcList = await ProductModel.find({ type: 'pc' }).limit(10)
    const accessoryList = await ProductModel.find({ type: 'accessory' }).limit(
      10
    )

    return res
      .status(httpStatus.OK)
      .json({ eventList, saleLaptopList, laptopList, pcList, accessoryList })
  } catch (error) {
    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR)
  }
}
