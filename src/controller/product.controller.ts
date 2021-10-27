import { Request, Response } from 'express'
import Joi from 'joi'
import httpStatus from '../constant/status.constant'
import { getFilteredProduct } from '../helper/product.helper'
import ProductModel from '../model/product.model'

export const querySchema = Joi.object({
  page: Joi.number().default(1),
  limit: Joi.number().default(24),
  type: Joi.string().valid('laptop', 'pc', 'accessory').required(),
  sort: Joi.string().valid('ascend', 'descend'),
  brand: Joi.string(),
  isSale: Joi.bool(),
  subBrand: Joi.string(),
  price: Joi.object({
    min: Joi.number(),
    max: Joi.number(),
  }),
  cpu: Joi.string(),
  ram: Joi.string(),
  hardDrive: Joi.string(),
  hardDriveNumber: Joi.number(),
  monitorDimension: Joi.object({
    min: Joi.number(),
    max: Joi.number(),
  }),
  monitorRatio: Joi.string(),
  monitorBackground: Joi.string(),
  frequency: Joi.string(),
  graphicsCard: Joi.string(),
  graphicsMemory: Joi.string(),
  weight: Joi.object({
    min: Joi.number(),
    max: Joi.number(),
  }),
  resolution: Joi.string(),
  accessoryType: Joi.string(),
})

export const getProductList = async (req: Request, res: Response) => {
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

    return res.status(httpStatus.OK).json({ productList, productDisplay })
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).send(error)
  }
}

export const getProductDetail = async (req: Request, res: Response) => {
  const { productId: _id } = req.params
  try {
    const product = await ProductModel.findById(_id)

    // respond OK status with product
    return res.status(httpStatus.OK).json({ product })
  } catch (error) {
    // if productId is not valid then respond status BAD REQUEST with err
    return res.status(httpStatus.BAD_REQUEST).send(error)
  }
}
