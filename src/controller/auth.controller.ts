import bcrypt from 'bcryptjs'
import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import config from '../config'
import httpStatus from '../constant/status.constant'
import UserModel from '../model/user.model'
import { getFacebookUser, getGoogleUser } from '../service/firebase'

interface UserPostLogin {
  email: string
  password: string
}
interface UserPostRegister extends UserPostLogin {
  username: string
}

export const login = async (req: Request, res: Response) => {
  const { email, password }: UserPostLogin = req.body

  const user = await UserModel.findOne({ email })
  // check if user does not exist then respond BAD REQUEST status
  if (!user) {
    return res.status(httpStatus.BAD_REQUEST).send('user does not exist')
  }

  // compare password with hash if different then respond BAD REQUEST status
  const validPassword = await bcrypt.compare(password, user.password)
  if (!validPassword) {
    return res.status(httpStatus.BAD_REQUEST).send('password is incorrect')
  }

  // generate access token
  const payload = { _id: user._id }
  const token = jwt.sign(payload, config.jwtPrivateKey, {
    expiresIn: config.refreshTokenTtl,
  })

  // respond OK status with access token
  return res.status(httpStatus.OK).json({ token })
}

export const register = async (req: Request, res: Response) => {
  const { email, username, password }: UserPostRegister = req.body

  const existingUser = await UserModel.findOne({ email })
  // check if user exists then respond BAD REQUEST status
  if (existingUser) {
    return res.status(httpStatus.BAD_REQUEST).send('email has been taken')
  }

  //use bcrypt to generate hashed password
  const salt = await bcrypt.genSalt(config.saltWorkFactor)
  const hash = await bcrypt.hash(password, salt)

  const newUser = new UserModel({
    email,
    username,
    password: hash,
  })

  try {
    // insert new user document to database
    const savedUser = await newUser.save()

    // generate access token
    const payload = { _id: savedUser._id }
    const token = jwt.sign(payload, config.jwtPrivateKey, {
      expiresIn: config.refreshTokenTtl,
    })

    // respond CREATE status with access token
    return res.status(httpStatus.CREATED).json({ token })
  } catch (err) {
    // if user value is not valid then respond status BAD REQUEST with err
    return res.status(httpStatus.BAD_REQUEST).send(err)
  }
}

export const googleLogin = async (req: Request, res: Response) => {
  const { tokenId } = req.body
  let user

  try {
    user = await getGoogleUser(tokenId)
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).send(error)
  }

  try {
    const existingUser = await UserModel.findOne({
      email: user.email as string,
    })

    // Register if user has not registered yet
    if (!existingUser) {
      const newUser = new UserModel({
        email: user.email,
        username: user.displayName,
        avatar: user.photoURL,
      })

      const savedUser = await newUser.save()

      const payload = { _id: savedUser._id }
      const token = jwt.sign(payload, config.jwtPrivateKey, {
        expiresIn: config.refreshTokenTtl,
      })

      return res.status(httpStatus.CREATED).json({ token })
    }

    // Login if user has registered already
    const payload = { _id: existingUser._id }
    const token = jwt.sign(payload, config.jwtPrivateKey, {
      expiresIn: config.refreshTokenTtl,
    })

    return res.status(httpStatus.OK).json({ token })
  } catch (error) {
    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR)
  }
}

export const facebookLogin = async (req: Request, res: Response) => {
  const { accessToken } = req.body
  if (!accessToken) {
    const accessTokenError = 'Access token is required'
    return res.status(httpStatus.BAD_REQUEST).send(accessTokenError)
  }

  let user

  try {
    user = await getFacebookUser(accessToken)
  } catch (error: any) {
    // Check if email used to register has been taken, login instead of register another user
    const accountExistingErrorCode =
      'auth/account-exists-with-different-credential'

    if (error.code === accountExistingErrorCode) {
      const existingUser = await UserModel.findOne({
        email: error.customData.email as string,
      })
      if (!existingUser) {
        return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR)
      }

      const payload = { _id: existingUser._id }
      const token = jwt.sign(payload, config.jwtPrivateKey, {
        expiresIn: config.refreshTokenTtl,
      })

      return res.status(httpStatus.OK).json({ token })
    }

    return res.status(httpStatus.BAD_REQUEST).send(error)
  }

  try {
    const existingUser = await UserModel.findOne({
      email: user.email as string,
    })

    // Register if user has not registered yet
    if (!existingUser) {
      const newUser = new UserModel({
        email: user.email,
        username: user.displayName,
        avatar: user.photoURL,
      })

      const savedUser = await newUser.save()

      const payload = { _id: savedUser._id }
      const token = jwt.sign(payload, config.jwtPrivateKey, {
        expiresIn: config.refreshTokenTtl,
      })

      return res.status(httpStatus.CREATED).json({ token })
    }

    // Login if user has registered already
    const payload = { _id: existingUser._id }
    const token = jwt.sign(payload, config.jwtPrivateKey, {
      expiresIn: config.refreshTokenTtl,
    })

    return res.status(httpStatus.OK).json({ token })
  } catch (error) {
    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR)
  }
}
