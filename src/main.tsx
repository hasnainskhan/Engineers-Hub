import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

document.title = 'Engineers Hub'
const link = document.querySelector<HTMLLinkElement>('link[rel="icon"]') ?? document.createElement('link')
link.rel = 'icon'
link.type = 'image/png'
link.href = '/logo.png?v=2'
if (!document.querySelector('link[rel="icon"]')) document.head.appendChild(link)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
