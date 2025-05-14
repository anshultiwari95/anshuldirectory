import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(
      () => {
        console.log('ServiceWorker registration successful')
      },
      (err) => {
        console.log('ServiceWorker registration failed: ', err)
      }
    )
  })
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
