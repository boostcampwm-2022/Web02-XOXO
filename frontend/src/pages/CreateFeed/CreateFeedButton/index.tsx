/* eslint-disable @typescript-eslint/no-misused-promises */
import React, { useState } from 'react'
import usePost from '@hooks/usePost'
import { IResponse } from '@src/types'
import { useNavigate, useParams } from 'react-router-dom'
import { ICreateFeedButton } from '../types'
import { isEmpty } from 'lodash'
import { toast } from 'react-toastify'

const CreateFeedButton = ({ getFeedInfos }: ICreateFeedButton) => {
  const postPersonalFeed = usePost('/feed')
  const postGroupFeed = usePost('/feed/group')
  const [isButtonDisabled, setIsButtonDisabled] = useState(false)
  const { path } = useParams<{ path: string }>()
  const navigate = useNavigate()
  const onFeedBtnClicked = async () => {
    setIsButtonDisabled(true)
    const formData = await getFeedInfos()
    if (isEmpty(formData)) {
      setIsButtonDisabled(false)
      return
    }
    if (path === 'personal') {
      const { success, data }: IResponse = await postPersonalFeed(formData)
      if (success) navigate(`/Feed/${data as string}`)
      else {
        toast('오류가 발생했습니다. 다시 클릭해주세요.')
        setIsButtonDisabled(false)
        console.log(data)
      }
    }
    if (path === 'group') {
      const { success, data }: IResponse = await postGroupFeed(formData)
      if (success) navigate(`/Feed/${data as string}`)
      else {
        toast('오류가 발생했습니다. 다시 클릭해주세요.')
        setIsButtonDisabled(false)
        console.log(data)
      }
    }
  }
  return (
    <button className="button-large" onClick={onFeedBtnClicked} disabled={isButtonDisabled}>
      피드 생성하기
    </button>
  )
}

export default CreateFeedButton
