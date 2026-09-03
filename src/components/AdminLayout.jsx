import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Snackbar, Alert } from "@mui/material"
import { useTranslation } from 'react-i18next'
import axios from '../api/axiosClient'
import { BASE_FILE_URL } from '../config/config'

  export default function AdminLayout({ children }) {
    const navigate = useNavigate()
    const location = useLocation()
    const { logout, user, can } = useAuth()
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

  const [sectionsNav, setSectionsNav] = useState([])

  const [unreadCount, setUnreadCount] = useState(0)

  const requiredPermission = (() => {
    const path = location.pathname.toLowerCase()
    if (path === '/') return 'topics.view'
    if (path.includes('research')) return 'research.view'
    if (path.includes('lecture')) return 'lectures.view'
    if (path.includes('question')) return 'questions.view'
    if (path.includes('lesson')) return 'lessons.view'
    if (path === '/virtualpharmacy' || path === '/podcast' || path === '/pharmacy-germany') return 'topics.view'
    if (path.startsWith('/news')) return path.includes('subnews') ? 'subNews.view' : 'news.view'
    if (path.startsWith('/plans')) return 'plans.view'
    if (path.startsWith('/codes')) return 'codes.view'
    if (path.startsWith('/students')) return 'students.view'
    if (path.startsWith('/managers')) return 'managers.view'
    if (path.startsWith('/sections')) return 'sections.view'
    if (path.startsWith('/about')) return 'about.view'
    if (path.startsWith('/notifications')) return 'notifications.view'
    return null
  })()

  if (requiredPermission && !can(requiredPermission)) {
    return <Navigate to="/change-password" replace />
  }

  const canViewAny = (...permissions) => permissions.some((permission) => can(permission))

  useEffect(()=>{
    // جلب قائمة الأقسام لعرضها في الشريط الجانبي
    const fetchSectionsNav = async () => {
      try {
        const res = await axios.get('/sections')
        setSectionsNav(res.data || [])
      } catch (err) {
        console.error('Failed to load sections for sidebar', err)
      }
    }
    fetchSectionsNav()

    const refreshUnreadCount = async () => {
      try {
        const res = await axios.get("/notifications/unread-count");
        setUnreadCount(res.data.unreadCount || 0);
      } catch (err) {
        console.error("Error fetching unread notification count", err);
      }
    };

    refreshUnreadCount();

    const handleNotificationsUpdated = () => {
      refreshUnreadCount();
    };

    window.addEventListener("new-notification-local", handleNotificationsUpdated);
    window.addEventListener("notifications-updated", handleNotificationsUpdated);
    window.addEventListener("focus", handleNotificationsUpdated);

    const handler = (e)=>{
      setNotification({
        open:true,
        message:e.detail,
        severity:"error"
      })
    }

    window.addEventListener("api-error",handler)

    return ()=> {
      window.removeEventListener("api-error",handler)
      window.removeEventListener("new-notification-local", handleNotificationsUpdated)
      window.removeEventListener("notifications-updated", handleNotificationsUpdated)
      window.removeEventListener("focus", handleNotificationsUpdated)
    }

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
            {can('topics.view') && <Link className="block py-2 px-3 rounded hover:bg-primary/80" to="/">{t('navigation.learning')}</Link>}
            {can('topics.view') && <Link className="block py-2 px-3 rounded hover:bg-primary/80" to="/virtualPharmacy">{t('navigation.virtualPharmacy')}</Link>}
            {can('topics.view') && <Link className="block py-2 px-3 rounded hover:bg-primary/80" to="/pharmacy-germany">{t('navigation.pharmacyGermany')}</Link>}

          

            {can('topics.view') && <Link className="block py-2 px-3 rounded hover:bg-primary/80" to="/podcast">{t('navigation.podcast')}</Link>}
            {can('news.view') && <Link className="block py-2 px-3 rounded hover:bg-primary/80" to="/news">{t('navigation.news')}</Link>}
            {can('about.view') && <Link className="block py-2 px-3 rounded hover:bg-primary/80" to="/about">{t('navigation.about')}</Link>}
            {can('codes.view') && <Link className="block py-2 px-3 rounded hover:bg-primary/80" to="/codes">{t('navigation.codes')}</Link>}
            {canViewAny('plans.view', 'plans.create', 'plans.update', 'plans.delete') && <Link className="block py-2 px-3 rounded hover:bg-primary/80" to="/plans">{t('navigation.plans')}</Link>}

            {can('students.view') && <Link className="block py-2 px-3 rounded hover:bg-primary/80" to="/Students">{t('navigation.students')}</Link>}
            {can('managers.view') && <Link className="block py-2 px-3 rounded hover:bg-primary/80" to="/managers">{t('navigation.managers')}</Link>}

            <div className="mt-4">
              <div className="text-xs uppercase text-white/80 px-3 mb-2">{t('navigation.settings')}</div>
              <Link className="block py-2 px-3 rounded hover:bg-primary/80" to="/change-password">{t('navigation.changePassword')}</Link>
              {can('notifications.view') && <Link className="block py-2 px-3 rounded hover:bg-primary/80 flex items-center justify-between" to="/notifications">
                <span>{t('navigation.notifications')}</span>
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">{unreadCount}</span>
                )}
              </Link>}
              {can('sections.view') && (
                <Link className="block py-2 px-3 rounded hover:bg-primary/80" to="/sections">{t('navigation.sections')}</Link>
              )}
            </div>

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
