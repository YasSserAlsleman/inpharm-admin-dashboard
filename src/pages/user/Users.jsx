import React, { useEffect, useState } from 'react'
import axios from '../../api/axiosClient'

export default function Users() {
  const [rows, setRows] = useState([])

  useEffect(()=>{
    async function load(){ 
      try {
        const res = await axios.get('/admin/users')
        setRows(res.data.users)
      } catch (err) {
        setRows([{ id:1, name:'Ali', email:'ali@test.com' }])
      }
    }
    load()
  },[])


const fetchUser = async () => {

  const res = await axios.get("/users/me");

  setUser(res.data);

};


  return (
    <div className="card">
      <h3 className="text-lg font-bold mb-4">Users</h3>
      <table className="w-full table-auto">
        <thead><tr><th className="text-left">ID</th><th className="text-left">Name</th><th className="text-left">Email</th></tr></thead>
        <tbody>
          {rows.map(r=> <tr key={r.id}><td>{r.id}</td><td>{r.name}</td><td>{r.email}</td></tr>)}
        </tbody>
      </table>
    </div>
  )
}
