import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getLocalizedValue } from "../../utils/getLocalizedValue";
import axios from "../../api/axiosClient";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import i18n from "../../i18n";

export default function PodcastLessonList() {
  const { mainId } = useParams();
  const [lecture, setLecture] = useState(null);
  const [lessons, setLessons] = useState([]);

  // دوال إدارة المصادر

const[loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const { i18n, t } = useTranslation();

  const [newLesson, setNewLesson] = useState({
    name_ar: "",
    name_en: "",
    name_de: "",
    audioFile_ar: null,
    audioFile_en: null,
    audioFile_de: null,
    pdfFileUpload_ar: null,
    pdfFileUpload_en: null,
    pdfFileUpload_de: null,
    description_ar: "",
    description_en: "",
    description_de: "",
    sources: [{ title: "", link: "" }],
  });

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

  // ✅ تحميل المحاضرة والدروس التابعة لها
  useEffect(() => {
    if (!mainId) return;
    fetchLectureAndLessons();
  }, [mainId]);

  const fetchLectureAndLessons = async () => {
    try {
      setLoading(true);
      const [lecRes, lesRes] = await Promise.all([
        axios.get(`/podcastMainTopic/${mainId}`),
        axios.get(`/podcastLesson/byLecture/${mainId}`),
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
      await axios.put(`/podcastLesson/${lessonId}/hide`, { isHidden });
      fetchLectureAndLessons();  // إعادة جلب البيانات لتحديث العرض
    } catch (err) {
      console.error("❌ Error toggling hide:", err);
    }
  };


  // ➕ إضافة درس جديد
  const handleAddLesson = async () => {
    if (!newLesson.name_ar.trim() && !newLesson.name_en.trim() && !newLesson.name_de.trim()) return alert(t('lessons.enterName'));
    if (!newLesson.audioFile_ar && !newLesson.audioFile_en && !newLesson.audioFile_de) return alert("الرجاء اختيار ملف صوت واحد على الأقل!");

    try {
      setAdding(true);
 
      const formData = new FormData();
      formData.append("name", newLesson.name_ar || newLesson.name_en || newLesson.name_de);
      formData.append("name_ar", newLesson.name_ar);
      formData.append("name_en", newLesson.name_en);
      formData.append("name_de", newLesson.name_de);
      formData.append("mainId", mainId);
      formData.append("description", newLesson.description_ar || newLesson.description_en || newLesson.description_de);
      formData.append("description_ar", newLesson.description_ar);
      formData.append("description_en", newLesson.description_en);
      formData.append("description_de", newLesson.description_de);
      if (newLesson.audioFile_ar) formData.append("audio_ar", newLesson.audioFile_ar);
      if (newLesson.audioFile_en) formData.append("audio_en", newLesson.audioFile_en);
      if (newLesson.audioFile_de) formData.append("audio_de", newLesson.audioFile_de);
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

      const res = await axios.post("/podcastLesson/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const { lessonId, status } = res.data;

      setNewLesson({ name_ar: "", name_en: "", name_de: "", pdfFileUpload_ar: null, pdfFileUpload_en: null, pdfFileUpload_de: null, description_ar: "", description_en: "", description_de: "", audioFile_ar: null, audioFile_en: null, audioFile_de: null, sources: [{ title: "", link: "" }] });
      fetchLectureAndLessons();

      Swal.fire("✅ تم الحفظ!", "تمت إضافة الدرس بنجاح.", "success");
    } catch (err) {
      console.error("❌ خطأ أثناء إضافة الدرس:", err);
      Swal.fire("خطأ", "حدث خطأ أثناء إضافة الدرس.", "error");
    } finally {
      setAdding(false);
    }
  };


  // ❌ حذف درس (باستخدام SweetAlert)
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
        await axios.delete(`/podcastLesson/${id}`);
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
        ⏳ جارٍ تحميل الدروس...
      </div>
    );

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-primary mb-6">
        📘 الدروس التابعة للمحور:{" "}
        <span className="text-blue-700">
          {getLocalizedValue(lecture, "name", i18n.language) || lecture?.name || "غير معروفة"}
        </span>
      </h2>

      {/* ➕ إضافة درس */}
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

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Audio file (العربية)</label>
          <input
            type="file"
            accept="audio/*"
            className="border rounded p-2 w-full"
            onChange={(e) =>
              setNewLesson({ ...newLesson, audioFile_ar: e.target.files[0] })
            }
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Audio file (English)</label>
          <input
            type="file"
            accept="audio/*"
            className="border rounded p-2 w-full"
            onChange={(e) =>
              setNewLesson({ ...newLesson, audioFile_en: e.target.files[0] })
            }
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Audio file (Deutsch)</label>
          <input
            type="file"
            accept="audio/*"
            className="border rounded p-2 w-full"
            onChange={(e) =>
              setNewLesson({ ...newLesson, audioFile_de: e.target.files[0] })
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
      </div>

      <button
        className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition ${adding && "opacity-60 cursor-not-allowed"
          }`}
        onClick={handleAddLesson}
        disabled={adding}
      >
        {adding ? `⏳ ${t('lessons.adding')}` : `➕ ${t('lessons.addLesson')}`}
      </button>

      {/* 📋 قائمة الدروس */}
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
                <th className="p-2 text-center">{t('lessons.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {lessons.map((lesson, index) => (
                <tr key={lesson._id} className="border-t hover:bg-gray-50">
                  <td className="p-2">{index + 1}</td>
                  <td className="p-2 font-semibold text-gray-800">
                    {getLocalizedValue(lesson, "name", i18n.language) || lesson.name}
                  </td>
                  <td className="p-2 text-gray-600">
                    {getLocalizedValue(lesson, "description", i18n.language)
                      ? getLocalizedValue(lesson, "description", i18n.language).slice(0, 50) + "..."
                      : lesson.description
                      ? lesson.description.slice(0, 50) + "..."
                      : "—"}
                  </td>
                  <td className="p-2 text-center">
                    <div className="flex justify-center gap-3 text-lg">
                      <Link
                        to={`/podcastLesson/${lesson._id}/details`}
                        title="عرض الدرس"
                        className="hover:text-green-600"
                      >   
                        🎥
                      </Link>
                      <Link
                        to={`/podcastLesson/${lesson._id}/questions`}
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
                      {/* إضافة Toggle */}
      <div className="mt-4">
        <label>إخفاء من التطبيق الجوال</label>
        <input
          type="checkbox"
          checked={lesson.isHidden}
          onChange={(e) => handleToggleHide(lesson._id, e.target.checked)}
        />
      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>


    </div>
  );
}
