import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import axios from "../../api/axiosClient";

export default function LearningLectureList() {
  const { researchId } = useParams();
   const location = useLocation();

  const navigate = useNavigate();
  const { mainId } = location.state || {};
  const [research, setResearch] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [newLectureName, setNewLectureName] = useState("");
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

  // ➕ إضافة محاضرة جديدة
  const handleAddLecture = async () => {
    if (!newLectureName.trim()) return alert("أدخل اسم المحاضرة أولاً!");
    try {
      await axios.post(`/lecture`, { name: newLectureName, researchId });
      setNewLectureName("");
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
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="اسم المحاضرة الجديدة"
          className="flex-1 border rounded p-2"
          value={newLectureName}
          onChange={(e) => setNewLectureName(e.target.value)}
        />
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
                <td className="p-2">{lecture.name}</td>
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
