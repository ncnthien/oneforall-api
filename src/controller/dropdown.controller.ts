import { Request, Response } from 'express'
import httpStatus from '../constant/status.constant'
import ProductModel from '../model/product.model'
import SubBrandModel from '../model/subBrand.model'

export const getDropdown = async (req: Request, res: Response) => {
  try {
    const laptopList = await ProductModel.find({ type: 'laptop' }).populate(
      'brand'
    )
    const laptopBrandList = laptopList
      .map((laptop) => laptop.brand)
      .filter((brand, index, array) => {
        return index === array.findIndex((b) => b.value === brand.value)
      })
    const laptopDropdownList = await Promise.all(
      laptopBrandList.map(async (brand) => {
        const querySubBrand = await SubBrandModel.find({ brand: brand._id })
        const subBrandList = querySubBrand.map((subBrand) => {
          return {
            _id: subBrand._id,
            subBrand: subBrand.name,
            queryUrl: `/brand/${brand.value}?subBrand=${brand.value}`,
          }
        })

        return {
          _id: brand._id,
          brand: brand.name,
          brandUrl: `/brand/${brand.value}`,
          subBrandList,
        }
      })
    )

    const pcList = await ProductModel.find({ type: 'pc' }).populate('brand')
    const pcBrandList = pcList
      .map((pc) => pc.brand)
      .filter((brand, index, array) => {
        return index === array.findIndex((b) => b.value === brand.value)
      })
    const pcDropdownList = await Promise.all(
      pcBrandList.map(async (brand) => {
        const querySubBrand = await SubBrandModel.find({ brand: brand._id })
        const subBrandList = querySubBrand.map((subBrand) => {
          return {
            _id: subBrand._id,
            subBrand: subBrand.name,
            queryUrl: `/brand/${brand.value}?subBrand=${brand.value}`,
          }
        })

        return {
          _id: brand._id,
          brand: brand.name,
          brandUrl: `/brand/${brand.value}`,
          subBrandList,
        }
      })
    )

    return res
      .status(httpStatus.OK)
      .json({ laptopDropdownList, pcDropdownList })
  } catch (err) {
    return res.sendStatus(httpStatus.BAD_REQUEST)
  }
}
