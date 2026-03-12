import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import TopicCard from "../../components/VirtualPharmacyTopicCard";
import axios from "../../api/axiosClient";

export default function VirtualPharmacyMainTopic() {
  const [mainTopics, setMainTopics] = useState([]);
  const [newMainName, setNewMainName] = useState("");
  const [newMainDescription, setNewMainDescription] = useState("");
  const [newMainImageFile, setNewMainImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

    const navigate = useNavigate();
    // 🔹 جلب المحاور الرئيسية من الخادم
  const fetchMainTopics = async () => {
    try {
      const res = await axios.get("/virtualPharmacyMainTopic");
      setMainTopics(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("❌ Error loading main topics:", err);
    }
  };


 useEffect(() => {
    fetchMainTopics();
  }, []);


  // 👆 تحويل الصورة إلى base64 للعرض قبل الإضافة
  const handleImageChange = (file, setPreview, setFile) => {
    if (!file) return;
    setFile(file);

    const reader = new FileReader();
    reader.onload = (event) => setPreview(event.target.result);
    reader.readAsDataURL(file);
  };

  // ➕ إضافة محور جديد
  const handleAddMain = async () => {
    if (!newMainName.trim()) return;

    try {
      const formData = new FormData();
      formData.append("name", newMainName);
      formData.append("description", newMainDescription);
      if (newMainImageFile) formData.append("image", newMainImageFile);

      await axios.post("/virtualPharmacyMainTopic", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setNewMainName("");
      setNewMainDescription("");
      setNewMainImageFile(null);
      setPreviewImage(null);

      fetchMainTopics();
    } catch (err) {
      console.error("❌ Error adding main topic:", err);
    }
  };



  // 🗑 حذف محور رئيسي
  const handleDeleteMain = async (id) => {
    if (!window.confirm("هل تريد حذف هذا المحور الرئيسي؟")) return;
    try {
      await axios.delete(`/virtualPharmacyMainTopic/${id}`);
      fetchMainTopics();
    } catch (err) {
      console.error("❌ Error deleting main topic:", err);
    }
  };

  // ✏️ حفظ التعديلات على محور موجود
  const handleSaveEdit = async (topic) => {
    try {
      const formData = new FormData();
      formData.append("name", topic.editName);
      formData.append("description", topic.editDescription);
      if (topic.editImageFile) formData.append("image", topic.editImageFile);

      await axios.put(`/virtualPharmacyMainTopic/${topic._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      fetchMainTopics();
    } catch (err) {
      console.error("❌ Error updating main topic:", err);
    }
  };




   return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">📘 المحاور الرئيسية للصيدلية الافتراضية </h2>
  
        {/* 🔹 إضافة محور رئيسي */}
        {/* 🔹 إضافة محور رئيسي - تصميم عمودي ومحترف */}
  <div className="bg-white p-6 rounded-lg shadow-md mb-6 max-w-lg mx-auto flex flex-col gap-4">
  
    {/* اسم المحور */}
    <input
      className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
      placeholder="اسم المحور الرئيسي"
      value={newMainName}
      onChange={(e) => setNewMainName(e.target.value)}
    />
  
    {/* وصف المحور */}
    <textarea
      className="border border-gray-300 rounded px-3 py-2 overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
      placeholder="وصف المحور"
      value={newMainDescription}
      rows={1}
      onChange={(e) => setNewMainDescription(e.target.value)}
      onInput={(e) => {
        e.target.style.height = "auto";
        e.target.style.height = e.target.scrollHeight + "px";
      }}
    />
  
    {/* صورة المحور */}
    <input
      type="file"
      accept="image/*"
      onChange={(e) =>
        handleImageChange(e.target.files[0], setPreviewImage, setNewMainImageFile)
      }
      className="border border-gray-300 rounded px-3 py-2"
    />
  
    {/* معاينة الصورة */}
    {previewImage && (
      <img
        src={previewImage}
        alt="Preview"
        className="w-full h-40 object-cover rounded border"
      />
    )}
  
    {/* زر الإضافة */}
    <button
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      onClick={handleAddMain}
    >
      ➕ إضافة محور
    </button>
  </div>
  
  
        {/* 🔹 عرض قائمة المحاور */}
        {mainTopics.length === 0 ? (
          <p className="text-gray-500">لا توجد محاور رئيسية بعد.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {
            mainTopics.map((topic) => {
  
             return (
   <TopicCard
                key={topic._id}
                topic={topic}
                handleDeleteMain={handleDeleteMain}
                handleSaveEdit={handleSaveEdit}
                navigate={navigate}
                handleImageChange={handleImageChange}
              />
  
             );
            })}
          </div>
        )}
      </div>
    );

}
