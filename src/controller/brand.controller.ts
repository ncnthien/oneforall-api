import { Request, Response } from 'express'
import httpStatus from '../constant/status.constant'
import { getFilteredProduct } from '../helper/product.helper'
import BrandModel from '../model/brand.model'
import ProductModel from '../model/product.model'
import { querySchema } from './product.controller'

export const getBrand = async (req: Request, res: Response) => {
  const { brandName } = req.params
  try {
    const brand = await BrandModel.findOne({ value: brandName })

    return res.status(httpStatus.OK).json({ brand })
  } catch (error) {
    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR)
  }
}

export const getProductList = async (req: Request, res: Response) => {
  const { brandId } = req.params
  // check if requestQuery invalid then respond BAD REQUEST status otherwise  handle filter
  const { value, error } = querySchema.validate(req.query)
  if (error) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .send({ message: error.details[0].message })
  }

  const { page, limit, ...query } = value
  const pagination = { page, limit }
  try {
    const { productList, productDisplay } = await getFilteredProduct({
      pagination,
      query,
    })

    const laptopList = await ProductModel.find({
      type: 'laptop',
      brand: brandId,
    })
    const pcList = await ProductModel.find({
      type: 'pc',
      brand: brandId,
    })
    const accessoryList = await ProductModel.find({
      type: 'accessory',
      brand: brandId,
    })

    return res.status(httpStatus.OK).json({
      productList,
      productDisplay,
      total: {
        laptop: laptopList.length,
        pc: pcList.length,
        accessory: accessoryList.length,
      },
    })
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).send(error)
  }
}
