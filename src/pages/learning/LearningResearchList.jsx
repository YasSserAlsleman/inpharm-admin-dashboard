import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "../../api/axiosClient";
import { useTranslation } from 'react-i18next';
import { getLocalizedValue } from '../../utils/getLocalizedValue';

export default function LearningResearchList() {
  const { mainId } = useParams();
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  const [mainTopic, setMainTopic] = useState(null);
  const [researches, setResearches] = useState([]);
  const [newResearchAr, setNewResearchAr] = useState("");
  const [newResearchEn, setNewResearchEn] = useState("");
  const [newResearchDe, setNewResearchDe] = useState("");
  const [loading, setLoading] = useState(true);

  // 🧭 تحميل المحور الرئيسي + الأبحاث التابعة
  useEffect(() => {
    if (!mainId) return;
    fetchMainAndResearches();
  }, [mainId]);

  const fetchMainAndResearches = async () => {
    try {
      setLoading(true);
      const [mainRes, researchRes] = await Promise.all([
        axios.get(`/learningMainTopic/${mainId}`),
        axios.get(`/learningResearch/byMain/${mainId}`)
      ]);
      setMainTopic(mainRes.data);
      setResearches(researchRes.data);
    } catch (err) {
      console.error("❌ خطأ أثناء تحميل البيانات:", err);
    } finally {
      setLoading(false);
    }
  };

  // ➕ إضافة بحث جديد
  const handleAddResearch = async () => {
    if (!newResearchEn.trim()) return alert("أدخل اسم البحث بالإنجليزية على الأقل!");
    try {
      await axios.post(`/learningResearch`, { 
        name: newResearchAr, 
        name_en: newResearchEn, 
        name_de: newResearchDe, 
        mainId 
      });
      setNewResearchAr("");
      setNewResearchEn("");
      setNewResearchDe("");
      fetchMainAndResearches();
    } catch (err) {
      console.error("❌ خطأ أثناء إضافة البحث:", err);
    }
  };

 
// 🔒 تحديث حالة الإخفاء لمحور
const handleToggleHide = async (researchId, isHidden) => {
  try {
    await axios.put(`/learningResearch/${researchId}/hide`, { isHidden });
    fetchMainAndResearches();  // إعادة جلب البيانات لتحديث العرض
  } catch (err) {
    console.error("❌ Error toggling hide:", err);
  }
};


  // ❌ حذف بحث
  const handleDeleteResearch = async (id) => {
    if (!window.confirm("هل تريد حذف هذا البحث؟")) return;
    try {
      await axios.delete(`/learningResearch/${id}`);
      fetchMainAndResearches();
    } catch (err) {
      console.error("❌ خطأ أثناء الحذف:", err);
    }
  };

  if (loading) return <p>⏳ جارٍ تحميل الأبحاث...</p>;

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold text-primary mb-4">
        📚 الأبحاث التابعة للمحور: {mainTopic?.name || "محور غير معروف"}
      </h2>

      {/* ➕ إضافة بحث */}
      <div className="grid grid-cols-1 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">Research Name (Arabic)</label>
          <input
            type="text"
            placeholder="اسم البحث بالعربية"
            className="w-full border rounded p-2"
            value={newResearchAr}
            onChange={(e) => setNewResearchAr(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Research Name (English)</label>
          <input
            type="text"
            placeholder="Research name in English"
            className="w-full border rounded p-2"
            value={newResearchEn}
            onChange={(e) => setNewResearchEn(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Research Name (German)</label>
          <input
            type="text"
            placeholder="Forschungsname auf Deutsch"
            className="w-full border rounded p-2"
            value={newResearchDe}
            onChange={(e) => setNewResearchDe(e.target.value)}
          />
        </div>
        <button
          className="bg-primary text-white px-4 py-2 rounded"
          onClick={handleAddResearch}
        >
          + إضافة
        </button>
      </div>

      {/* 📋 قائمة الأبحاث */}
      {researches.length === 0 ? (
        <p className="text-gray-500">لا توجد أبحاث حالياً.</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">#</th>
              <th className="p-2">اسم البحث</th>
              <th className="p-2 text-center">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {researches.map((r, index) => (
              <tr key={r._id} className="border-t hover:bg-gray-50">
                <td className="p-2">{index + 1}</td>
                <td className="p-2">{getLocalizedValue(r, 'name', i18n.language)}</td>
                <td className="p-2 text-center">
                  <div className="flex justify-center gap-2">
                    {/* 👁 عرض تفاصيل البحث */}
                    <button
 onClick={() => navigate(`/research/${r._id}/lectures`,{
      state: {
        mainId: mainId,
      
      }
    })}
                       className="bg-blue-500 text-white px-3 py-1 rounded"
                    >
                      عرض المحاضرات
                    </button>

                    {/* 🗑 حذف */}
                    <button
                      onClick={() => handleDeleteResearch(r._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      حذف
                    </button>
                  </div>
                   {/* إضافة Toggle */}
      <div className="mt-4">
        <label>إخفاء من التطبيق الجوال</label>
        <input
          type="checkbox"
          checked={r.isHidden}
          onChange={(e) => handleToggleHide(r._id, e.target.checked)}
        />
      </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* 🔙 رجوع */}
      <div className="mt-6">
        <Link to="/" className="text-blue-600 hover:underline">
          ← العودة إلى المحاور الرئيسية
        </Link>
      </div>
    </div>
  );
}

  