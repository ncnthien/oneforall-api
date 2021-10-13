import { getDownloadURL, getStorage, ref, uploadString } from 'firebase/storage'
import firebaseApp from '../config/firebase.config'

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

  const base64Regex =
    /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$/

  const convertedProductImageList: Promise<string>[] = base64StringList.map(
    (base64String, index) => {
      if (base64Regex.test(base64String)) {
        return convertBase64StringToImageUrl(base64String, index)
      }
      const imageUrl: Promise<string> = new Promise((resolve) => {
        resolve(base64String)
      })

      return imageUrl
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
