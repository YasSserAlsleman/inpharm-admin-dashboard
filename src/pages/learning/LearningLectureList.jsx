import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import axios from "../../api/axiosClient";
import { useTranslation } from 'react-i18next';
import { getLocalizedValue } from '../../utils/getLocalizedValue';

export default function LearningLectureList() {
  const { researchId } = useParams();
   const location = useLocation();

  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const { mainId } = location.state || {};
  const [research, setResearch] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [newLectureNameAr, setNewLectureNameAr] = useState("");
  const [newLectureNameEn, setNewLectureNameEn] = useState("");
  const [newLectureNameDe, setNewLectureNameDe] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!researchId) return;
    fetchResearchAndLectures();
  }, [researchId]);

  const fetchResearchAndLectures = async () => {
    try {
      setLoading(true);
      const [researchRes, lectureRes] = await Promise.all([
        axios.get(`/learningResearch/${researchId}`),
        axios.get(`/lecture/byResearch/${researchId}`)
      ]);
      setResearch(researchRes.data);
      setLectures(lectureRes.data);
    } catch (err) {
      console.error("❌ خطأ أثناء تحميل البيانات:", err);
    } finally {
      setLoading(false);
    }
  };

// 🔒 تحديث حالة الإخفاء لمحور
const handleToggleHide = async (lectureId, isHidden) => {
  try {
    await axios.put(`/lecture/${lectureId}/hide`, { isHidden });
    fetchResearchAndLectures();  // إعادة جلب البيانات لتحديث العرض
  } catch (err) {
    console.error("❌ Error toggling hide:", err);
  }
};

  // ➕ إضافة محاضرة جديدة
  const handleAddLecture = async () => {
    if (!newLectureNameEn.trim()) return alert("أدخل اسم المحاضرة بالإنجليزية على الأقل!");
    try {
      await axios.post(`/lecture`, { 
        name: newLectureNameAr, 
        name_en: newLectureNameEn, 
        name_de: newLectureNameDe, 
        researchId 
      });
      setNewLectureNameAr("");
      setNewLectureNameEn("");
      setNewLectureNameDe("");
      fetchResearchAndLectures();
    } catch (err) {
      console.error("❌ خطأ أثناء إضافة المحاضرة:", err);
    }
  };

  // 🗑 حذف محاضرة
  const handleDeleteLecture = async (id) => {
    if (!window.confirm("هل تريد حذف هذه المحاضرة؟")) return;
    try {
      await axios.delete(`/lecture/${id}`);
      fetchResearchAndLectures();
    } catch (err) {
      console.error("❌ خطأ أثناء الحذف:", err);
    }
  };

  if (loading) return <p>⏳ جارٍ تحميل المحاضرات...</p>;

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold text-primary mb-4">
        🎓 المحاضرات التابعة للبحث: {research?.name || "بحث غير معروف"}
      </h2>

      {/* ➕ إضافة محاضرة */}
      <div className="grid grid-cols-1 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">Lecture Name (Arabic)</label>
          <input
            type="text"
            placeholder="اسم المحاضرة بالعربية"
            className="w-full border rounded p-2"
            value={newLectureNameAr}
            onChange={(e) => setNewLectureNameAr(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Lecture Name (English)</label>
          <input
            type="text"
            placeholder="Lecture name in English"
            className="w-full border rounded p-2"
            value={newLectureNameEn}
            onChange={(e) => setNewLectureNameEn(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Lecture Name (German)</label>
          <input
            type="text"
            placeholder="Vorlesungsname auf Deutsch"
            className="w-full border rounded p-2"
            value={newLectureNameDe}
            onChange={(e) => setNewLectureNameDe(e.target.value)}
          />
        </div>
        <button
          className="bg-primary text-white px-4 py-2 rounded"
          onClick={handleAddLecture}
        >
          + إضافة
        </button>
      </div>

      {/* 📋 قائمة المحاضرات */}
      {lectures.length === 0 ? (
        <p className="text-gray-500">لا توجد محاضرات حالياً.</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">#</th>
              <th className="p-2">اسم المحاضرة</th>
              <th className="p-2 text-center">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {lectures.map((lecture, index) => (
              <tr key={lecture._id} className="border-t hover:bg-gray-50">
                <td className="p-2">{index + 1}</td>
                <td className="p-2">{getLocalizedValue(lecture, 'name', i18n.language)}</td>
                <td className="p-2 text-center">
                  <div className="flex justify-center gap-2">
                    {/* 👁 عرض تفاصيل المحاضرة (الدروس) */}
                    <button
                      onClick={() => navigate(`/lecture/${lecture._id}/lessons`,{
      state: {
        mainId: mainId,
          researchId:researchId
      }
    })
                    
                    
                    
                    
                    }
                      className="bg-blue-500 text-white px-3 py-1 rounded"
                    >
                      عرض التفاصيل
                    </button>

                    {/* 🗑 حذف */}
                    <button
                      onClick={() => handleDeleteLecture(lecture._id)}
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
          checked={lecture.isHidden}
          onChange={(e) => handleToggleHide(lecture._id, e.target.checked)}
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
  {research?.mainId ? (
    <Link
      to={`/main/${research.mainId}/research`}
      className="text-blue-600 hover:underline"
    >
      ← العودة إلى صفحة الأبحاث
    </Link>
  ) : (
    <span className="text-gray-500">لا يمكن تحديد المحور الرئيسي</span>
  )}
</div>

    </div>
  );
}
