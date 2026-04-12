import React, { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getLocalizedValue } from "../../utils/getLocalizedValue";
import axios from "../../api/axiosClient";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import i18n from "../../i18n";

export default function LearningLessonList() {
  const { lectureId } = useParams();

  const location = useLocation();
    const { mainId, researchId } = location.state || {};

  const [lecture, setLecture] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const { t } = useTranslation();

  const [newLesson, setNewLesson] = useState({
    name_ar: "",
    name_en: "",
    name_de: "",
    videoFile_ar: null,
    videoFile_en: null,
    videoFile_de: null,
    pdfFileUpload_ar: null,
    pdfFileUpload_en: null,
    pdfFileUpload_de: null,
    description_ar: "",
    description_en: "",
    description_de: "",
    sources: [{ title: "", link: "" }],
  });

  // لتخزين نسبة التقدم لكل درس
  const [lessonProgress, setLessonProgress] = useState({});

  // دوال إدارة المصادر
  const addSource = () => {
    setNewLesson({
      ...newLesson,
      sources: [...newLesson.sources, { title: "", link: "" }]
    });
  };

  const removeSource = (index) => {
    const updatedSources = newLesson.sources.filter((_, i) => i !== index);
    setNewLesson({
      ...newLesson,
      sources: updatedSources
    });
  };

  const updateSource = (index, field, value) => {
    const updatedSources = newLesson.sources.map((source, i) =>
      i === index ? { ...source, [field]: value } : source
    );
    setNewLesson({
      ...newLesson,
      sources: updatedSources
    });
  };

  // تحميل المحاضرة والدروس التابعة لها
  useEffect(() => {
    if (!lectureId) return;
    fetchLectureAndLessons();
  }, [lectureId]);

  const fetchLectureAndLessons = async () => {
    try {
      setLoading(true);
      const [lecRes, lesRes] = await Promise.all([
        axios.get(`/lecture/${lectureId}`),
        axios.get(`/learningLesson/byLecture/${lectureId}`),
      ]);
      setLecture(lecRes.data);
      setLessons(lesRes.data);
    } catch (err) {
      console.error("❌ خطأ أثناء تحميل الدروس:", err);
    } finally {
      setLoading(false);
    }
  };

// 🔒 تحديث حالة الإخفاء لمحور
const handleToggleHide = async (lessonId, isHidden) => {
  try {
    await axios.put(`/learningLesson/${lessonId}/hide`, { isHidden });
    fetchLectureAndLessons();  // إعادة جلب البيانات لتحديث العرض
  } catch (err) {
    console.error("❌ Error toggling hide:", err);
  }
};
 


  // متابعة حالة الدرس أثناء المعالجة
  const pollLessonStatus = (lessonId) => {
    const interval = setInterval(async () => {
      try {

        const res = await axios.post(`/learningLesson/admin/${lessonId}`);
        const data = res.data;
        setLessonProgress((prev) => ({
          ...prev,
          [lessonId]: data.progress || 0,
        }));

        if (data.status === "ready" || data.status === "error") {
          clearInterval(interval);
          fetchLectureAndLessons(); // تحديث قائمة الدروس
          Swal.close();
          if (data.status === "ready")
            Swal.fire("✅ تم الانتهاء!", "تمت معالجة الدرس بنجاح.", "success");
          if (data.status === "error")
            Swal.fire("❌ فشل التحويل", "حدث خطأ أثناء معالجة الفيديو.", "error");
        }
      } catch (err) {
        console.error("❌ خطأ أثناء متابعة حالة الدرس:", err);
      }
    }, 2000);
  };

  // إضافة درس جديد
  const handleAddLesson = async () => {
    if (!newLesson.name_ar.trim() && !newLesson.name_en.trim() && !newLesson.name_de.trim()) return alert(t('lessons.enterName', "أدخل اسم الدرس على الأقل بلغة واحدة!"));
    if (!newLesson.videoFile_ar && !newLesson.videoFile_en && !newLesson.videoFile_de && !newLesson.pdfFileUpload_ar && !newLesson.pdfFileUpload_en && !newLesson.pdfFileUpload_de) return alert("الرجاء اختيار ملف فيديو أو PDF واحد على الأقل!");
     
    try {
      setAdding(true);
      const formData = new FormData();
      formData.append("name", newLesson.name_ar || newLesson.name_en || newLesson.name_de);
      formData.append("name_ar", newLesson.name_ar);
      formData.append("name_en", newLesson.name_en);
      formData.append("name_de", newLesson.name_de);
      formData.append("lectureId", lectureId);
      formData.append("mainId", mainId);
      formData.append("researchId", researchId);
      formData.append("description", newLesson.description_ar || newLesson.description_en || newLesson.description_de);
      formData.append("description_ar", newLesson.description_ar);
      formData.append("description_en", newLesson.description_en);
      formData.append("description_de", newLesson.description_de);
      if (newLesson.videoFile_ar) formData.append("video_ar", newLesson.videoFile_ar);
      if (newLesson.videoFile_en) formData.append("video_en", newLesson.videoFile_en);
      if (newLesson.videoFile_de) formData.append("video_de", newLesson.videoFile_de);
      if (newLesson.pdfFileUpload_ar) formData.append("pdfFile_ar", newLesson.pdfFileUpload_ar);
      if (newLesson.pdfFileUpload_en) formData.append("pdfFile_en", newLesson.pdfFileUpload_en);
      if (newLesson.pdfFileUpload_de) formData.append("pdfFile_de", newLesson.pdfFileUpload_de);

      // إضافة المصادر
      newLesson.sources.forEach((source, index) => {
        if (source.title.trim() && source.link.trim()) {
          formData.append(`sources[${index}][title]`, source.title);
          formData.append(`sources[${index}][link]`, source.link);
        }
      });

      const res = await axios.post('/learningLesson/add', formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const { lessonId, status } = res.data;

      // إعادة تعيين الفورم
      setNewLesson({ name_ar: "", name_en: "", name_de: "", description_ar: "", description_en: "", description_de: "", videoFile_ar: null, videoFile_en: null, videoFile_de: null, pdfFileUpload_ar: null, pdfFileUpload_en: null, pdfFileUpload_de: null, sources: [{ title: "", link: "" }] });
        fetchLectureAndLessons();

      if (status === "processing") {
        // Swal.fire({
        //   title: "⏳ جاري معالجة الفيديو...",
        //   text: "الرجاء الانتظار حتى انتهاء التحويل.",
        //   allowOutsideClick: false,
        //   didOpen: () => {
        //     Swal.showLoading();
        //   },
        // });
 
        pollLessonStatus(lessonId);
      } else {
        fetchLectureAndLessons();
        Swal.fire("✅ تم الحفظ!", "تمت إضافة الدرس بنجاح.", "success");
      }
    } catch (err) {
      console.error("❌ خطأ أثناء إضافة الدرس:", err.response?.data || err);
      Swal.fire(
        "خطأ",
        err.response?.data?.message || "حدث خطأ أثناء إضافة الدرس.",
        "error"
      );
    } finally {
      setAdding(false);
    }
  };

  // حذف درس
  const handleDeleteLesson = async (id) => {
    const result = await Swal.fire({
      title: t('lessons.confirmDeleteTitle'),
      text: t('lessons.confirmDeleteText'),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: t('lessons.confirmDeleteButton'),
      cancelButtonText: t('lessons.cancelButton'),
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`/learningLesson/${id}`);
        fetchLectureAndLessons();
        Swal.fire("تم الحذف!", "تم حذف الدرس بنجاح.", "success");
      } catch (err) {
        console.error("❌ خطأ أثناء الحذف:", err);
        Swal.fire("خطأ", "حدث خطأ أثناء الحذف.", "error");
      }
    }
  };

  if (loading)
    return (
      <div className="text-center text-gray-500 py-10">
        ⏳ {t('lessons.loading', 'جاري تحميل الدروس...')}
      </div>
    );

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-primary mb-6">
        📘 {t('lessons.lessonsForLecture')} {" "}
        <span className="text-blue-700">
          {getLocalizedValue(lecture, "name", i18n.language) || lecture?.name || "غير معروفة"}
        </span>
      </h2>

      {/* إضافة درس */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        <input
          type="text"
          placeholder="اسم الدرس (العربية)"
          className="border rounded p-2"
          value={newLesson.name_ar}
          onChange={(e) => setNewLesson({ ...newLesson, name_ar: e.target.value })}
        />
        <input
          type="text"
          placeholder="Lesson name (English)"
          className="border rounded p-2"
          value={newLesson.name_en}
          onChange={(e) => setNewLesson({ ...newLesson, name_en: e.target.value })}
        />
        <input
          type="text"
          placeholder="Name des Unterrichts (Deutsch)"
          className="border rounded p-2 md:col-span-2"
          value={newLesson.name_de}
          onChange={(e) => setNewLesson({ ...newLesson, name_de: e.target.value })}
        />

        <textarea
          placeholder="وصف الدرس (العربية)"
          className="border rounded p-2 md:col-span-2"
          value={newLesson.description_ar}
          onChange={(e) => setNewLesson({ ...newLesson, description_ar: e.target.value })}
        />
        <textarea
          placeholder="Lesson description (English)"
          className="border rounded p-2 md:col-span-2"
          value={newLesson.description_en}
          onChange={(e) => setNewLesson({ ...newLesson, description_en: e.target.value })}
        />
        <textarea
          placeholder="Beschreibung der Lektion (Deutsch)"
          className="border rounded p-2 md:col-span-2"
          value={newLesson.description_de}
          onChange={(e) => setNewLesson({ ...newLesson, description_de: e.target.value })}
        />

        {/* قسم المصادر */}
        <div className="md:col-span-2">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">المصادر (Sources)</label>
            <button
              type="button"
              onClick={addSource}
              className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
            >
              ➕ إضافة مصدر
            </button>
          </div>
          {newLesson.sources.map((source, index) => (
            <div key={index} className="flex gap-2 mb-2 p-2 border rounded">
              <input
                type="text"
                placeholder="عنوان المصدر"
                className="border rounded p-2 flex-1"
                value={source.title}
                onChange={(e) => updateSource(index, 'title', e.target.value)}
              />
              <input
                type="url"
                placeholder="رابط المصدر"
                className="border rounded p-2 flex-1"
                value={source.link}
                onChange={(e) => updateSource(index, 'link', e.target.value)}
              />
              <button
                type="button"
                onClick={() => removeSource(index)}
                className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
                disabled={newLesson.sources.length === 1}
              >
                🗑️
              </button>
            </div>
          ))}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Video file (العربية)</label>
          <input
            type="file"
            accept="video/*"
            className="border rounded p-2 w-full"
            onChange={(e) =>
              setNewLesson({ ...newLesson, videoFile_ar: e.target.files[0] })
            }
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Video file (English)</label>
          <input
            type="file"
            accept="video/*"
            className="border rounded p-2 w-full"
            onChange={(e) =>
              setNewLesson({ ...newLesson, videoFile_en: e.target.files[0] })
            }
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Video file (Deutsch)</label>
          <input
            type="file"
            accept="video/*"
            className="border rounded p-2 w-full"
            onChange={(e) =>
              setNewLesson({ ...newLesson, videoFile_de: e.target.files[0] })
            }
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">PDF file (العربية)</label>
          <input
            type="file"
            accept="application/pdf"
            className="border rounded p-2 w-full"
            onChange={(e) =>
              setNewLesson({ ...newLesson, pdfFileUpload_ar: e.target.files[0] })
            }
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">PDF file (English)</label>
          <input
            type="file"
            accept="application/pdf"
            className="border rounded p-2 w-full"
            onChange={(e) =>
              setNewLesson({ ...newLesson, pdfFileUpload_en: e.target.files[0] })
            }
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">PDF file (Deutsch)</label>
          <input
            type="file"
            accept="application/pdf"
            className="border rounded p-2 w-full"
            onChange={(e) =>
              setNewLesson({ ...newLesson, pdfFileUpload_de: e.target.files[0] })
            }
          />
        </div>
      </div>

      <button
        className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition ${
          adding && "opacity-60 cursor-not-allowed"
        }`}
        onClick={handleAddLesson}
        disabled={adding}
      >
        {adding ? `⏳ ${t('lessons.adding')}` : `➕ ${t('lessons.addLesson')}`}
      </button>

      {/* قائمة الدروس */}
      <div className="mt-8 overflow-x-auto">
        {lessons.length === 0 ? (
          <p className="text-gray-500 text-center py-6">{t('lessons.noLessons')}</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2">#</th>
                <th className="p-2">{t('lessons.lessonName')}</th>
                <th className="p-2">{t('lessons.description')}</th>
                <th className="p-2">{t('lessons.status')}</th>
                <th className="p-2 text-center">{t('lessons.actions')}</th>
                <th className="p-2 text-center">إخفاء</th>
              </tr>
            </thead>
            <tbody>
              {lessons.map((lesson, index) => (
                <tr key={lesson._id} className="border-t hover:bg-gray-50">
                  <td className="p-2">{index + 1}</td>
                  <td className="p-2 font-semibold text-gray-800">{getLocalizedValue(lesson, 'name', i18n.language)}</td>
                  <td className="p-2 text-gray-600">
                    {getLocalizedValue(lesson, 'description', i18n.language)
                      ? getLocalizedValue(lesson, 'description', i18n.language).slice(0, 50) + "..."
                      : "—"}
                  </td>
                  <td className="p-2 w-40">
                    {lesson.status === "processing" && (
                      <div className="w-full bg-gray-200 rounded-full h-4 relative">
                        <div
                          className="bg-blue-600 h-4 rounded-full transition-all duration-500"
                          style={{ width: `${lessonProgress[lesson._id] || 0}%` }}
                        ></div>
                        <span className="absolute right-2 top-0 text-xs text-black">
                          {lessonProgress[lesson._id] || 0}%
                        </span>
                      </div>
                    )}
                    {lesson.status === "ready" && (
                      <span className="text-green-600 font-semibold">✅ جاهز</span>
                    )}
                    {lesson.status === "error" && (
                      <span className="text-red-600 font-semibold">❌ فشل التحويل</span>
                    )}
                  </td>
                  <td className="p-2 text-center">
                    <div className="flex justify-center gap-3 text-lg">
                      <Link
                        to={`/learningLesson/${lesson._id}/details`}
                        title="عرض الدرس"
                        className="hover:text-green-600"
                      >
                        🎥
                      </Link>
                      <Link
                        to={`/learningLesson/${lesson._id}/questions`}
                        title="الاختبار"
                        className="hover:text-orange-500"
                      >
                        🧠
                      </Link>
                      <button
                        onClick={() => handleDeleteLesson(lesson._id)}
                        title="حذف"
                        className="hover:text-red-600"
                      >
                        🗑
                      </button>
                    </div>
                  </td>
                  <td className="p-2 text-center">
                    <input
                      type="checkbox"
                      checked={lesson.isHidden}
                      onChange={(e) => handleToggleHide(lesson._id, e.target.checked)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* رجوع */}
      <div className="mt-8">
        {lecture?.researchId ? (
          <Link
            to={`/research/${lecture.researchId}/lectures`}
            className="text-blue-600 hover:underline"
          >
            ← العودة إلى المحاضرات
          </Link>
        ) : (
          <span className="text-gray-500">لا يمكن تحديد البحث</span>
        )}
      </div>
    </div>
  );
}