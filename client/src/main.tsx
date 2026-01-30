import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter as Router } from 'react-router-dom'
import { FiltrationProvider } from "./context/FilterProvider.tsx"
// import {QueryClient} from '@tanstack/react-query'
import "./config/reacti18next.ts"
import LoadingSpinner from './components/Spinner.tsx'
import { DirectionProvider } from './context/DirectionProvider.tsx'
import { BookingProvider } from './context/BookingProvider.tsx'
import NotificationProvider from './context/NotificationProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <FiltrationProvider >
      <BookingProvider>
        <DirectionProvider>
          <NotificationProvider>
              <Router>
                <Suspense fallback={<LoadingSpinner/>}>
                 <App/>
                </Suspense> 
              </Router>
          </NotificationProvider>
       </DirectionProvider>
     </BookingProvider>
    </FiltrationProvider>
   </StrictMode>
)
