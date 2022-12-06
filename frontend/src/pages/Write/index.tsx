/* eslint-disable multiline-ternary */
/* eslint-disable @typescript-eslint/no-misused-promises */
import React, { useState, useRef, ChangeEventHandler, useEffect } from 'react'
import { toast } from 'react-toastify'
import Toast from '@src/components/Toast'
import Header from '@components/Header'
import './style.scss'
import { ReactComponent as CameraIcon } from '@assets/uploadCameraIcon.svg'
import { ReactComponent as XIcon } from '@assets/XIcon.svg'
import ThumbnailPreview from './ThumbnailPreview'
import usePost from '@hooks/usePost'
import { isEmpty } from 'lodash'
import { ImagePixelated } from 'react-pixelate'
import { compressImage } from '@src/util/imageCompress'
import { useNavigate, useParams } from 'react-router-dom'

interface IImage {
  originalImage: File
  compressedImage: File | undefined
  thumbnailSrc: string
}
interface IPosting {
  letter?: string
  thumbnail?: string
  images?: string[]
  feedId?: string
}

const Write = () => {
  const [images, setImages] = useState<IImage[]>([])
  const [isModalOpen, setModalOpen] = useState(false)
  const imageRef = useRef<HTMLInputElement>(null)
  const postImage = usePost('/image')
  const letterRef = useRef<HTMLTextAreaElement>(null)
  const [pixelatedFile, setPixelatedFile] = useState<File>()
  const { feedId } = useParams()
  const postPosting = usePost(`/posting/${feedId!}`)
  const navigate = useNavigate()

  useEffect(() => {
    const canvas = document.querySelector('canvas')
    canvas?.toBlob(
      (blob) => {
        const newPixelatedFile = new File([blob as BlobPart], 'name.jpeg', { type: 'image/jpeg' })
        setPixelatedFile(newPixelatedFile)
      },
      'image/jpeg',
      100
    )
  }, [images])
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

  const handleCameraButton = () => {
    if (!isEmpty(imageRef.current)) imageRef.current.click()
  }
  const handleDeleteButton = (src: string) => {
    const newImages = images.filter(({ thumbnailSrc }: IImage) => thumbnailSrc !== src)

    setImages(newImages)
  }
  const handleThumbnailModal = (e: any) => {
    e.stopPropagation()
    setModalOpen(true)
  }
  const uploadImage = async (files: File[]) => {
    const formData = new FormData()
    files.forEach((file) => formData.append('image', file))
    const { data } = await postImage(formData)
    return data
  }
  const handleUploadPosting = async () => {
    if (isEmpty(letterRef.current)) {
      toast('페이지에 오류가 있습니다. 새로고침 후 다시 작성해주세요.')
      return
    }
    if (isEmpty(images)) {
      toast('이미지를 1개이상 첨부해주세요.')
      return
    }
    if (images.some(({ compressedImage }: IImage) => isEmpty(compressedImage))) {
      toast('이미지 압축중입니다.')
      return
    }

    if (pixelatedFile === undefined) {
      toast('썸네일 생성중입니다.')
      return
    }

    const compressedImages = images.map(({ compressedImage }: IImage) => compressedImage as File)
    const imagesUrls: string[] = await uploadImage(compressedImages)

    const [thumbnail] = await uploadImage([pixelatedFile])
    const letter = letterRef.current?.value ?? ''

    const formData: IPosting = {
      letter,
      thumbnail,
      images: imagesUrls,
      feedId
    }

    const { success } = await postPosting(formData)
    if (success === true) navigate('/feed')
  }

  return (
    <div className="write-page">
      {isModalOpen && (
        <ThumbnailPreview
          isModalOpen={isModalOpen}
          setModalOpen={setModalOpen}
          imageSrc={URL.createObjectURL(pixelatedFile as Blob)}
        />
      )}
      <Header text="업로드" />
      <div className="write-body">
        <div className="image-list">
          {images.length === 0 ? (
            <button className="text-container" onClick={handleCameraButton}>
              <p className="title">아직 사진이 추가되지 않았어요</p>
              <p className="desc">아래 버튼을 눌러 사진을 추가해주세요!</p>
            </button>
          ) : (
            images.map(({ originalImage, thumbnailSrc, compressedImage }, id) => (
              <div className="image-holder" key={thumbnailSrc}>
                <div>
                  <img
                    className="image-holder"
                    src={thumbnailSrc}
                    alt={originalImage.name}
                    onLoad={async (e) => {
                      URL.revokeObjectURL(thumbnailSrc)
                      if (isEmpty(compressedImage)) {
                        const compressedImage = await compressImage(originalImage)
                        setImages((images) => {
                          const newImages = images.map((item) => {
                            if (item.thumbnailSrc === thumbnailSrc) item.compressedImage = compressedImage
                            return item
                          })
                          return newImages
                        })
                      }
                    }}
                  />
                </div>
                <button className="image-delete-button" onClick={() => handleDeleteButton(thumbnailSrc)}>
                  <XIcon width="2.5vw" height="3.75vw" fill="#ffffff" />
                </button>
              </div>
            ))
          )}
        </div>
        <div className="button-bar-wrapper">
          <CameraIcon onClick={handleCameraButton} />
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
        <button className="write-button" onClick={handleUploadPosting}>
          게시물 업로드 하기
        </button>
        <Toast />
      </div>
      {!isEmpty(images) && (
        <ImagePixelated
          src={URL.createObjectURL(images[0].originalImage)}
          width={240}
          height={240}
          pixelSize={12}
          centered={true}
          fillTransparencyColor={'#ffffff'}
        />
      )}
    </div>
  )
}

export default Write
