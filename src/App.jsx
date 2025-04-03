import React from 'react'
import { Route, Routes } from 'react-router-dom'
import InterviewBot from './pages/InterviewBot'
import InterviewDashboard from './pages/InterviewDashboard'


const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<InterviewBot />} />
        <Route path="/report" element={<InterviewDashboard />} />
      </Routes>
    </div>
  )
}

export default App