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
  setPixelatedFile: React.Dispatch<React.SetStateAction<File | undefined>>
}
export interface ICreatePostingButton {
  getPostingInfos: () => Promise<IPosting | undefined>
}
