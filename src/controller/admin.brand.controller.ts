import { Request, Response } from 'express'
import httpStatus from '../constant/status.constant'
import BrandModel from '../model/brand.model'
import { brandUpload } from '../service/firebase'

export const getBrands = async (req: Request, res: Response) => {
  try {
    const queryBrands = await BrandModel.find()

    return res.status(httpStatus.OK).send(queryBrands)
  } catch (error) {
    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR)
  }
}

export const getBrand = async (req: Request, res: Response) => {
  const { brandId: _id } = req.params
  if (!_id) {
    return res.sendStatus(httpStatus.BAD_REQUEST)
  }

  try {
    const queryBrand = await BrandModel.findById(_id)

    return res.status(httpStatus.OK).send(queryBrand)
  } catch (error) {
    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR)
  }
}

export const addBrand = async (req: Request, res: Response) => {
  const { body: brand } = req

  if (!brand.logo && brand.banner) {
    return res.status(httpStatus.BAD_REQUEST).send('Logo and banner is needed')
  }

  const queryBrand = await BrandModel.findOne({ name: brand.name })
  if (queryBrand) {
    return res.status(httpStatus.BAD_REQUEST).send('Brand has existed')
  }

  try {
    const [logoUrl, bannerUrl] = await Promise.all([
      brandUpload.logo(brand.name, brand.logo),
      brandUpload.banner(brand.name, brand.banner),
    ])

    const addedBrand = await BrandModel.create({
      ...brand,
      value: brand.name.toLowerCase(),
      logo: logoUrl,
      banner: bannerUrl,
    })

    return res.status(httpStatus.CREATED).send(addedBrand)
  } catch (error) {
    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR)
  }
}
