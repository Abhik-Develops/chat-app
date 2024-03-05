import Layout from "./components/Layout.jsx"
import Home from "./pages/Home.jsx"
import Chat from "./pages/Chat.jsx"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import SendPasswordResetEmail from "./pages/auth/SendPasswordResetEmail"
import ResetPassword from "./pages/auth/ResetPassword"
import ChangePassword from "./pages/auth/ChangePassword.jsx"
import ChatProvider from './context/ChatProvider.jsx'
import VerifyEmail from "./pages/auth/VerifyEmail.jsx"

function App() {
  return (
    <>
      <BrowserRouter>
        <ChatProvider>
          <Routes>
            <Route path="/" element={<Layout/>}>
              <Route index element={<Home/>}/>
              <Route path="verify-email/:id/:token" element={<VerifyEmail/>}/>
              <Route path="sendpasswordresetemail" element={<SendPasswordResetEmail/>}/>
              <Route path="reset-password/:id/:token" element={<ResetPassword/>}/>
              <Route path="change-password" element={<ChangePassword/>}/>
              <Route path="chats" element={<Chat/>}/>
            </Route>
          </Routes>
        </ChatProvider>
      </BrowserRouter>
    </>
  )
}

export default App
