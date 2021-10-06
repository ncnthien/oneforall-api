import { Request, Response } from 'express'
import httpStatus from '../constant/status.constant'
import ProductModel from '../model/product.model'

export const search = async (req: Request, res: Response) => {
  const defaultPage = 1
  const defaultLimit = 24
  const page = parseInt(req.query.page as string) || defaultPage
  const limit = parseInt(req.query.limit as string) || defaultLimit
  const { q } = req.query
  if (!q) {
    return res.status(httpStatus.BAD_REQUEST).send('parameter is not valid')
  }

  try {
    const queryProducts = await ProductModel.find(
      { name: new RegExp(q as string, 'i') },
      null,
      {
        limit: limit,
        skip: (page - 1) * limit,
        count: true,
      }
    )

    const totalProducts = await ProductModel.count({
      name: new RegExp(q as string, 'i'),
    })

    if (queryProducts.length <= 0) {
      return res.status(httpStatus.NO_CONTENT).send({
        productList: queryProducts,
      })
    }

    const startItemNumber = (page - 1) * limit + 1
    const endItemNumber = limit * page
    const itemTotal = totalProducts

    return res.status(httpStatus.OK).send({
      productList: queryProducts,
      productDisplay: {
        start: startItemNumber,
        end: endItemNumber,
        total: itemTotal,
      },
    })
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error)
  }
}
