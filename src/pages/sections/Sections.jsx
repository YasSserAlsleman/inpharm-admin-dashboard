import React, { useEffect, useState } from 'react'
import axios from '../../api/axiosClient'
import { BASE_FILE_URL } from '../../config/config'
import { useAuth } from '../../contexts/AuthContext'

export default function Sections() {
  const { can } = useAuth()
  const [sections, setSections] = useState([])
  const [form, setForm] = useState({ name:'', name_ar:'', name_en:'', name_de:'', order:0, active:true })
  const [file, setFile] = useState(null)
  const [editingId, setEditingId] = useState(null)

  const fetchSections = async ()=>{
    try{
      const res = await axios.get('/sections')
      setSections(res.data)
    }catch(err){
      console.error(err)
      window.dispatchEvent(new CustomEvent('api-error', { detail: 'خطأ جلب الأقسام' }))
    }
  }

  useEffect(()=>{ fetchSections() },[])

  const handleChange = e => {
    const { name, value, type, checked } = e.target
    setForm(prev=> ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleFile = e => setFile(e.target.files[0])

  const submit = async (e)=>{
    e.preventDefault()
    try{
      const fd = new FormData()
      Object.keys(form).forEach(k=> fd.append(k, form[k]))
      if (file) fd.append('image', file)

      if (editingId) {
        const res = await axios.put(`/sections/${editingId}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      } else {
        const res = await axios.post('/sections', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      }
      setFile(null)
      setForm({ name:'', name_ar:'', name_en:'', name_de:'', order:0, active:true })
      setEditingId(null)
      fetchSections()
    }catch(err){
      console.error(err)
      window.dispatchEvent(new CustomEvent('api-error', { detail: 'خطأ حفظ القسم' }))
    }
  }

  const edit = (s)=>{
    setEditingId(s._id)
    setForm({ name:s.name||'', name_ar:s.name_ar||'', name_en:s.name_en||'', name_de:s.name_de||'', order:s.order||0, active: s.active })
  }

  const remove = async (id)=>{
    if (!confirm('حذف القسم؟')) return
    try{
      await axios.delete(`/sections/${id}`)
      fetchSections()
    }catch(err){
      console.error(err)
      window.dispatchEvent(new CustomEvent('api-error', { detail: 'خطأ حذف القسم' }))
    }
  }

  const move = async (id, dir)=>{
    // تبسيط: نقل الترتيب صعودًا أو هبوطًا بتبديل قيمة order مع القسم القريب
    const idx = sections.findIndex(s=> s._id === id)
    if (idx === -1) return
    const targetIdx = dir === 'up' ? idx-1 : idx+1
    if (targetIdx < 0 || targetIdx >= sections.length) return

    const a = sections[idx]
    const b = sections[targetIdx]
    try{
      await axios.put(`/sections/${a._id}`, { order: b.order })
      await axios.put(`/sections/${b._id}`, { order: a.order })
    }catch(err){
      console.error('Move error', err)
    }
    fetchSections()
  }

  return (
    <div>
      <h2 className="text-2xl mb-4">إدارة الأقسام</h2>

      {sections.length >= 4 && !editingId && (
        <div className="mb-4 p-3 bg-yellow-100 text-yellow-900 border rounded">الأقسام مثبتة: لا يمكن إضافة أو حذف أقسام جديدة. يمكنك تعديل الأقسام الحالية فقط.</div>
      )}
      <form onSubmit={submit} className="mb-6 grid grid-cols-2 gap-3 max-w-xl">
        <input name="name" value={form.name} onChange={handleChange} placeholder="الاسم (افتراضي)" className="p-2 border" />
        <input name="name_ar" value={form.name_ar} onChange={handleChange} placeholder="الاسم بالعربية" className="p-2 border" />
        <input name="name_en" value={form.name_en} onChange={handleChange} placeholder="الاسم بالإنجليزية" className="p-2 border" />
        <input name="name_de" value={form.name_de} onChange={handleChange} placeholder="الاسم بالألمانية" className="p-2 border" />
        <input name="order" value={form.order} onChange={handleChange} placeholder="الترتيب" type="number" className="p-2 border" />
    {/* <label className="flex items-center gap-2"><input type="checkbox" name="active" checked={form.active} onChange={handleChange} /> مفعل</label> */}
        <input type="file" onChange={handleFile} disabled={sections.length >= 4 && !editingId} />
        <div>
          {((editingId && can('sections.update')) || (!editingId && can('sections.create'))) && (
            <button className="bg-primary text-white px-4 py-2 rounded mr-2" type="submit" disabled={sections.length >= 4 && !editingId}>{editingId ? 'تحديث' : 'إنشاء'}</button>
          )}
          {editingId && <button type="button" onClick={()=>{ setEditingId(null); setForm({ name:'', name_ar:'', name_en:'', name_de:'', order:0, active:true }) }} className="px-4 py-2">إلغاء</button>}
        </div>
      </form>

      <div className="space-y-3">
        {sections.map(s=> (
          <div key={s._id} className="p-3 border rounded flex items-center justify-between">
            <div className="flex items-center gap-3">
              {s.imageUrl && <img src={s.imageUrl.startsWith('http') ? s.imageUrl : (BASE_FILE_URL || 'http://localhost:5000') + s.imageUrl} alt="" width={64} />}
              <div>
                <div className="font-bold">{s.name_ar || s.name || s.name_en}</div>
                <div className="text-sm text-gray-600">{s.slug}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {can('sections.update') && <button onClick={()=> edit(s)} className="px-3 py-1 bg-yellow-500 text-white rounded">تعديل</button>}
              {/* إخفاء زر الحذف لأن الحذف معطّل على الخادم */}
              <button disabled className="px-3 py-1 bg-red-600 text-white rounded opacity-50 cursor-not-allowed">حذف</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
