
import React, { useRef, useState, useEffect } from 'react'
import useSWR from 'swr'
import { useParams } from 'react-router-dom'
import { debounce, isEmpty } from 'lodash'
import Suggestions from './Suggestions'
import { IGroupMember, ISuggestion } from '../types'
import { ReactComponent as XIcon } from '@assets/XIcon.svg'
import Input from '@src/components/Input'
import fetcher from '@util/fetcher'

const GroupMember = ({ members, setMembers }: IGroupMember) => {
  const nicknameRef = useRef<HTMLInputElement>(null)
  const [nickname, setNickname] = useState('')
  const { feedId } = useParams<{ feedId: string }>()
  const { data: feedMembers } = useSWR(feedId !== undefined ? `/feed/members/${feedId as string}` : null, fetcher)

  useEffect(() => {
    if (feedMembers) {
      setMembers(feedMembers)
    }
  }, [feedMembers])

  const debouncedSearch = debounce((value: string) => {
    setNickname(value)
  }, 500)

  const handleSuggestionClick = (newMember: ISuggestion) => {
    if (members.every(({ id }) => id !== newMember.id)) {
      setMembers([...members, newMember])
    }
    if (!isEmpty(nicknameRef.current)) {
      nicknameRef.current.value = ''
      setNickname(nicknameRef.current.value)
    }
  }

  const feedMembersResult = members.map(({ nickname, id }) => (
    <button
      key={id}
      className="form-member"
      onClick={(e) => {
        e.preventDefault()
        setMembers(members.filter((member) => member.id !== id))
      }}>
      <span>{nickname}</span>
        <XIcon fill="#ea4b35" />
    </button>
  ))

  return (
    <div>
      <Input
        label="그룹원 추가"
        bind={nicknameRef}
        placeholder="그룹원의 닉네임을 입력해주세요"
        onChangeCb={debouncedSearch}
      />
      {!isEmpty(nickname) && <Suggestions nickname={nickname} members={members} setMembers={handleSuggestionClick} />}
      <div className="add-group-people">
        <label className="form-label" htmlFor="">그룹원 목록</label>
        {isEmpty(members)
          ? (<span className="form-no-member">현재 추가된 그룹원이 없습니다</span>)
          : (<div className="form-members-wrapper">{feedMembersResult}</div>)
        }
      </div>
    </div>
  )
}

export default GroupMember
