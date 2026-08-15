
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import App from './App'
import './index.css'
import ErrorBoundary from './components/ErrorBoundary'
import { Toaster } from 'sonner'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <HelmetProvider>
        <ErrorBoundary>
          <App />
          <Toaster />
        </ErrorBoundary>
      </HelmetProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
