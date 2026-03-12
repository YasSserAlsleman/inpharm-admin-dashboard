import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "../../api/axiosClient";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

export default function PodcastLessonList() {
  const { mainId } = useParams();
  const [lecture, setLecture] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  const [newLesson, setNewLesson] = useState({
    name: "",
    audioFile: null,
    pdfFile: null,
    description: "",
  });


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

  // ➕ إضافة درس جديد
  const handleAddLesson = async () => {
    if (!newLesson.name.trim()) return alert("أدخل اسم الدرس أولاً!");
    if (!newLesson.audioFile) return alert("الرجاء اختيار ملف صوت!");

    try {
      setAdding(true);

      const formData = new FormData();
      formData.append("name", newLesson.name);
      formData.append("mainId", mainId);
      formData.append("description", newLesson.description);
      formData.append("audio", newLesson.audioFile);   
    if (newLesson.pdfFile) formData.append("pdfFile", newLesson.pdfFile);

      await axios.post("/podcastLesson/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setNewLesson({ name: "", pdfFile: null, description: "", audioFile: null });
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
        <span className="text-blue-700">{lecture?.name || "غير معروفة"}</span>
      </h2>

      {/* ➕ إضافة درس */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">

        <input
          type="text"
          placeholder="اسم الدرس"
          className="border rounded p-2"
          value={newLesson.name}
          onChange={(e) => setNewLesson({ ...newLesson, name: e.target.value })}
        />
        <div></div>
        audio file:  <input
          type="file"
          accept="audio/*"
          className="border rounded p-2"
          onChange={(e) =>
            setNewLesson({ ...newLesson, audioFile: e.target.files[0] })
          }
        />

        PDF file:<input
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
        className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition ${adding && "opacity-60 cursor-not-allowed"
          }`}
        onClick={handleAddLesson}
        disabled={adding}
      >
        {adding ? "⏳ جاري الإضافة..." : "➕ إضافة درس"}
      </button>

      {/* 📋 قائمة الدروس */}
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
                <th className="p-2 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {lessons.map((lesson, index) => (
                <tr key={lesson._id} className="border-t hover:bg-gray-50">
                  <td className="p-2">{index + 1}</td>
                  <td className="p-2 font-semibold text-gray-800">
                    {lesson.name}
                  </td>
                  <td className="p-2 text-gray-600">
                    {lesson.description
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
