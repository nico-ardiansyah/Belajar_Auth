import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Routes, Route } from 'react-router'
import Homepage from './pages/Homepage'
import Login from './pages/Login'
import Register from './pages/Register'
import LoggedIn from './pages/LoggedIn'
import Verify from './pages/Verify'
import ForgotPassword from './pages/ForgotPassword'
import Updatepassword from './pages/Updatepassword'

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={ <Homepage/> } />
        <Route path='/login' element={ <Login/> } />
        <Route path='/register' element={<Register />} />
        <Route path='/loggedin' element={<LoggedIn />} />
        <Route path='/verify' element={<Verify />} />
        <Route path='/forgotpassword' element={<ForgotPassword />} />
        <Route path='/updatepassword' element={<Updatepassword />} />
      </Routes>
    </>
  )
  
}

export default App
