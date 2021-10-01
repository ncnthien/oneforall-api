import firebaseApp from '../config/firebase.config'
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage'

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
