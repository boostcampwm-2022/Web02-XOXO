/* eslint-disable multiline-ternary */
/* eslint-disable @typescript-eslint/no-misused-promises */
import React, { useState, useRef, ChangeEventHandler } from 'react'
import { toast } from 'react-toastify'
import Toast from '@src/components/Toast'
import Header from '@components/Header'
import './style.scss'
import { ReactComponent as CameraIcon } from '@assets/uploadCameraIcon.svg'
import ThumbnailPreview from './ThumbnailPreview'
import usePost from '@hooks/usePost'
import { isEmpty } from 'lodash'
import { useParams } from 'react-router-dom'
import { uploadImage } from '@src/util/uploadImage'
import { IImage, IPosting } from './types'
import CreatePostingButton from './CreatePostingButton'
import ImageCards from './ImageCards'

const Write = () => {
  const [images, setImages] = useState<IImage[]>([])
  const imageRef = useRef<HTMLInputElement>(null)
  const letterRef = useRef<HTMLTextAreaElement>(null)
  const [pixelatedFile, setPixelatedFile] = useState<File>()
  const [isModalOpen, setModalOpen] = useState(false)
  const postImage = usePost('/image')
  const { feedId } = useParams()

  const handleImageState: ChangeEventHandler<HTMLInputElement> = async (event: any) => {
    const newImages: FileList = event.target.files
    if (images.length + newImages.length > 10) {
      toast('이미지는 최대 10장만 업로드 가능합니다.')
      return
    }
    setImages((prev) => [
      ...prev,
      ...Array.from(newImages).map((image): IImage => {
        return {
          originalImage: image,
          compressedImage: undefined,
          thumbnailSrc: URL.createObjectURL(image)
        }
      })
    ])
  }

  const openImageInput = () => {
    if (!isEmpty(imageRef.current)) imageRef.current.click()
  }

  const handleThumbnailModal = (e: any) => {
    e.stopPropagation()
    setModalOpen(true)
  }

  const getPostingInfos = async (): Promise<IPosting | undefined> => {
    if (isEmpty(letterRef.current)) {
      toast('페이지에 오류가 있습니다. 새로고침 후 다시 작성해주세요.')
      return undefined
    }
    if (isEmpty(images)) {
      toast('이미지를 1개이상 첨부해주세요.')
      return undefined
    }
    if (images.some(({ compressedImage }: IImage) => isEmpty(compressedImage))) {
      toast('이미지 압축중입니다.')
      return undefined
    }

    if (pixelatedFile === undefined) {
      toast('썸네일 생성중입니다.')
      return undefined
    }
    return {
      letter: letterRef.current.value,
      thumbnail: await getThumbnailUrl(),
      images: await getImageUrls(),
      feedId
    }
  }

  const getImageUrls = async () => {
    const compressedImages = images.map(({ compressedImage }: IImage) => compressedImage as File)
    const imagesUrls: string[] = await uploadImage(compressedImages, postImage)
    return imagesUrls
  }

  const getThumbnailUrl = async () => {
    const [thumbnail] = await uploadImage([pixelatedFile!], postImage)
    return thumbnail
  }

  return (
    <div className="write-page">
      {isModalOpen && !isEmpty(images) && (
        <ThumbnailPreview
          isModalOpen={isModalOpen}
          setModalOpen={setModalOpen}
          imageFile={images[0].originalImage}
          setPixelatedFile={setPixelatedFile}
        />
      )}
      <Header text="업로드" />
      <div className="write-body">
        <div className="image-list">
          {images.length === 0 ? (
            <button className="text-container" onClick={openImageInput}>
              <p className="title">아직 사진이 추가되지 않았어요</p>
              <p className="desc">아래 버튼을 눌러 사진을 추가해주세요!</p>
            </button>
          ) : (
            <ImageCards images={images} setImages={setImages} />
          )}
        </div>
        <div className="button-bar-wrapper">
          <CameraIcon onClick={openImageInput} />
          <input
            type="file"
            multiple
            className="image-input"
            accept="image/*"
            ref={imageRef}
            onChange={handleImageState}
          />
          {!isEmpty(images) && (
            <button className="thumbnail-preview" onClick={handleThumbnailModal}>
              썸네일 미리보기
            </button>
          )}
        </div>
        <textarea className="text-area" placeholder="글 내용을 입력해주세요" ref={letterRef} />
        <CreatePostingButton getPostingInfos={getPostingInfos} />
        <Toast />
      </div>
    </div>
  )
}

export default Write
