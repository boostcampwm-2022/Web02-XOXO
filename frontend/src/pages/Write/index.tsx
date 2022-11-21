import React, { useState, useRef, useCallback } from 'react'
import Header from '@components/Header'
import './style.scss'
import { ReactComponent as CameraIcon } from '@assets/uploadCameraIcon.svg'
import { ReactComponent as XIcon } from '@assets/XIcon.svg'
import ThumbnailPreview from './ThumbnailPreview'

const Write = () => {
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [isModalOpen, setModalOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)
  // 이미지 상대경로 저장
  const handleAddImagePreviews = (event: any) => {
    const imageLists = event.target.files
    let imageUrlLists = [...imagePreviews]

    for (let i = 0; i < imageLists.length; i++) {
      const currentImageUrl = URL.createObjectURL(imageLists[i])
      imageUrlLists.push(currentImageUrl)
    }

    if (imageUrlLists.length > 10) {
      imageUrlLists = imageUrlLists.slice(0, 10)
    }

    setImagePreviews(imageUrlLists)
  }
  const onUploadImageButtonClick = useCallback(() => {
    if (inputRef.current !== null) {
      inputRef.current.click()
    }
  }, [])
  const handleDeleteImage = (id: number) => {
    setImagePreviews(imagePreviews.filter((_, index) => index !== id))
  }
  const handleModal = (e: any) => {
    e.stopPropagation()
    setModalOpen(true)
  }
  const isDisabledButton = () => {
    console.log(imagePreviews.length)
    return imagePreviews.length === 0
  }

  return (
        <div className='write-page'>
            {isModalOpen ? <ThumbnailPreview isModalOpen={isModalOpen} setModalOpen={setModalOpen} imageSrc={imagePreviews[0]}/> : null}
            <Header text="업로드"/>
            <div className="write-body">
                <div className="image-list">
                  {imagePreviews.length === 0
                    ? <div className="text-container">
                        <p className="title">아직 사진이 추가되지 않았어요</p>
                        <p className="desc">아래 버튼을 눌러 사진을 추가해주세요!</p>
                      </div>
                    : imagePreviews.map((image, id) => (
                        <div className='image-holder' key={id}>
                          <div>
                            <img className='image-holder' src={image} alt="이미지" />
                          </div>
                          <div className="image-delete-button" onClick={() => handleDeleteImage(id)}>
                              <XIcon width="2.5vw" height="3.75vw" fill="#ffffff"/>
                          </div>
                        </div>
                    ))}
                </div>
                <div className="button-bar-wrapper">
                  <CameraIcon onClick={onUploadImageButtonClick}/>
                  <input type="file" multiple className="image-input" accept='image/*' ref={inputRef} onChange={handleAddImagePreviews}/>
                  <button className='thumbnail-preview' onClick={handleModal} disabled={isDisabledButton()}>썸네일 미리보기</button>
                </div>
                <textarea className='text-area' placeholder='글 내용을 입력해주세요'/>
              <button className="write-button" disabled={isDisabledButton()}>게시물 업로드 하기</button>
            </div>
        </div>
  )
}

export default Write
