import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import TopicCard from "../../components/PodcastTopicCard";
import axios from "../../api/axiosClient";
export default function PodcastMainTopic() {

  const [mainTopics, setMainTopics] = useState([]);
  const [newMainNameAr, setNewMainNameAr] = useState("");
  const [newMainNameEn, setNewMainNameEn] = useState("");
  const [newMainNameDe, setNewMainNameDe] = useState("");
  const [newMainDescriptionAr, setNewMainDescriptionAr] = useState("");
  const [newMainDescriptionEn, setNewMainDescriptionEn] = useState("");
  const [newMainDescriptionDe, setNewMainDescriptionDe] = useState("");
  const [newMainImageFile, setNewMainImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const navigate = useNavigate();
  // 🔹 جلب المحاور الرئيسية من الخادم
  const fetchMainTopics = async () => {
    try {
      const res = await axios.get("/podcastMainTopic");
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
    if (!newMainNameAr.trim() && !newMainNameEn.trim() && !newMainNameDe.trim()) return;

    try {
      const formData = new FormData();
      formData.append("name", newMainNameAr || newMainNameEn || newMainNameDe);
      formData.append("name_ar", newMainNameAr);
      formData.append("name_en", newMainNameEn);
      formData.append("name_de", newMainNameDe);
      formData.append("description", newMainDescriptionAr || newMainDescriptionEn || newMainDescriptionDe);
      formData.append("description_ar", newMainDescriptionAr);
      formData.append("description_en", newMainDescriptionEn);
      formData.append("description_de", newMainDescriptionDe);
      if (newMainImageFile) formData.append("image", newMainImageFile);

      await axios.post("/podcastMainTopic", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setNewMainNameAr("");
      setNewMainNameEn("");
      setNewMainNameDe("");
      setNewMainDescriptionAr("");
      setNewMainDescriptionEn("");
      setNewMainDescriptionDe("");
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
      await axios.delete(`/podcastMainTopic/${id}`);
      fetchMainTopics();
    } catch (err) {
      console.error("❌ Error deleting main topic:", err);
    }
  };


// 🔒 تحديث حالة الإخفاء لمحور
const handleToggleHide = async (topicId, isHidden) => {
  try {
    await axios.put(`/podcastMainTopic/${topicId}/hide`, { isHidden });
    fetchMainTopics();  // إعادة جلب البيانات لتحديث العرض
  } catch (err) {
    console.error("❌ Error toggling hide:", err);
  }
};

  // ✏️ حفظ التعديلات على محور موجود
  const handleSaveEdit = async (topic) => {
    try {
      const formData = new FormData();
      formData.append("name", topic.editName);
      formData.append("description", topic.editDescription);
      if (topic.editImageFile) formData.append("image", topic.editImageFile);

      await axios.put(`/podcastMainTopic/${topic._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      fetchMainTopics();
    } catch (err) {
      console.error("❌ Error updating main topic:", err);
    }
  };




  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">📘 المحاور الرئيسية للبودكاست </h2>

      {/* 🔹 إضافة محور رئيسي */}
      {/* 🔹 إضافة محور رئيسي - تصميم عمودي ومحترف */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6 max-w-lg mx-auto flex flex-col gap-4">

        <div className="grid grid-cols-1 gap-3">
          <input
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            placeholder="اسم المحور الرئيسي (العربية)"
            value={newMainNameAr}
            onChange={(e) => setNewMainNameAr(e.target.value)}
          />
          <input
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            placeholder="Main topic name (English)"
            value={newMainNameEn}
            onChange={(e) => setNewMainNameEn(e.target.value)}
          />
          <input
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            placeholder="Titel des Hauptthemas (Deutsch)"
            value={newMainNameDe}
            onChange={(e) => setNewMainNameDe(e.target.value)}
          />

          <textarea
            className="border border-gray-300 rounded px-3 py-2 overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            placeholder="وصف المحور (العربية)"
            value={newMainDescriptionAr}
            rows={1}
            onChange={(e) => setNewMainDescriptionAr(e.target.value)}
            onInput={(e) => {
              e.target.style.height = "auto";
              e.target.style.height = e.target.scrollHeight + "px";
            }}
          />
          <textarea
            className="border border-gray-300 rounded px-3 py-2 overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            placeholder="Topic description (English)"
            value={newMainDescriptionEn}
            rows={1}
            onChange={(e) => setNewMainDescriptionEn(e.target.value)}
            onInput={(e) => {
              e.target.style.height = "auto";
              e.target.style.height = e.target.scrollHeight + "px";
            }}
          />
          <textarea
            className="border border-gray-300 rounded px-3 py-2 overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            placeholder="Beschreibung des Themas (Deutsch)"
            value={newMainDescriptionDe}
            rows={1}
            onChange={(e) => setNewMainDescriptionDe(e.target.value)}
            onInput={(e) => {
              e.target.style.height = "auto";
              e.target.style.height = e.target.scrollHeight + "px";
            }}
          />
        </div>

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
                                handleToggleHide={handleToggleHide}

                />

              );
            })}
        </div>
      )}
    </div>
  );

}
