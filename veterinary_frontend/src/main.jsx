import './i18n';
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { ErrorBoundary } from './components/ErrorBoundary'
import { CurrencyProvider } from './context/CurrencyContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <CurrencyProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </CurrencyProvider>
    </ErrorBoundary>
  </React.StrictMode>,
)
