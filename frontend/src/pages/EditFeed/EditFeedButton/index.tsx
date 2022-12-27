/* eslint-disable @typescript-eslint/no-misused-promises */
import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { isEmpty } from 'lodash'
import { IEditFeedButton } from '../types'
import usePatch from '@hooks/usePatch'
import { IResponse } from '@src/types'

const EditFeedButton = ({ getFeedInfos }: IEditFeedButton) => {
  const { path, feedId } = useParams<{ path: string, feedId: string }>()
  const patchPersonalFeed = usePatch(`/feed/${feedId as string}`)
  const patchGroupFeed = usePatch(`/feed/group/${feedId as string}`)
  const [isButtonDisabled, setIsButtonDisabled] = useState(false)
  const navigate = useNavigate()

  const onFeedBtnClicked = async () => {
    setIsButtonDisabled(true)
    const formData = await getFeedInfos()
    if (isEmpty(formData)) {
      setIsButtonDisabled(false)
      return
    }
    if (path === 'personal') {
      const { success }: IResponse = await patchPersonalFeed(formData)
      if (success) navigate(`/Feed/${feedId as string}`)
      else {
        toast('오류가 발생했습니다. 다시 클릭해주세요.')
        setIsButtonDisabled(false)
      }
    }
    if (path === 'group') {
      const { success }: IResponse = await patchGroupFeed(formData)
      if (success) navigate(`/Feed/${feedId as string}`)
      else {
        toast('오류가 발생했습니다. 다시 클릭해주세요.')
        setIsButtonDisabled(false)
      }
    }
  }

  return (
    <button className="button-large" onClick={onFeedBtnClicked} disabled={isButtonDisabled}>
      피드 수정하기
    </button>
  )
}

export default EditFeedButton
