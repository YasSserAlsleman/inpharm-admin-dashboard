import React, { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import axios from "../../api/axiosClient";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

export default function LearningLessonList() {
  const { lectureId } = useParams();
  const location = useLocation();
  const { mainId, researchId } = location.state || {};

  const [lecture, setLecture] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  const [newLesson, setNewLesson] = useState({
    name: "",
    videoFile: null,
    pdfFile: null,
    description: "",
  });

  // لتخزين نسبة التقدم لكل درس
  const [lessonProgress, setLessonProgress] = useState({});

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
    if (!newLesson.name.trim()) return alert("أدخل اسم الدرس أولاً!");
    if (!newLesson.videoFile) return alert("الرجاء اختيار ملف فيديو!");

    try {
      setAdding(true);
      const formData = new FormData();
      formData.append("name", newLesson.name);
      formData.append("lectureId", lectureId);
      formData.append("mainId", mainId);
      formData.append("researchId", researchId);
      formData.append("description", newLesson.description);
      formData.append("video", newLesson.videoFile);
      if (newLesson.pdfFile) formData.append("pdfFile", newLesson.pdfFile);

      const res = await axios.post("/learningLesson/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const { lessonId, status } = res.data;

      // إعادة تعيين الفورم
      setNewLesson({ name: "", pdfFile: null, description: "", videoFile: null });

      if (status === "processing") {
        Swal.fire({
          title: "⏳ جاري معالجة الفيديو...",
          text: "الرجاء الانتظار حتى انتهاء التحويل.",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

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
      title: "هل أنت متأكد؟",
      text: "سيتم حذف هذا الدرس نهائياً!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "نعم، احذفه",
      cancelButtonText: "إلغاء",
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
        ⏳ جارٍ تحميل الدروس...
      </div>
    );

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-primary mb-6">
        📘 الدروس التابعة للمحاضرة:{" "}
        <span className="text-blue-700">{lecture?.name || "غير معروفة"}</span>
      </h2>

      {/* إضافة درس */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        <input
          type="text"
          placeholder="اسم الدرس"
          className="border rounded p-2"
          value={newLesson.name}
          onChange={(e) => setNewLesson({ ...newLesson, name: e.target.value })}
        />
        <div></div>
        Video file:  
        <input
          type="file"
          accept="video/*"
          className="border rounded p-2"
          onChange={(e) =>
            setNewLesson({ ...newLesson, videoFile: e.target.files[0] })
          }
        />
        PDF file:
        <input
          type="file"
          accept="application/pdf"
          className="border rounded p-2"
          onChange={(e) =>
            setNewLesson({ ...newLesson, pdfFile: e.target.files[0] })
          }
        />
        <textarea
          placeholder="وصف الدرس (اختياري)"
          className="border rounded p-2 md:col-span-2"
          value={newLesson.description}
          onChange={(e) =>
            setNewLesson({ ...newLesson, description: e.target.value })
          }
        />
      </div>

      <button
        className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition ${
          adding && "opacity-60 cursor-not-allowed"
        }`}
        onClick={handleAddLesson}
        disabled={adding}
      >
        {adding ? "⏳ جاري الإضافة..." : "➕ إضافة درس"}
      </button>

      {/* قائمة الدروس */}
      <div className="mt-8 overflow-x-auto">
        {lessons.length === 0 ? (
          <p className="text-gray-500 text-center py-6">لا توجد دروس حالياً.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2">#</th>
                <th className="p-2">اسم الدرس</th>
                <th className="p-2">الوصف</th>
                <th className="p-2">الحالة</th>
                <th className="p-2 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {lessons.map((lesson, index) => (
                <tr key={lesson._id} className="border-t hover:bg-gray-50">
                  <td className="p-2">{index + 1}</td>
                  <td className="p-2 font-semibold text-gray-800">{lesson.name}</td>
                  <td className="p-2 text-gray-600">
                    {lesson.description
                      ? lesson.description.slice(0, 50) + "..."
                      : "—"}
                  </td>
                  <td className="p-2 w-40">
                    {lesson.status === "processing" && (
                      <div className="w-full bg-gray-200 rounded-full h-4 relative">
                        <div
                          className="bg-blue-600 h-4 rounded-full transition-all duration-500"
                          style={{ width: `${lessonProgress[lesson._id] || 0}%` }}
                        ></div>
                        <span className="absolute right-2 top-0 text-xs text-white">
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