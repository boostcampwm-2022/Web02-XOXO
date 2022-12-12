export interface IImage {
  originalImage: File
  compressedImage: File | undefined
  thumbnailSrc: string
}
export interface IPosting {
  letter?: string
  thumbnail?: string
  images?: string[]
  feedId?: string
}
export interface IImageCards {
  images: IImage[]
  setImages: React.Dispatch<React.SetStateAction<IImage[]>>
}
export interface ICreatePostingButton {
  getPostingInfos: () => Promise<IPosting | undefined>
}
