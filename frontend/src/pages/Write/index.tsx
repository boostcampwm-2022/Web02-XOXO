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
// import uploader from '@util/uploader'
import usePost from '@hooks/usePost'

const Write = () => {
  const [imageList, setImageList] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [isModalOpen, setModalOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const postImage = usePost('/image')

  useEffect(() => {
    const imageUrlList = Object.values(imageList).map((image: any) => {
      return URL.createObjectURL(image)
    })
    setImagePreviews(imageUrlList)
  }, [imageList])

  const handleImageState: ChangeEventHandler<HTMLInputElement> = (event: any) => {
    const images: FileList = event.target.files
    if (imageList.length + images.length > 10) {
      toast('이미지는 최대 10장만 업로드 가능합니다.')
      return
    }
    setImageList((prev) => [...prev, ...Array.from(images)])
  }

  const handleCameraButton = () => {
    if (inputRef.current !== null) {
      inputRef.current.click()
    }
  }
  const handleDeleteButton = (id: number) => {
    setImagePreviews(imagePreviews.filter((_, index) => index !== id))
    setImageList(imageList.filter((_, index) => index !== id))
  }
  const handleThumbnailModal = (e: any) => {
    e.stopPropagation()
    setModalOpen(true)
  }
  const isDisabledButton = () => {
    return imagePreviews.length === 0
  }
  const imageUpload = async () => {
    const formData = new FormData()
    imageList.forEach((image) => {
      console.log(image)
      formData.append('image', image)
    })
    const response = await postImage(formData)
    if (response !== undefined) return response.data
  }
  const handleUploadPosting = async () => {
    const imagePathList = await imageUpload()
    console.log(imagePathList)
    setImagePreviews([]) // TODO 추후 삭제
    setImageList([]) // TODO 추후 삭제
    // TODO 이 이미지 주소 리스트와 내용을 모두 api로 전달한다.
    // TODO 정상적으로 글쓰기가 완료되면, 피드페이지로 리다이렉트 시킨다.
  }

  return (
    <div className="write-page">
      {isModalOpen && (
        <ThumbnailPreview isModalOpen={isModalOpen} setModalOpen={setModalOpen} imageSrc={imagePreviews[0]} />
      )}
      <Header text="업로드" />
      <div className="write-body">
        <div className="image-list">
          {imagePreviews.length === 0 ? (
            <div className="text-container">
              <p className="title">아직 사진이 추가되지 않았어요</p>
              <p className="desc">아래 버튼을 눌러 사진을 추가해주세요!</p>
            </div>
          ) : (
            imagePreviews.map((image, id) => (
              <div className="image-holder" key={id}>
                <div>
                  <img className="image-holder" src={image} alt="이미지" />
                </div>
                <div className="image-delete-button" onClick={() => handleDeleteButton(id)}>
                  <XIcon width="2.5vw" height="3.75vw" fill="#ffffff" />
                </div>
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
            ref={inputRef}
            onChange={handleImageState}
          />
          <button className="thumbnail-preview" onClick={handleThumbnailModal} disabled={isDisabledButton()}>
            썸네일 미리보기
          </button>
        </div>
        <textarea className="text-area" placeholder="글 내용을 입력해주세요" />
        <button className="write-button" disabled={isDisabledButton()} onClick={handleUploadPosting}>
          게시물 업로드 하기
        </button>
        <Toast />
      </div>
    </div>
  )
}

export default Write
