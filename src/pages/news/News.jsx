
import React, { useEffect, useState } from "react";
import axios from "../../api/axiosClient";
import { useTranslation } from 'react-i18next'
import { getLocalizedValue } from '../../utils/getLocalizedValue'

import { useNavigate } from "react-router-dom";


import NewsCard from "../../components/NewsCard";

export default function News() {

    const [news, setNews] = useState([]);
    const [newNameEn, setNewNameEn] = useState("");
    const [newNameAr, setNewNameAr] = useState("");
    const [newNameDe, setNewNameDe] = useState("");
    const [newDescriptionEn, setNewDescriptionEn] = useState("");
    const [newDescriptionAr, setNewDescriptionAr] = useState("");
    const [newDescriptionDe, setNewDescriptionDe] = useState("");

    const { i18n } = useTranslation()
    const navigate = useNavigate();


    // 🔹 جلب المحاور الرئيسية من الخادم
    const fetchNews = async () => {
        try {
            const res = await axios.get("/news");
            setNews(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error("❌ Error loading news:", err);
        }
    };

    useEffect(() => {
        fetchNews();
    }, []);



    // ➕ إضافة محور جديد
    const handleAddNews = async () => {
        if (!newNameEn.trim()) return;

        try {
            await axios.post("/news", {
                name_en: newNameEn,
                name_ar: newNameAr,
                name_de: newNameDe,
                description_en: newDescriptionEn,
                description_ar: newDescriptionAr,
                description_de: newDescriptionDe,
            });

            setNewNameEn("");
            setNewNameAr("");
            setNewNameDe("");
            setNewDescriptionEn("");
            setNewDescriptionAr("");
            setNewDescriptionDe("");

            fetchNews();
        } catch (err) {
            console.error("❌ Error adding news :", err);
        }
    };
    // 🗑 حذف محور رئيسي
    const handleDeleteNews = async (id) => {
        if (!window.confirm("هل تريد حذف هذا القسم؟")) return;
        try {
            await axios.delete(`/news/${id}`);
            fetchNews();
        } catch (err) {
            console.error("❌ Error deleting news:", err);
        }
    };


// 🔒 تحديث حالة الإخفاء لمحور
const handleToggleHide = async (newsId, isHidden) => {
  try {
    await axios.put(`/news/${newsId}/hide`, { isHidden });
    fetchNews();  // إعادة جلب البيانات لتحديث العرض
  } catch (err) {
    console.error("❌ Error toggling hide:", err);
  }
};

  // ✏️ حفظ التعديلات
  const handleSaveEdit = async (item) => {
    try {
      await axios.put(`/news/${item._id}`, {
        name_ar: item.editNameAr,
        name_en: item.editNameEn,
        name_de: item.editNameDe,
        description_ar: item.editDescriptionAr,
        description_en: item.editDescriptionEn,
        description_de: item.editDescriptionDe,
      });
      fetchNews();
    } catch (err) {
      console.error("❌ Error updating news:", err);
    }
  };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800"> الأخبار والتنبيهات</h2>

            <div className="bg-white p-6 rounded-lg shadow-md mb-6 max-w-lg mx-auto flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title (English)</label>
                  <input
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    placeholder="English title"
                    value={newNameEn}
                    onChange={(e) => setNewNameEn(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Title (Arabic)</label>
                  <input
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    placeholder="العنوان بالعربية"
                    value={newNameAr}
                    onChange={(e) => setNewNameAr(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Title (German)</label>
                  <input
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    placeholder="Titel auf Deutsch"
                    value={newNameDe}
                    onChange={(e) => setNewNameDe(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description (English)</label>
                  <textarea
                    className="w-full border border-gray-300 rounded px-3 py-2 overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    placeholder="English description"
                    value={newDescriptionEn}
                    rows={2}
                    onChange={(e) => setNewDescriptionEn(e.target.value)}
                    onInput={(e) => {
                      e.target.style.height = "auto";
                      e.target.style.height = e.target.scrollHeight + "px";
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description (Arabic)</label>
                  <textarea
                    className="w-full border border-gray-300 rounded px-3 py-2 overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    placeholder="الوصف بالعربية"
                    value={newDescriptionAr}
                    rows={2}
                    onChange={(e) => setNewDescriptionAr(e.target.value)}
                    onInput={(e) => {
                      e.target.style.height = "auto";
                      e.target.style.height = e.target.scrollHeight + "px";
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description (German)</label>
                  <textarea
                    className="w-full border border-gray-300 rounded px-3 py-2 overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    placeholder="Beschreibung auf Deutsch"
                    value={newDescriptionDe}
                    rows={2}
                    onChange={(e) => setNewDescriptionDe(e.target.value)}
                    onInput={(e) => {
                      e.target.style.height = "auto";
                      e.target.style.height = e.target.scrollHeight + "px";
                    }}
                  />
                </div>
              </div>

                {/* زر الإضافة */}
                <button
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                    onClick={handleAddNews}
                >
                    ➕ إضافة قسم جديد
                </button>
            </div>


            {/* 🔹 عرض قائمة المحاور */}
            {news.length === 0 ? (
                <p className="text-gray-500">لا توجد اقسام للاخبار والتنبيهات بعد .</p>
            ) : (

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {news.map((item) => (
                        <NewsCard
                            key={item._id}
                            item={item}
                            handleDeleteNews={handleDeleteNews}
                            handleSaveEdit={handleSaveEdit}
                            navigate={navigate}
                            handleToggleHide={handleToggleHide}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
