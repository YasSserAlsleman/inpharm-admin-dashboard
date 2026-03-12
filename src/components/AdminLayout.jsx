  import React from 'react'
  import { Link, useNavigate } from 'react-router-dom'
  import { useAuth } from '../contexts/AuthContext'
  import { Snackbar, Alert } from "@mui/material"
  import { useEffect, useState } from "react"

  export default function AdminLayout({ children }) {
    const navigate = useNavigate()
    const { logout } = useAuth()

    const handleLogout = () => {
      logout()
      navigate('/login')
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
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-white rounded flex items-center justify-center text-primary font-bold">IP</div>
            <div className="header-brand">InPharm Admin</div>
          </div>

          <nav className="space-y-2">
            <Link className="block py-2 px-3 rounded hover:bg-primary/80" to="/">Learning </Link>
            <Link className="block py-2 px-3 rounded hover:bg-primary/80" to="/virtualPharmacy">Virtual Pharmacy </Link>
            <Link className="block py-2 px-3 rounded hover:bg-primary/80" to="/podcast">Podcast </Link>
            <Link className="block py-2 px-3 rounded hover:bg-primary/80" to="/news">News</Link>
            <Link className="block py-2 px-3 rounded hover:bg-primary/80" to="/about">About</Link>
            <Link className="block py-2 px-3 rounded hover:bg-primary/80" to="/codes">Codes</Link>
            <Link className="block py-2 px-3 rounded hover:bg-primary/80" to="/plans">Plans</Link>
            <Link className="block py-2 px-3 rounded hover:bg-primary/80" to="/Students">Students</Link>
            <Link className="block py-2 px-3 rounded hover:bg-primary/80" to="/Managers">Managers</Link>


          </nav>

          <div className="mt-8">
            <button onClick={handleLogout} className="w-full bg-white text-primary py-2 rounded">Logout</button>
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
