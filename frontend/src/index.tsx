import React from 'react'
import ReactDOM from 'react-dom/client'
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom'
import Feed from '@pages/Feed'
import CreateFeed from '@pages/CreateFeed'
import EditFeed from '@pages/EditFeed'
import Write from '@pages/Write'
import SignIn from '@pages/SignIn'
import Posting from '@pages/Posting'
import Feeds from '@pages/Feeds'
import Info from '@pages/Info'
import Error from '@pages/Error'
import AuthRoute from '@components/AuthRoute'
import SigninRoute from '@components/SigninRoute'
import { ReactComponent as DesktopSideImage } from '@assets/desktopSideImage.svg'
import './global.scss'
import FeedRoute from './components/FeedRoute'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <>
    <div className="image-wrapper">
      <DesktopSideImage width={240} />
    </div>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/Signin" />} />
        <Route path="/Feed/:feedId" element={<FeedRoute Component={Feed} />} />
        <Route path="/Feed/:feedId/:postingId" element={<AuthRoute Component={Posting} />} />
        <Route path="/Write/:feedId" element={<AuthRoute Component={Write} />} />
        <Route path="/SignIn/Info" element={<SigninRoute Component={Info} />} />
        <Route path="/SignIn" element={<SigninRoute Component={SignIn} />} />
        <Route path="/Createfeed/:path" element={<AuthRoute Component={CreateFeed} />} />
        <Route path="/EditFeed/:path/:feedId" element={<AuthRoute Component={EditFeed} />} />
        <Route path="/Feeds" element={<AuthRoute Component={Feeds} />} />
        <Route path="/Posting" element={<Posting />} />
        <Route path="/*" element={<Error />} />
      </Routes>
    </BrowserRouter>
  </>
)
