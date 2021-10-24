import { Request, Response } from 'express'
import httpStatus from '../constant/status.constant'
import BrandModel from '../model/brand.model'

export const getBrandDetail = async (req: Request, res: Response) => {
  const { brandName } = req.params
  try {
    const brand = await BrandModel.findOne({ value: brandName })

    return res.status(httpStatus.OK).json({ brand })
  } catch (error) {
    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR)
  }
}
