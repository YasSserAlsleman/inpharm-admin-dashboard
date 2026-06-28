import React, { useEffect, useState } from "react";
import axios from "../../api/axiosClient";
import { useTranslation } from 'react-i18next'
import { getLocalizedValue } from '../../utils/getLocalizedValue'
import { BASE_FILE_URL } from '../../config/config'
import { useParams, useNavigate, Link } from "react-router-dom";

import SubNewsCard from "../../components/SubNewsCard";

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
  const [audioEn, setAudioEn] = useState(null);
  const [audioDe, setAudioDe] = useState(null);
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
      if (audioEn) formData.append("audio_en", audioEn);
      if (audioDe) formData.append("audio_de", audioDe);
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
      setAudioEn(null);
      setAudioDe(null);
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


// 🔒 تحديث حالة الإخفاء لمحور
const handleToggleHide = async (subNewsId, isHidden) => {
  try {
    await axios.put(`/subnews/${subNewsId}/hide`, { isHidden });
    fetchSubNews();  // إعادة جلب البيانات لتحديث العرض
  } catch (err) {
    console.error("❌ Error toggling hide:", err);
  }
};

  // ✏️ حفظ التعديلات
  const handleSaveEdit = async (item) => {
    try {
      const formData = new FormData();
      formData.append("title_ar", item.editTitleAr);
      formData.append("title_en", item.editTitleEn);
      formData.append("title_de", item.editTitleDe);
      formData.append("description_ar", item.editDescriptionAr);
      formData.append("description_en", item.editDescriptionEn);
      formData.append("description_de", item.editDescriptionDe);

      if (item.editImageFile) formData.append("image", item.editImageFile);
      if (item.editAudioArFile) formData.append("audio", item.editAudioArFile);
      if (item.editAudioEnFile) formData.append("audio_en", item.editAudioEnFile);
      if (item.editAudioDeFile) formData.append("audio_de", item.editAudioDeFile);

      await axios.put(`/subnews/${item._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      fetchSubNews();
    } catch (err) {
      console.error("❌ Error updating subnews:", err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {news ? getLocalizedValue(news, 'name', i18n.language) : "جاري تحميل القسم..."}
      </h2>
      <div className="bg-white p-6 rounded-lg shadow-md mb-6 max-w-lg mx-auto flex flex-col gap-4">
      
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
          <label className="block text-sm font-medium mb-1">Title (English)</label>
          <input
            className="border border-gray-300 rounded px-3 py-2 w-full"
            placeholder="English title"
            value={titleEn}
            onChange={(e) => setTitleEn(e.target.value)}
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
          <label className="block text-sm mb-1">🎙️  الصوت  بالعربي(اختياري)</label>
          <input type="file" accept="audio/*" onChange={(e) => setAudio(e.target.files[0])} />
        </div>

        <div>
          <label className="block text-sm mb-1">🎙️ الصوت  بالانكليزي(اختياري)</label>
          <input type="file" accept="audio/*" onChange={(e) => setAudioEn(e.target.files[0])} />
        </div>
        <div>
          <label className="block text-sm mb-1">🎙️ الصوت  بالالماني(اختياري)</label>
          <input type="file" accept="audio/*" onChange={(e) => setAudioDe(e.target.files[0])} />
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
            <SubNewsCard
              key={item._id}
              item={item}
              handleDelete={handleDelete}
              handleSaveEdit={handleSaveEdit}
              handleToggleHide={handleToggleHide}
            />
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
