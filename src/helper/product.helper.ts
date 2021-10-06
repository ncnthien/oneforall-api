import ProductModel from '../model/product.model'
import { FilterObject, generateQueryProductList } from './filter.helper'

interface QueryParameter {
  pagination: {
    page: number
    limit: number
  }
  query: {
    type: 'laptop' | 'pc' | 'accessory'
    sort?: 'ascend' | 'descend'
    filter: FilterObject
  }
}

export const getFilteredProduct = async ({
  pagination,
  query,
}: QueryParameter) => {
  const { page, limit } = pagination
  const { type, sort, filter } = query

  // start and end number of products on per page
  const start = (page - 1) * limit + 1
  const end = page * limit

  const skip = (page - 1) * limit

  const { brandQuery, subBrandQuery, otherQuery } =
    generateQueryProductList(filter)

  if (sort) {
    if (sort === 'ascend') {
      const productList = (
        await ProductModel.find({ type, ...otherQuery })
          .populate([
            { path: 'brand', match: { ...brandQuery } },
            { path: 'subBrand', match: { ...subBrandQuery } },
          ])
          .sort({ price: 1 })
          .skip(skip)
          .limit(limit)
      ).filter((product) => product.brand && product.subBrand)

      return {
        productList,
        productDisplay: {
          start: productList.length > 0 ? start : 0,
          end: productList.length > end ? end : productList.length,
          total: productList.length,
        },
      }
    }

    if (sort === 'descend') {
      const productList = (
        await ProductModel.find({ type, ...otherQuery })
          .populate([
            { path: 'brand', match: { ...brandQuery } },
            { path: 'subBrand', match: { ...subBrandQuery } },
          ])
          .sort({ price: -1 })
          .skip(skip)
          .limit(limit)
      ).filter((product) => product.brand && product.subBrand)

      return {
        productList,
        productDisplay: {
          start: productList.length > 0 ? start : 0,
          end: productList.length > end ? end : productList.length,
          total: productList.length,
        },
      }
    }
  }

  const productList = (
    await ProductModel.find({ type, ...otherQuery })
      .populate([
        { path: 'brand', match: { ...brandQuery } },
        { path: 'subBrand', match: { ...subBrandQuery } },
      ])
      .skip(skip)
      .limit(limit)
  ).filter((product) => product.brand && product.subBrand)

  return {
    productList: productList.filter(
      (product) => product.brand && product.subBrand
    ),
    productDisplay: {
      start: productList.length > 0 ? start : 0,
      end: productList.length > end ? end : productList.length,
      total: productList.length,
    },
  }
}
