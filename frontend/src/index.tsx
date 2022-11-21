import React from 'react'
import ReactDOM from 'react-dom/client'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import Feed from '@pages/Feed'
import CreateFeed from '@pages/CreateFeed'
import Write from '@pages/Write'
import SignIn from '@pages/SignIn'
import Posting from '@pages/Posting'
import Feeds from '@pages/Feeds'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/Feed" element={<Feed />} />
      <Route path="/Write" element={<Write />} />
      <Route path="/SignIn" element={<SignIn />} />
      <Route path="/createfeed" element={<CreateFeed />} />
      <Route path="/posting" element={<Posting />} />
      <Route path="/feeds" element={<Feeds />} />
    </Routes>
  </BrowserRouter>
)
