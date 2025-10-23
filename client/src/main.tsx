import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter as Router } from 'react-router-dom'
import { FiltrationProvider } from "./context/FilterProvider.tsx"
import {QueryClient} from '@tanstack/react-query'
import "./config/reacti18next.ts"
import LoadingSpinner from './components/Spinner.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <FiltrationProvider >
    <Router>
   <Suspense fallback={<LoadingSpinner/>}>
     <App/>
   </Suspense> 
   </Router>
  </FiltrationProvider>
  </StrictMode>
)
