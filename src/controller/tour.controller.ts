import { Request, Response } from 'express'
import httpStatus from '../constant/status.constant'
import TourModel from '../model/tour.model'

export const getTours = async (req: Request, res: Response) => {
  const { page = 1, limit = 10, name, email, phone } = req.query
  const skip = (Number(page) - 1) * Number(limit)

  try {
    // const tours = await TourModel.insertMany([
    //   {
    //     name: 'Hạ Du ngoạn Vịnh Hạ Long từ không trung',
    //     image:
    //       'https://media.travel.com.vn/destination/dg_200827_HA%20LONG_322052888.jpg',
    //     price: 9999999,
    //     star: 8,
    //     startDate: new Date(),
    //     description:
    //       'Tới Abu Dhabi, quý khách sẽ được du lịch trên sa mạc và trải nghiệm chương trình Desert safari mạo hiểm ngồi trên Land Cruiser với tốc độ chóng mặt và băng qua những triền cát dốc cao, cua gấp nhiều lần. Sau đó thưởng thức bữa tiệc đồ nướng tại những túp lều dựng bằng lá cọ khô trải trên thảm thô. Tại đây, Quý khách có thể tham gia cưỡi lạc đà, nghe điệu nhạc Ả rập nhẹ nhàng và xem chương trình múa.',
    //     address: 'Hồ Chí Minh',
    //     remainSlot: 10,
    //     createdAt: new Date(),
    //     phone: '01230123123',
    //     email: 'travel-com@gmail.com',
    //   },
    // ])
    const tours = await TourModel.find()
      .sort({ _id: -1 })
      .skip(skip)
      .limit(Number(limit))

    return res.status(httpStatus.OK).send(tours)
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).send(error)
  }
}

export const addTours = async (req: Request, res: Response) => {
  const data = req.body

  try {
    await TourModel.insertMany([data])
    return res.status(httpStatus.OK).send('Created successfuly')
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).send(error)
  }
}

export const updateTour = async (req: Request, res: Response) => {
  const { tourId } = req.params
  const data = req.body

  try {
    await TourModel.updateOne({ _id: tourId }, data)
    return res.status(httpStatus.OK).send('Updated successfuly')
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).send(error)
  }
}

export const deleteTour = async (req: Request, res: Response) => {
  const { tourId } = req.params

  try {
    await TourModel.remove({ _id: tourId })
    return res.status(httpStatus.OK).send('Deleted successfuly')
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).send(error)
  }
}
