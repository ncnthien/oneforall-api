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
  if (!brandId) {
    return res.status(httpStatus.BAD_GATEWAY).send('Brand id is not valid.')
  }

  const existingSubBrand = await SubBrandModel.findOne({
    $and: [{ name: subBrand.name, brand: brandId }],
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

// export const updateSubBrand = async (req: Request, res: Response) => {
//   const { subBrandId } = req.params
// }
