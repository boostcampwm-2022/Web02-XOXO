/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import React, { useState } from 'react'
import usePost from '@src/hooks/usePost'
import { isEmpty } from 'lodash'
import { useNavigate, useParams } from 'react-router-dom'
import { ICreatePostingButton } from '../types'

const CreatePostingButton = ({ getPostingInfos }: ICreatePostingButton) => {
  const { feedId } = useParams<{ feedId: string }>()
  const postPosting = usePost(`/posting/${feedId}`)
  const [isButtonDisabled, setIsButtonDisabled] = useState(false)
  const navigate = useNavigate()

  const handleUploadPosting = async () => {
    setIsButtonDisabled(true)
    const formData = await getPostingInfos()
    if (isEmpty(formData)) {
      setIsButtonDisabled(false)
      return
    }
    console.log(formData)

    const { success } = await postPosting(formData)
    if (success === true) navigate(`/Feed/${feedId}`)
  }
  return (
    <button className="write-button" onClick={handleUploadPosting} disabled={isButtonDisabled}>
      게시물 업로드 하기
    </button>
  )
}

export default CreatePostingButton
