import { getDownloadURL, getStorage, ref, uploadString } from 'firebase/storage'
import firebaseApp from '../config/firebase.config'
import {
  getAuth,
  signInWithCredential,
  GoogleAuthProvider,
  FacebookAuthProvider,
} from 'firebase/auth'

const storage = getStorage(firebaseApp)
const typeUploadString = 'base64'

export const uploadAvatar = async (
  avatarName: string,
  base64String: string
) => {
  const avatarFolderString = 'avatar'
  const avatarRef = ref(storage, `${avatarFolderString}/${avatarName}.jpg`)

  try {
    const snapshot = await uploadString(
      avatarRef,
      base64String,
      typeUploadString
    )
    const downloadURL = await getDownloadURL(snapshot.ref)

    return downloadURL
  } catch (error) {
    return error
  }
}

export const upLoadProductImg = async (
  productName: string,
  base64StringList: string[]
) => {
  const productFolderString = 'product'

  const convertBase64StringToImageUrl = async (
    base64String: string,
    index: number
  ): Promise<string> => {
    const productRef = ref(
      storage,
      `${productFolderString}/${productName}/${productName}-${index}.png`
    )

    try {
      const snapshot = await uploadString(
        productRef,
        base64String,
        typeUploadString
      )
      const downloadURL = await getDownloadURL(snapshot.ref)

      return downloadURL
    } catch (err) {
      return ''
    }
  }

  const convertedProductImageList: Promise<string>[] = base64StringList.map(
    (base64String, index) => {
      return convertBase64StringToImageUrl(base64String, index)
    }
  )
  return convertedProductImageList
}

export const brandUpload = {
  logo: async (brandName: string, base64String: string) => {
    const brandFolderString = 'brand/'
    const brandRef = ref(
      storage,
      `${brandFolderString}${brandName}/${brandName}-logo.png`
    )

    try {
      const snapshot = await uploadString(
        brandRef,
        base64String,
        typeUploadString
      )
      const downloadURL = await getDownloadURL(snapshot.ref)

      return downloadURL
    } catch (error) {
      return error
    }
  },
  banner: async (brandName: string, base64String: string) => {
    const brandFolderString = 'brand/'
    const brandRef = ref(
      storage,
      `${brandFolderString}${brandName}/${brandName}-banner.jpg`
    )

    try {
      const snapshot = await uploadString(
        brandRef,
        base64String,
        typeUploadString
      )
      const downloadURL = await getDownloadURL(snapshot.ref)

      return downloadURL
    } catch (error) {
      return error
    }
  },
}

export const uploadEventBanner = async (
  eventImageName: string,
  base64String: string
) => {
  const eventFolderString = 'event'
  const eventRef = ref(storage, `${eventFolderString}/${eventImageName}.jpg`)

  try {
    const snapshot = await uploadString(
      eventRef,
      base64String,
      typeUploadString
    )
    const downloadURL = await getDownloadURL(snapshot.ref)

    return downloadURL
  } catch (error) {
    return error
  }
}

export const getGoogleUser = async (token: string) => {
  const credential = GoogleAuthProvider.credential(token)
  const auth = getAuth()

  const data = await signInWithCredential(auth, credential).catch((error) => {
    throw error
  })

  return data.user
}

export const getFacebookUser = async (token: string) => {
  const credential = FacebookAuthProvider.credential(token)
  const auth = getAuth()

  const data = await signInWithCredential(auth, credential).catch((error) => {
    throw error
  })

  return data.user
}
