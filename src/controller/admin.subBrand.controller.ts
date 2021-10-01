import { Request, Response } from 'express'
import { Types } from 'mongoose'
import httpStatus from '../constant/status.constant'
import SubBrandModel from '../model/subBrand.model'

export const getSubBrands = async (req: Request, res: Response) => {
  const { brandId } = req.params
  if (!brandId) {
    return res.status(httpStatus.BAD_GATEWAY).send('Brand id is not valid.')
  }

  try {
    const querySubBrands = await SubBrandModel.find({ brand: brandId })

    return res.status(httpStatus.OK).send(querySubBrands)
  } catch (error) {
    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR)
  }
}

export const addSubBrand = async (req: Request, res: Response) => {
  const { body: subBrand } = req
  const { brandId } = req.params
  if (!subBrand || !brandId) {
    return res.status(httpStatus.BAD_GATEWAY).send('Request is not valid.')
  }

  const existingSubBrand = await SubBrandModel.findOne({
    $and: [{ value: subBrand.name.toLowerCase(), brand: brandId }],
  })
  if (existingSubBrand) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .send('Sub brand name has existed in this brand')
  }

  const newSubBrand = {
    brand: new Types.ObjectId(brandId),
    name: subBrand.name,
    value: subBrand.name.toLowerCase(),
  }

  try {
    const createdSubBrand = await SubBrandModel.create(newSubBrand)

    return res.status(httpStatus.CREATED).send(createdSubBrand)
  } catch (error) {
    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR)
  }
}

export const updateSubBrand = async (req: Request, res: Response) => {
  const { body: subBrand } = req
  const { subBrandId, brandId } = req.params
  if (!subBrand || !subBrandId || !brandId) {
    return res.status(httpStatus.BAD_GATEWAY).send('Request is not valid.')
  }

  const existingSubBrand = await SubBrandModel.findOne({
    $and: [{ value: subBrand.name.toLowerCase(), brand: brandId }],
  })
  if (existingSubBrand) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .send('Sub brand name has existed in this brand')
  }

  try {
    await SubBrandModel.updateOne(
      { _id: subBrandId },
      { $set: { name: subBrand.name, value: subBrand.name.toLowerCase() } }
    )

    const newSubBrand = await SubBrandModel.findOne({ _id: subBrandId })

    return res.status(httpStatus.OK).send(newSubBrand)
  } catch (error) {
    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR)
  }
}
