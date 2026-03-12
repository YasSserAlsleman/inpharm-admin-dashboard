import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "../../api/axiosClient";

export default function LearningResearchList() {
  const { mainId } = useParams();
  const navigate = useNavigate();

  const [mainTopic, setMainTopic] = useState(null);
  const [researches, setResearches] = useState([]);
  const [newResearch, setNewResearch] = useState("");
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
    if (!newResearch.trim()) return alert("أدخل اسم البحث أولاً!");
    try {
      await axios.post(`/learningResearch`, { name: newResearch, mainId });
      setNewResearch("");
      fetchMainAndResearches();
    } catch (err) {
      console.error("❌ خطأ أثناء إضافة البحث:", err);
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
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="اسم البحث الجديد"
          className="flex-1 border rounded p-2"
          value={newResearch}
          onChange={(e) => setNewResearch(e.target.value)}
        />
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
                <td className="p-2">{r.name}</td>
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

  