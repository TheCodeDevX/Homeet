import { useEffect, useState, useRef } from "react"
import { useAuthStore } from "./store/auhStore"
import { Navigate, Route, Routes, useLocation, useNavigate} from 'react-router-dom'
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
import ChatPage from "./pages/ChatPage"
import { useThemeStore } from "./store/themeStore"
import {useTranslation} from 'react-i18next'
import i18n from "./config/reacti18next"
import toast, {Toaster} from "react-hot-toast"
import { useFollowRequestStore } from "./store/followReqStore"
import { useLangStore } from "./store/languagesStore"
import ToasterCompo from "./components/Toaster"
import LoadingSpinner from "./components/Spinner"
import NotificationPage from "./pages/NotificationPage"
import gsap from "gsap"
import { SplitText } from "gsap/all"
import UserProfilePage from "./pages/UserProfilePage"
import {useDirectionContext} from "./hooks/useDirectionContext"
import useNotification from "./hooks/useNotification"
import { useNotificationStore } from "./store/notificationStore"





const App = () => {
  const {checkAuth, isAuthenticated, user, connectSocket,error:authErr, message:authMsg, isCheckingAuth, warmUp} = useAuthStore()
 
  const [authMessage, setAuthMessage] = useState("")
  const authMessageL = useRef<string>("");
  const {message:followReqMsg, error:followReqErr} = useFollowRequestStore()
  const {message, error} = useListingStore()
  // const {lang:storedLanguage, setLang} = useLangStore()
  const runRef = useRef(false)
 
  // const {language} = useLangStore()
  
 useEffect(() => {checkAuth()} , [checkAuth])
console.log(isAuthenticated)
  useEffect(() => { connectSocket() }, [user])
  const location = useLocation()
  const navigate = useNavigate()
 

  useEffect(() => {
  
    const warpUpTheServer = async() => {
      try {
        const response = await warmUp();
        console.warn(response);
      } catch (error) {
        console.error("The server is unavailable now, please try again later after being warmed up!")
      }
    }
    warpUpTheServer();
    const interval = setInterval(() => warpUpTheServer(), 300000)

    return () => clearInterval(interval);
  }, [])

   const lang = i18n.language
  const {t} = useTranslation()

  useEffect(() => {
   const params = new URLSearchParams(window.location.search); 
   const msg = params.get("message") as string
   authMessageL.current = msg
   params.delete("message");
   const timer = setTimeout(() => {
   const newUrl = window.location.pathname + ( params.toString() ? `${params.toString()}` : '')
   window.history.replaceState({}, "", newUrl)
   authMessageL.current = "";
   }, 3000);
   console.warn("search", location.search)
   return () => {
    clearTimeout(timer);
   }

  }, [])

  

  



  

  const messages = t("backendMessages", {ns:"messages", returnObjects:true}) as Record<string , string>
  // let msg = messages[msgkey];
  // let errMsg = messages[errkey]
  let msgkey  = message || authMsg || authMessageL.current || followReqMsg || "";
  let errkey = error  || authErr || followReqErr || "";

 

 const useToastMessage = ({msg , color} : {msg:string , color : "green" | "red"}) => {
    useEffect(() => {
      console.warn("msg", msg)
    if(!msg || msg.trim() === "") return; 
    toast.custom(t => (
     <ToasterCompo color={color} msg={messages[msg]} t={t} />
    ))
  
  }, [msg])
 }

 useToastMessage({msg:msgkey && msgkey, color:"green"})
 useToastMessage({msg:errkey && errkey, color:"red"})




 const {setLangDir} = useDirectionContext()
 
 const direction = lang === "ar" ? "rtl" : "ltr"

 useEffect(() => {
    console.warn("this one useEffect(lang)")
  setLangDir(`${lang}&${direction}`);
   if(lang) {
  document.documentElement.lang = lang;
  document.documentElement.dir = direction;
   }
   }, [lang])

   
 
  const isHomePage = location.pathname === "/";
  const {theme} = useThemeStore()

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme)
  }, [theme])

  

  gsap.registerPlugin(SplitText)

  //  const {setNotificationsLength, notificationsLength} = useNotification()
  //   const {getIncomingRequests, followReqs, isReqLoading} = useFollowRequestStore();
  //   useEffect(() => {
  //   getIncomingRequests();
  //   console.log(followReqs, 'follow requests')
  //   sessionStorage.setItem('notifs', followReqs.length.toString())
  //   console.log(notificationsLength, 'follow requests "notifs"')
  // } , [])

  if(isCheckingAuth) return <LoadingSpinner/>
  


  return (
   <div className={`sm:p-4 p-2 flex ${isHomePage ? "items-start" : "items-center"} justify-center min-h-screen `}
    >
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
      
      <Route path="/profile/:id" element={<ProtectRoute><Layout showSidebar={false}>
        <UserProfilePage/></Layout></ProtectRoute>} />

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
