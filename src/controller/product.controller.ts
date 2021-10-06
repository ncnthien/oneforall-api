import { Request, Response } from 'express'
import Joi from 'joi'
import httpStatus from '../constant/status.constant'
import { getFilteredProduct } from '../helper/product.helper'
import BrandModel from '../model/brand.model'
import ProductModel from '../model/product.model'

export const paginationSchema = Joi.object({
  page: Joi.number().default(1),
  limit: Joi.number().default(24),
})

export const querySchema = Joi.object({
  type: Joi.string().valid('laptop', 'pc', 'accessory').required(),
  sort: Joi.string().valid('ascend', 'descend'),
  filter: Joi.object({
    brand: Joi.string(),
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
  }),
})

export const getProductList = async (req: Request, res: Response) => {
  // check if requestQuery invalid then respond BAD REQUEST status otherwise  handle page, limit and sort value
  const { value: pagination, error: paginationError } =
    paginationSchema.validate(req.query)
  if (paginationError) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .send({ message: paginationError.details[0].message })
  }

  // check if requestBody invalid then respond BAD REQUEST status otherwise  handle filter
  const { value: query, error: queryError } = querySchema.validate(req.body)
  if (queryError) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .send({ message: queryError.details[0].message })
  }

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

export const getProductListOfBrand = async (req: Request, res: Response) => {
  const { brandId: _id } = req.params
  // check if requestQuery invalid then respond BAD REQUEST status otherwise  handle page, limit and sort value
  const { value: pagination, error: paginationError } =
    paginationSchema.validate(req.query)
  if (paginationError) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .send({ message: paginationError.details[0].message })
  }

  // check if requestBody invalid then respond BAD REQUEST status otherwise  handle filter
  const { value: query, error: queryError } = querySchema.validate(req.body)
  if (queryError) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .send({ message: queryError.details[0].message })
  }

  try {
    const { productList, productDisplay } = await getFilteredProduct({
      pagination,
      query,
    })

    const brand = await BrandModel.findById(_id)

    return res
      .status(httpStatus.OK)
      .json({ productList, productDisplay, brand })
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).send(error)
  }
}
