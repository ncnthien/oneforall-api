import { Request, Response } from 'express'
import Joi from 'joi'
import httpStatus from '../constant/status.constant'
import ProductModel from '../model/product.model'
import { upLoadProductImg } from '../service/firebase'
import { paginationSchema } from './product.controller'

const productSchema = Joi.object({
  name: Joi.string().required(),
  type: Joi.string().valid('laptop', 'pc', 'accessory').required(),
  brand: Joi.string().required(),
  subBrand: Joi.string().required(),
  price: Joi.number().required(),
  isSale: Joi.boolean().required(),
  reducedPrice: Joi.number(),
  images: Joi.array().items(Joi.string().base64()).min(1).required(),
  quantity: Joi.number().required(),
  cpu: Joi.object({ value: Joi.string().required(), text: Joi.string() }),
  ram: Joi.object({ value: Joi.string().required(), text: Joi.string() }),
  hardDrive: Joi.object({
    value: Joi.string().required(),
    text: Joi.string(),
  }),
  hardDriveNumber: Joi.object({
    value: Joi.string().required(),
    text: Joi.string(),
  }),
  monitorDimension: Joi.object({
    value: Joi.string().required(),
    text: Joi.string(),
  }),
  monitorRatio: Joi.object({
    value: Joi.string().required(),
    text: Joi.string(),
  }),
  monitorBackground: Joi.object({
    value: Joi.string().required(),
    text: Joi.string(),
  }),
  frequency: Joi.object({
    value: Joi.string().required(),
    text: Joi.string(),
  }),
  graphicsCard: Joi.object({
    value: Joi.string().required(),
    text: Joi.string(),
  }),
  graphicsMemory: Joi.object({
    value: Joi.string().required(),
    text: Joi.string(),
  }),
  weight: Joi.object({ value: Joi.string().required(), text: Joi.string() }),
  resolution: Joi.object({
    value: Joi.string().required(),
    text: Joi.string(),
  }),
  accessoryType: Joi.object({
    value: Joi.string().required(),
    text: Joi.string(),
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

  try {
    const { page, limit } = pagination
    const productList = await ProductModel.find()
      .skip((page - 1) * limit)
      .limit(limit)

    // respond OK status with product list
    return res.status(httpStatus.OK).json({ productList })
  } catch (error) {
    // if productId is not valid then respond status BAD REQUEST with err
    return res.status(httpStatus.BAD_REQUEST).send(error)
  }
}

export const addProduct = async (req: Request, res: Response) => {
  // check if requestBody invalid then respond BAD REQUEST status otherwise  handle value (product)
  const { value: product, error: productError } = productSchema.validate(
    req.body
  )
  if (productError) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .send({ message: productError.details[0].message })
  }

  // check if product exists then respond BAD REQUEST status
  const existingProduct = await ProductModel.findOne({ name: product.name })
  if (existingProduct) {
    return res.status(httpStatus.BAD_REQUEST).send('product already exists')
  }

  // covert base64 array to image url array and upload on firebase storage
  const convertedImages = await Promise.all(
    await upLoadProductImg(product.name, product.images)
  )

  const newProduct = new ProductModel({
    ...product,
    images: convertedImages,
  })

  try {
    // insert new product document to database
    const savedProduct = await newProduct.save()

    // respond CREATE status with new product
    return res.status(httpStatus.CREATED).json({ product: savedProduct })
  } catch (err) {
    // if product value is not valid then respond status BAD REQUEST with err
    return res.status(httpStatus.BAD_REQUEST).send(err)
  }
}

export const updateProduct = async (req: Request, res: Response) => {
  const { productId: _id } = req.params
  // check if requestBody invalid then respond BAD REQUEST status otherwise  handle value (product)
  const { value: product, error: productError } = productSchema.validate(
    req.body
  )
  if (productError) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .send({ message: productError.details[0].message })
  }

  try {
    // find and update product document
    const updatedProduct = await ProductModel.findByIdAndUpdate(
      _id,
      {
        ...product,
      },
      { new: true }
    )

    // respond OK status with updated product
    return res.status(httpStatus.OK).json({ updatedProduct })
  } catch (err) {
    // if productId value or product value is not valid then respond status BAD REQUEST with err
    return res.status(httpStatus.BAD_REQUEST).send(err)
  }
}

export const deleteProduct = async (req: Request, res: Response) => {
  const { productId: _id } = req.params

  try {
    await ProductModel.findByIdAndDelete(_id)

    return res.status(httpStatus.OK).send('successful delete')
  } catch (err) {
    return res.status(httpStatus.BAD_REQUEST).send(err)
  }
}
