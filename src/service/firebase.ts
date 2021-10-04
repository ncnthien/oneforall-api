import { getDownloadURL, getStorage, ref, uploadString } from 'firebase/storage'
import firebaseApp from '../config/firebase.config'

const storage = getStorage(firebaseApp)

const avatarFolderString = 'avatar/'
const typeUploadString = 'base64'

export const uploadAvatar = async (
  avatarName: string,
  base64String: string
) => {
  const avatarRef = ref(storage, avatarFolderString + avatarName)

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
