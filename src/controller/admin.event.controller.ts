import { Request, Response } from 'express'
import httpStatus from '../constant/status.constant'
import EventModel from '../model/event.model'
import { uploadEventBanner } from '../service/firebase'

export const getEvents = async (req: Request, res: Response) => {
  const { isActive } = req.params
}

export const addEvent = async (req: Request, res: Response) => {
  const { body: event } = req
  if (!event) {
    res.status(httpStatus.BAD_REQUEST).send('Body request is required')
  }

  const existingEvent = await EventModel.findOne({ title: event.title })
  if (existingEvent) {
    return res.status(httpStatus.BAD_REQUEST).send('Event has existed')
  }

  try {
    const bannerUrl = await uploadEventBanner(event.title, event.banner)
    const newEvent = { ...event, banner: bannerUrl }
    const createdEvent = await EventModel.create(newEvent)

    return res.status(httpStatus.OK).send(createdEvent)
  } catch (error) {
    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR)
  }
}
