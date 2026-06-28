import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import axios from "../../api/axiosClient";
import { useTranslation } from 'react-i18next';
import { getLocalizedValue } from '../../utils/getLocalizedValue';
import { useAuth } from '../../contexts/AuthContext';

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
  const [newLectureImage, setNewLectureImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const [loading, setLoading] = useState(true);
  const { can } = useAuth();

  // تحرير محاضرة
  const [editingLectureId, setEditingLectureId] = useState(null);
  const [editNameAr, setEditNameAr] = useState("");
  const [editNameEn, setEditNameEn] = useState("");
  const [editNameDe, setEditNameDe] = useState("");
  const [editImage, setEditImage] = useState(null);
  const [editPreviewImage, setEditPreviewImage] = useState(null);

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


  // 👆 تحويل الصورة إلى base64 للعرض قبل الإضافة
  const handleImageChange = (file, setPreview, setFile) => {
    if (!file) return;
    setFile(file);

    const reader = new FileReader();
    reader.onload = (event) => setPreview(event.target.result);
    reader.readAsDataURL(file);
  };

  const handleEditLecture = (lecture) => {
    setEditingLectureId(lecture._id);
    setEditNameAr(lecture.name_ar || "");
    setEditNameEn(lecture.name_en || "");
    setEditNameDe(lecture.name_de || "");
    setEditImage(null);
    setEditPreviewImage(lecture.imageUrl ? lecture.imageUrl : null);
  };

  const handleCancelEdit = () => {
    setEditingLectureId(null);
    setEditNameAr("");
    setEditNameEn("");
    setEditNameDe("");
    setEditImage(null);
    setEditPreviewImage(null);
  };

  const handleUpdateLecture = async (id) => {
    try {
      const formData = new FormData();
      formData.append('name', editNameAr || editNameEn || editNameDe);
      formData.append('name_ar', editNameAr);
      formData.append('name_en', editNameEn);
      formData.append('name_de', editNameDe);
      if (editImage) formData.append('image', editImage);

      await axios.put(`/lecture/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      handleCancelEdit();
      fetchResearchAndLectures();
    } catch (err) {
      console.error('❌ خطأ أثناء تحديث المحاضرة:', err);
    }
  };


  // ➕ إضافة محاضرة جديدة
  const handleAddLecture = async () => {
    if (!newLectureNameEn.trim())
       return alert("أدخل اسم المحاضرة بالإنجليزية على الأقل!");
    try {
            const formData = new FormData();
      formData.append("name", newLectureNameAr || newLectureNameEn || newLectureNameDe);
      formData.append("name_ar", newLectureNameAr);
      formData.append("name_en", newLectureNameEn);
      formData.append("name_de", newLectureNameDe);
      formData.append("researchId", researchId);
      if (newLectureImage) formData.append("image", newLectureImage);

      await axios.post(`/lecture`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setNewLectureNameAr("");
      setNewLectureNameEn("");
      setNewLectureNameDe("");
      setNewLectureImage(null);
      setPreviewImage(null);
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
      {can('addLecture') && (
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

{/* صورة المحور */}
  <input
    type="file"
    accept="image/*"
    onChange={(e) =>
      handleImageChange(e.target.files[0], setPreviewImage, setNewLectureImage)
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

        <button
          className="bg-primary text-white px-4 py-2 rounded"
          onClick={handleAddLecture}
        >
          + إضافة
        </button>
      </div>
      )}

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
                <td className="p-2">
                  {editingLectureId === lecture._id ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        className="w-full border rounded p-2"
                        value={editNameAr}
                        onChange={(e) => setEditNameAr(e.target.value)}
                        placeholder="اسم المحاضرة بالعربية"
                      />
                      <input
                        type="text"
                        className="w-full border rounded p-2"
                        value={editNameEn}
                        onChange={(e) => setEditNameEn(e.target.value)}
                        placeholder="Lecture name in English"
                      />
                      <input
                        type="text"
                        className="w-full border rounded p-2"
                        value={editNameDe}
                        onChange={(e) => setEditNameDe(e.target.value)}
                        placeholder="Vorlesungsname auf Deutsch"
                      />

                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageChange(e.target.files[0], setEditPreviewImage, setEditImage)}
                      />

                      {editPreviewImage && (
                        <img src={editPreviewImage} alt="preview" className="w-40 h-24 object-cover rounded" />
                      )}
                    </div>
                  ) : (
                    <span>{getLocalizedValue(lecture, 'name', i18n.language)}</span>
                  )}
                </td>
                <td className="p-2 text-center">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => navigate(`/lecture/${lecture._id}/lessons`, {
                        state: { mainId: mainId, researchId: researchId }
                      })}
                      className="bg-blue-500 text-white px-3 py-1 rounded"
                    >
                      عرض التفاصيل
                    </button>

                    {editingLectureId === lecture._id ? (
                      <>
                        <button
                          onClick={() => handleUpdateLecture(lecture._id)}
                          className="bg-green-500 text-white px-3 py-1 rounded"
                        >
                          حفظ
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="bg-gray-300 text-black px-3 py-1 rounded"
                        >
                          إلغاء
                        </button>
                      </>
                    ) : (
                      <>
                        {can('updateLecture') && (
                          <button
                            onClick={() => handleEditLecture(lecture)}
                            className="bg-yellow-500 text-white px-3 py-1 rounded"
                          >
                            تعديل
                          </button>
                        )}

                        {can('deleteLecture') && (
                          <button
                            onClick={() => handleDeleteLecture(lecture._id)}
                            className="bg-red-500 text-white px-3 py-1 rounded"
                          >
                            حذف
                          </button>
                        )}
                      </>
                    )}
                  </div>
                  {/* إضافة Toggle */}
                  <div className="mt-4">
                    <label>إخفاء من التطبيق الجوال</label>
                    <input
                      type="checkbox"
                      checked={lecture.isHidden}
                      onChange={(e) => handleToggleHide(lecture._id, e.target.checked)}
                      disabled={!can('updateLecture')}
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
