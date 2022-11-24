import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import usePost from '@hooks/usePost'

const oauth = () => {
  const postOAuth = usePost('api/user')
  const code = new URL(window.location.href).searchParams.get('code')
  const navigate = useNavigate()

  useEffect(() => {
    void (async () => {
      const res = await postOAuth({ oauthCode: code })
      if (res !== undefined) navigate('/feed')
    })()
  }, [])

  return <div>
    <h1>OAuth 리다이렉트 페이지!!!</h1>
    코드 : {code}
  </div>
}

export default oauth
