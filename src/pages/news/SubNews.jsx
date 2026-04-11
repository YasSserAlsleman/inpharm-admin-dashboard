import React, { useEffect, useState } from "react";
import axios from "../../api/axiosClient";
import { useTranslation } from 'react-i18next'
import { getLocalizedValue } from '../../utils/getLocalizedValue'
import { BASE_FILE_URL } from '../../config/config'
import { useParams, useNavigate, Link } from "react-router-dom";

export default function SubNews() {
  const { newsId } = useParams(); // القسم الذي نعرض أخباره
    const [news, setMainNews] = useState(null);

  const [subNews, setSubNews] = useState([]);
  const [titleEn, setTitleEn] = useState("");
  const [titleAr, setTitleAr] = useState("");
  const [titleDe, setTitleDe] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");
  const [descriptionAr, setDescriptionAr] = useState("");
  const [descriptionDe, setDescriptionDe] = useState("");
  const [image, setImage] = useState(null);
  const [audio, setAudio] = useState(null);
  const { i18n } = useTranslation();

  const fetchSubNews = async () => {
    try {
      const [mainNews, subNews] = await Promise.all([
        axios.get(`/news/${newsId}`),
        axios.get(`/subNews/${newsId}`)
      ]);   
         setSubNews(subNews.data);
         setMainNews(mainNews.data);
    } catch (err) {
      console.error("❌ Error loading subnews:", err);
    }
  };

  useEffect(() => {
    fetchSubNews();
  }, [newsId]);

  const handleAddSubNews = async () => {
    if (!titleEn.trim()) return alert("يرجى إدخال العنوان باللغة الإنجليزية على الأقل");

    try {
      const formData = new FormData();
      formData.append("newsId", newsId);
      formData.append("title_en", titleEn);
      formData.append("title_ar", titleAr);
      formData.append("title_de", titleDe);
      formData.append("description_en", descriptionEn);
      formData.append("description_ar", descriptionAr);
      formData.append("description_de", descriptionDe);
      if (image) formData.append("image", image);
      if (audio) formData.append("audio", audio);

      await axios.post("/subnews", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setTitleEn("");
      setTitleAr("");
      setTitleDe("");
      setDescriptionEn("");
      setDescriptionAr("");
      setDescriptionDe("");
      setImage(null);
      setAudio(null);
      fetchSubNews();
    } catch (err) {
      console.error("❌ Error adding subnews:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("هل تريد حذف هذا الخبر؟")) return;
    try {
      await axios.delete(`/subnews/${id}`);
      fetchSubNews();
    } catch (err) {
      console.error("❌ Error deleting subnews:", err);
    }
  };

  return (
    <div className="p-6">
<h2 className="text-2xl font-bold mb-6 text-gray-800">
  {news ? getLocalizedValue(news, 'name', i18n.language) : "جاري تحميل القسم..."}
</h2>
      <div className="bg-white p-6 rounded-lg shadow-md mb-6 max-w-lg mx-auto flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title (English)</label>
          <input
            className="border border-gray-300 rounded px-3 py-2 w-full"
            placeholder="English title"
            value={titleEn}
            onChange={(e) => setTitleEn(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Title (Arabic)</label>
          <input
            className="border border-gray-300 rounded px-3 py-2 w-full"
            placeholder="العنوان بالعربية"
            value={titleAr}
            onChange={(e) => setTitleAr(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Title (German)</label>
          <input
            className="border border-gray-300 rounded px-3 py-2 w-full"
            placeholder="Titel auf Deutsch"
            value={titleDe}
            onChange={(e) => setTitleDe(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description (English)</label>
          <textarea
            className="border border-gray-300 rounded px-3 py-2 w-full"
            placeholder="English description"
            value={descriptionEn}
            rows={2}
            onChange={(e) => setDescriptionEn(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description (Arabic)</label>
          <textarea
            className="border border-gray-300 rounded px-3 py-2 w-full"
            placeholder="الوصف بالعربية"
            value={descriptionAr}
            rows={2}
            onChange={(e) => setDescriptionAr(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description (German)</label>
          <textarea
            className="border border-gray-300 rounded px-3 py-2 w-full"
            placeholder="Beschreibung auf Deutsch"
            value={descriptionDe}
            rows={2}
            onChange={(e) => setDescriptionDe(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm mb-1">🖼️ الصورة (اختيارية)</label>
          <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
        </div>

        <div>
          <label className="block text-sm mb-1">🎙️ الصوت (اختياري)</label>
          <input type="file" accept="audio/*" onChange={(e) => setAudio(e.target.files[0])} />
        </div>

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          onClick={handleAddSubNews}
        >
          ➕ إضافة خبر جديد
        </button>
      </div>

      {subNews.length === 0 ? (
        <p className="text-gray-500 text-center">لا توجد أخبار في هذا القسم.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subNews.map((item) => (
            <div key={item._id} className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold text-lg">{getLocalizedValue(item, 'title', i18n.language)}</h3>

{getLocalizedValue(item, 'description', i18n.language) ? (
  <p className="text-gray-600 text-sm mb-3">
    {getLocalizedValue(item, 'description', i18n.language).length > 100
      ? getLocalizedValue(item, 'description', i18n.language).slice(0, 100) + "…"
      : getLocalizedValue(item, 'description', i18n.language)}
  </p>
) : (
  <p className="text-gray-400 text-sm mb-3">لا يوجد وصف متاح</p>
)} 
              {item.image && (
                <img
                  src={`${BASE_FILE_URL}/uploads/subnews/${item.image}`}
                  alt=""
                  className="mt-2 rounded"
                />
              )}
              {item.audio && (
                <audio controls className="mt-2 w-full">
                  <source src={`${BASE_FILE_URL}/uploads/subnews/${item.audio}`} type="audio/mpeg" />
                </audio>
              )}

              <button
                onClick={() => handleDelete(item._id)}
                className="mt-4 text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                🗑 حذف
              </button>
            </div>
          ))}
        </div>
      )}
  {/* 🔙 رجوع */}
      <div className="mt-6">
        <Link to="/news" className="text-blue-600 hover:underline">
          ← العودة إلى  الأخبار والتنبيهات
        </Link>
      </div>

    </div>
  );
}
