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
    isSale?: boolean
  }
}

export const getFilteredProduct = async ({
  pagination,
  query,
}: QueryParameter) => {
  const { page, limit } = pagination
  const { type, sort, isSale, ...filter } = query

  // start and end number of products on per page
  const start = (page - 1) * limit + 1
  const end = page * limit

  const skip = (page - 1) * limit

  const { brandQuery, subBrandQuery, otherQuery } =
    await generateQueryProductList(filter)

  const sortNumber = sort === 'ascend' ? 1 : sort === 'descend' ? -1 : null
  let sortQuery = {}
  if (sortNumber) {
    sortQuery = { price: sortNumber }
  }
  const isSaleQuery = isSale ? { isSale: true } : {}
  const productQuery = {
    type,
    ...otherQuery,
    ...brandQuery,
    ...subBrandQuery,
    ...isSaleQuery,
  }

  const productList = await ProductModel.find(productQuery)
    .skip(skip)
    .limit(limit)
    .sort({ ...sortQuery })

  const total = await ProductModel.find(productQuery).count()

  return {
    productList,
    productDisplay: {
      start: productList.length > 0 ? start : 0,
      end: productList.length > end ? end : productList.length,
      total,
    },
  }
}
