import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux'
import { store, persistor } from './redux/store'
import { PersistGate } from 'redux-persist/integration/react'
import { Toaster } from 'sonner'

const PersistLoader = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-rose-50 via-sky-50 to-violet-50">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 rounded-full border-4 border-violet-200 border-t-violet-600 animate-spin" />
        <div className="text-sm text-gray-600">Loading...</div>
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={<PersistLoader />} persistor={persistor}>
        <App />
        <Toaster />
      </PersistGate>
    </Provider>
  </React.StrictMode>,
)