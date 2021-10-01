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

export const updateBrand = async (req: Request, res: Response) => {
  const { body: brand } = req
  const { brandId: _id } = req.params
  if (!_id) {
    return res.sendStatus(httpStatus.BAD_REQUEST)
  }

  const existingBrand = await BrandModel.findOne({
    name: brand.name,
    _id: { $ne: _id },
  })
  if (existingBrand) {
    return res.status(httpStatus.BAD_REQUEST).send('Brand name has existed')
  }

  const queryBrand = await BrandModel.findById(_id)
  if (!queryBrand) {
    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR)
  }

  const cloneBrand = JSON.parse(JSON.stringify(queryBrand))
  const newBrand = { ...cloneBrand, ...brand, value: brand.name.toLowerCase() }

  try {
    if (brand.logo !== cloneBrand.logo) {
      const logoUrl = await brandUpload.logo(brand.name, brand.logo)
      newBrand.logo = logoUrl
    }

    if (brand.banner !== cloneBrand.banner) {
      const bannerUrl = await brandUpload.banner(brand.name, brand.banner)
      newBrand.banner = bannerUrl
    }

    await BrandModel.replaceOne({ _id }, newBrand)
    const replacingBrand = await BrandModel.findById(_id)

    return res.status(httpStatus.OK).send(replacingBrand)
  } catch (error) {
    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR)
  }
}
