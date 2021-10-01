import { Request, Response } from 'express'
import httpStatus from '../constant/status.constant'
import EventModel from '../model/event.model'
import { uploadEventBanner } from '../service/firebase'

export const getEvents = async (req: Request, res: Response) => {
  try {
    const queryEvents = await EventModel.find()

    return res.status(httpStatus.OK).send(queryEvents)
  } catch (error) {
    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR)
  }
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

export const updateEvent = async (req: Request, res: Response) => {
  const {
    body: event,
    params: { eventId: _id },
  } = req
  if (!_id) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .send('Params request is not valid')
  }

  const existingEvent = await EventModel.findOne({
    $and: [{ title: event.title }, { _id: { $ne: _id } }],
  })
  if (existingEvent) {
    return res.status(httpStatus.BAD_REQUEST).send('Event has existed')
  }

  const queryEvent = await EventModel.findById(_id)
  const cloneEvent = JSON.parse(JSON.stringify(queryEvent))

  try {
    if (event.banner && event.banner !== cloneEvent.banner) {
      const bannerUrl = await uploadEventBanner(event.name, event.banner)
      event.banner = bannerUrl
    }

    const newEvent = { ...cloneEvent, ...event }
    await EventModel.replaceOne({ _id }, newEvent)
    const replacingEvent = await EventModel.findOne({ _id })

    return res.status(httpStatus.OK).send(replacingEvent)
  } catch (error) {
    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR)
  }
}
