import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Snackbar, Alert } from "@mui/material"
import { useTranslation } from 'react-i18next'

  export default function AdminLayout({ children }) {
    const navigate = useNavigate()
    const { logout } = useAuth()
    const { t, i18n } = useTranslation()

    const handleLogout = () => {
      logout()
      navigate('/login')
    }

    const changeLanguage = (lng) => {
      i18n.changeLanguage(lng)
      localStorage.setItem('inpharm_lang', lng)
    }

  const [notification, setNotification] = useState({
    open:false,
    message:"",
    severity:"error"
  })

  useEffect(()=>{

    const handler = (e)=>{
      setNotification({
        open:true,
        message:e.detail,
        severity:"error"
      })
    }

    window.addEventListener("api-error",handler)

    return ()=> window.removeEventListener("api-error",handler)

  },[])

    return (
      <div className="min-h-screen flex">
        <aside className="w-64 bg-primary text-white p-4">
          <div className="flex items-start gap-3 mb-6">
            <div className="w-10 h-10 bg-white rounded flex items-center justify-center text-primary font-bold">IP</div>
            <div className="flex-1">
              <div className="header-brand text-lg font-semibold">{t('inpharmAdmin')}</div>
              <div className="mt-3">
                <label className="block text-xs uppercase tracking-wide text-white/80 mb-1">{t('language.label')}</label>
                <select
                  value={i18n.language}
                  onChange={(e) => changeLanguage(e.target.value)}
                  className="w-full rounded border border-white/30 bg-white text-primary p-2 text-sm"
                >
                  <option value="en">{t('language.english')}</option>
                  <option value="ar">{t('language.arabic')}</option>
                  <option value="de">{t('language.german')}</option>
                </select>
              </div>
            </div>
          </div>

          <nav className="space-y-2">
            <Link className="block py-2 px-3 rounded hover:bg-primary/80" to="/">{t('navigation.learning')}</Link>
            <Link className="block py-2 px-3 rounded hover:bg-primary/80" to="/virtualPharmacy">{t('navigation.virtualPharmacy')}</Link>
            <Link className="block py-2 px-3 rounded hover:bg-primary/80" to="/podcast">{t('navigation.podcast')}</Link>
            <Link className="block py-2 px-3 rounded hover:bg-primary/80" to="/news">{t('navigation.news')}</Link>
            <Link className="block py-2 px-3 rounded hover:bg-primary/80" to="/about">{t('navigation.about')}</Link>
            <Link className="block py-2 px-3 rounded hover:bg-primary/80" to="/codes">{t('navigation.codes')}</Link>
            <Link className="block py-2 px-3 rounded hover:bg-primary/80" to="/plans">{t('navigation.plans')}</Link>
            <Link className="block py-2 px-3 rounded hover:bg-primary/80" to="/Students">{t('navigation.students')}</Link>
            <Link className="block py-2 px-3 rounded hover:bg-primary/80" to="/Managers">{t('navigation.managers')}</Link>
            <Link className="block py-2 px-3 rounded hover:bg-primary/80" to="/change-password">{t('navigation.changePassword')}</Link>


          </nav>

          <div className="mt-8">
            <button onClick={handleLogout} className="w-full bg-white text-primary py-2 rounded">{t('button.logout')}</button>
          </div>
        </aside>

        <main className="flex-1 p-6">



          <section>{children}</section>
        </main>


        <Snackbar
  open={notification.open}
  autoHideDuration={4000}
  onClose={() => setNotification({ ...notification, open: false })}
  anchorOrigin={{ vertical: "top", horizontal: "right" }}
>
  <Alert
    severity={notification.severity}
    variant="filled"
    onClose={() => setNotification({ ...notification, open: false })}
  >
    {notification.message}
  </Alert>
</Snackbar>
      </div>

      
    )
  }
