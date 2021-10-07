import { Request, Response } from 'express'
import httpStatus from '../constant/status.constant'
import EventModel from '../model/event.model'

export const getEvents = async (req: Request, res: Response) => {
  try {
    const queryEvents = await EventModel.find({ isActive: true })

    return res.status(httpStatus.OK).send(queryEvents)
  } catch (error) {
    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR)
  }
}
