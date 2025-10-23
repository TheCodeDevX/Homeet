import { useCallback, useEffect, useState} from "react"
import { useAuthStore } from "./store/auhStore"
import { Navigate, Route, Routes, useLocation} from 'react-router-dom'
import HomePage from "./pages/HomePage"
import SignupPage from "./pages/SignupPage"
import LoginPage from "./pages/LoginPage"
import ForgotPassword from "./pages/ForgotPassword"
import EmailVerification from "./pages/EmailVerification"
import ResetPasswordPage from "./pages/ResetPasswordPage"
import { ProtectRoute, RedirectAuthenticatedUser } from "./components/AuthProtected"
import Layout from "./layouts/Layout"
import PostListingPage from "./pages/PostListingPage"
import OnboardingPage from "./pages/OnboardingPage"
import CardPage from "./pages/CardPage"
import ProfilePage from "./pages/ProfilePage"
import DashboardPage from "./pages/DashboardPage"
import UpdateListingPage from "./pages/UpdateListingPage"
import { useListingStore } from "./store/listingStore"
import ToastMessage from "./components/Toast"
import ChatPage from "./pages/ChatPage"
import { useThemeStore } from "./store/themeStore"
import {useTranslation} from 'react-i18next'
import i18n from "./config/reacti18next"
import { useMessageStore } from "./store/messageStore"
import toast, {Toaster} from "react-hot-toast"
import { Check, X } from "lucide-react"
import {motion} from 'framer-motion'
import { lightThemes } from "./constants"
import { useFollowRequestStore } from "./store/followReq"
import { useLangStore } from "./store/languagesStore"
import ToasterCompo from "./components/Toaster"
import LoadingSpinner from "./components/Spinner"
import NotificationPage from "./pages/NotificationPage"



const App = () => {
  const {checkAuth, isAuthenticated, user, connectSocket,error:authErr, message:authMsg, isCheckingAuth, isLoading} = useAuthStore()
  const {error: messageError} = useMessageStore()
  const [authMessage, setAuthMessage] = useState("")
  const {message:followReqMsg, error:followReqErr} = useFollowRequestStore()
  const {message, error} = useListingStore()
  const {lang:storedLanguage} = useLangStore()
  const [toastMsg, setToastMsg] = useState({
    message : "",
    error : ""
  })

  // const {language} = useLangStore()
  
 useEffect(() => {checkAuth()} , [checkAuth])
console.log(isAuthenticated)
  useEffect(() => { connectSocket() }, [user])
  const location = useLocation()
 

   const lang = i18n.language
  

  const {t} = useTranslation()

  useEffect(() => {
   const params = new URLSearchParams(window.location.search);
   const msg = params.get("message")
   setAuthMessage(msg as string);
   params.delete("message");
   setTimeout(() => {
   const newUrl = window.location.pathname + ( params.toString() ? `${params.toString()}` : '' )
   window.history.replaceState({}, "", newUrl)
   }, 3000)
  }, [])

  

  



  const msgkey  = message || authMsg || authMessage || followReqMsg || ""
  const errkey = error  || authErr || messageError || followReqErr || ""

  const messages = t("backendMessages", {ns:"messages", returnObjects:true}) as Record<string , string>
  // let msg = messages[msgkey];
  // let errMsg = messages[errkey]


 useEffect(() => {
    console.warn(msgkey, "and", errkey)
  if((msgkey || errkey)){
     setToastMsg((prev) => ({...prev, message : messages[msgkey], error : messages[errkey]}))
     return;
  };
  setToastMsg({
    message :"",
    error : ""
  })
 }, [msgkey, errkey])

 

 const useToastMessage = ({msg , color} : {msg:string , color : "green" | "red"}) => {
    useEffect(() => {
    if(!msg || msg.trim() === "") return; 
    toast.custom(t => (
     <ToasterCompo color={color} msg={msg} t={t} />
    ))
    setTimeout(() => setToastMsg({message:"", error:""}), 0);
  
  }, [msg])
 }



  
 useToastMessage({color:"green", msg: toastMsg.message})
useToastMessage({color:"red", msg: toastMsg.error})



 useEffect(() => {
    console.warn("this one useEffect(lang)")
   if(lang) {
  document.documentElement.lang = lang
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
   }
   }, [lang, storedLanguage])

   
 
  const isHomePage = location.pathname === "/";
  const {theme} = useThemeStore()


  if(isCheckingAuth) return <LoadingSpinner/>


  return (
   <div className={`sm:p-4 p-2 flex ${isHomePage ? "items-start" : "items-center"} justify-center min-h-screen `}
    data-theme={theme}>
    <Routes>
      <Route path="/" element={<ProtectRoute><Layout showSidebar={true}><HomePage/></Layout></ProtectRoute>} />
      <Route path="/login" element={<RedirectAuthenticatedUser><LoginPage/></RedirectAuthenticatedUser>}/>
      <Route path="/signup" element={<RedirectAuthenticatedUser><SignupPage/></RedirectAuthenticatedUser> }/>
      <Route path="/forgot-password" element={<RedirectAuthenticatedUser><ForgotPassword/></RedirectAuthenticatedUser>}/>
      <Route path="/verify-email" element={
        <RedirectAuthenticatedUser> {isAuthenticated ? <EmailVerification/> 
          : <Navigate to="/login" replace/>} </RedirectAuthenticatedUser>
        }/>
      <Route path="/reset-password/:token" element={<RedirectAuthenticatedUser><ResetPasswordPage/></RedirectAuthenticatedUser>}/>
      <Route path="/post-listing" element={<ProtectRoute><Layout showSidebar={false}><PostListingPage/></Layout></ProtectRoute>} />
      <Route path="/onboarding" element={<RedirectAuthenticatedUser><OnboardingPage/></RedirectAuthenticatedUser>} />
      <Route path="/profile" element={<ProtectRoute><Layout showSidebar={false}><ProfilePage/></Layout></ProtectRoute>} />
      <Route path="/listings/:id" element={<ProtectRoute><Layout showSidebar={false}><CardPage/></Layout></ProtectRoute>} />
      <Route path="/dashboard" element={<ProtectRoute><Layout showSidebar={false}><DashboardPage/></Layout></ProtectRoute>} />
      <Route path="/dashboard/:id" element={<ProtectRoute><Layout showSidebar={false}><UpdateListingPage/></Layout></ProtectRoute>} />
      <Route path="/chat" element={<ProtectRoute><Layout showSidebar={false}>
        <ChatPage/></Layout></ProtectRoute>} />

         <Route path="/notification" element={<ProtectRoute><Layout showSidebar={false}>
        <NotificationPage/></Layout></ProtectRoute>} />
    </Routes>
    
    <Toaster/>
   </div>
  )
}

export default App
