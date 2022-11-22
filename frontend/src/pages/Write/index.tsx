import React, { useState, useRef } from 'react'
import Header from '@components/Header'
import './style.scss'
import { ReactComponent as CameraIcon } from '@assets/uploadCameraIcon.svg'
import { ReactComponent as XIcon } from '@assets/XIcon.svg'
import ThumbnailPreview from './ThumbnailPreview'
import { toast } from 'react-toastify'
import Toast from '@src/components/Toast'

const Write = () => {
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [isModalOpen, setModalOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)

  /**
   * input으로 받은 이미지 객체를 url로 바꾸어 주는 함수입니다.
   * @param event 이미지를 input으로 받은 event 객체
   */
  const onChangeImagePreviews = (event: any) => {
    const imageLists = event.target.files
    const imageUrlLists = [...imagePreviews]
    if (Number(imageLists.length) + Number(imageUrlLists.length) > 10) {
      toast('이미지는 최대 10장만 업로드 가능합니다.')
      return
    }
    Object.values(imageLists).forEach((image: any) => {
      imageUrlLists.push(URL.createObjectURL(image))
    })
    setImagePreviews(imageUrlLists)
  }
  const onClickCameraIcon = () => {
    if (inputRef.current !== null) {
      inputRef.current.click()
    }
  }
  const onClickDeleteButton = (id: number) => {
    setImagePreviews(imagePreviews.filter((_, index) => index !== id))
  }
  const isDisabledButton = () => {
    return imagePreviews.length === 0
  }
  const onClickThumbnailModal = (e: any) => {
    e.stopPropagation()
    setModalOpen(true)
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
                          <div className="image-delete-button" onClick={() => onClickDeleteButton(id)}>
                              <XIcon width="2.5vw" height="3.75vw" fill="#ffffff"/>
                          </div>
                        </div>
                    ))}
                </div>
                <div className="button-bar-wrapper">
                  <CameraIcon onClick={onClickCameraIcon}/>
                  <input type="file" multiple className="image-input" accept='image/*' ref={inputRef} onChange={onChangeImagePreviews}/>
                  <button className='thumbnail-preview' onClick={onClickThumbnailModal} disabled={isDisabledButton()}>썸네일 미리보기</button>
                </div>
                <textarea className='text-area' placeholder='글 내용을 입력해주세요'/>
              <button className="write-button" disabled={isDisabledButton()}>게시물 업로드 하기</button>
              <Toast />
            </div>
        </div>
  )
}

export default Write
