import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getLocalizedValue } from "../../utils/getLocalizedValue";
import axios from "../../api/axiosClient";
import { useParams } from "react-router-dom";
import { BASE_FILE_URL } from '../../config/config';

export default function VirtualPharmacyLessonDetails() {
  const { t, i18n } = useTranslation();

  const { lessonId } = useParams();
  const [lesson, setLesson] = useState(null);
  const [activeTab, setActiveTab] = useState("video");
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [videoQuality, setVideoQuality] = useState("720p"); // إضافة حالة للجودة
  const [editedLesson, setEditedLesson] = useState({
    name: "",
    name_ar: "",
    name_en: "",
    name_de: "",
    videoUrl: "",
    videoUrl_en: "",
    videoUrl_de: "",
    pdfFile: "",
    pdfFile_en: "",
    pdfFile_de: "",
    description: "",
    description_ar: "",
    description_en: "",
    description_de: "",
    videoFile_ar: null,
    videoFile_en: null,
    videoFile_de: null,
    pdfFileUpload_ar: null,
    pdfFileUpload_en: null,
    pdfFileUpload_de: null,
    videoPreview: null,
    sources: [{ title: "", link: "" }],
  });

  useEffect(() => {
    fetchLesson();
    fetchComments();
  }, [lessonId]);

  const fetchLesson = async () => {
    try {
      const res = await axios.get(`/VirtualPharmacyLesson/admin/${lessonId}`);
      setLesson(res.data);
      setEditedLesson({
        name: res.data.name || "",
        name_ar: res.data.name_ar || "",
        name_en: res.data.name_en || "",
        name_de: res.data.name_de || "",
        videoUrl: res.data.videoUrl || "",
        videoUrl_en: res.data.videoUrl_en || "",
        videoUrl_de: res.data.videoUrl_de || "",
        pdfFile: res.data.pdfFile || "",
        pdfFile_en: res.data.pdfFile_en || "",
        pdfFile_de: res.data.pdfFile_de || "",
        description: res.data.description || "",
        description_ar: res.data.description_ar || "",
        description_en: res.data.description_en || "",
        description_de: res.data.description_de || "",
        videoFile_ar: null,
        videoFile_en: null,
        videoFile_de: null,
        pdfFileUpload_ar: null,
        pdfFileUpload_en: null,
        pdfFileUpload_de: null,
        videoPreview: null,
        sources: res.data.sources || [{ title: "", link: "" }],
      });
    } catch (err) {
      console.error("❌ خطأ في تحميل الدرس:", err);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await axios.get(`/comments/${lessonId}`);
      setComments(res.data);
    } catch (err) {
      console.error("❌ خطأ في تحميل التعليقات:", err);
    }
  };

  const getVideoUrl = (lesson, quality = "720p") => {
    const baseField = getLocalizedValue(lesson, 'videoUrl', i18n.language);
    if (!baseField) return null;

    // إذا كانت الجودة محددة، ابحث عن الحقل المقابل
    const qualityField = `${baseField.replace('videoUrl', `videoUrl_${quality}`)}`;
    const url = lesson[qualityField] || baseField;

    return url?.startsWith("http") ? url : `${BASE_FILE_URL}${url}`;
  };

  const getPdfUrl = (lesson, field) => {
    const url = getLocalizedValue(lesson, field, i18n.language) || lesson[field];
    return url ? `${BASE_FILE_URL}/uploads/pdfs/${url}` : null;
  };

  // دوال إدارة المصادر
  const addSource = () => {
    setEditedLesson({
      ...editedLesson,
      sources: [...editedLesson.sources, { title: "", link: "" }]
    });
  };

  const removeSource = (index) => {
    const updatedSources = editedLesson.sources.filter((_, i) => i !== index);
    setEditedLesson({
      ...editedLesson,
      sources: updatedSources
    });
  };

  const updateSource = (index, field, value) => {
    const updatedSources = editedLesson.sources.map((source, i) =>
      i === index ? { ...source, [field]: value } : source
    );
    setEditedLesson({
      ...editedLesson,
      sources: updatedSources
    });
  };

  const handleUpdateLesson = async () => {
    try {
      const formData = new FormData();
      formData.append("name", editedLesson.name_ar || editedLesson.name_en || editedLesson.name_de || editedLesson.name);
      formData.append("name_ar", editedLesson.name_ar);
      formData.append("name_en", editedLesson.name_en);
      formData.append("name_de", editedLesson.name_de);
      formData.append("description", editedLesson.description_ar || editedLesson.description_en || editedLesson.description_de || editedLesson.description);
      formData.append("description_ar", editedLesson.description_ar);
      formData.append("description_en", editedLesson.description_en);
      formData.append("description_de", editedLesson.description_de);

      if (editedLesson.videoFile_ar) {
        formData.append("video_ar", editedLesson.videoFile_ar);
      }
      if (editedLesson.videoFile_en) {
        formData.append("video_en", editedLesson.videoFile_en);
      }
      if (editedLesson.videoFile_de) {
        formData.append("video_de", editedLesson.videoFile_de);
      }
      if (editedLesson.pdfFileUpload_ar) {
        formData.append("pdfFile_ar", editedLesson.pdfFileUpload_ar);
      }
      if (editedLesson.pdfFileUpload_en) {
        formData.append("pdfFile_en", editedLesson.pdfFileUpload_en);
      }
      if (editedLesson.pdfFileUpload_de) {
        formData.append("pdfFile_de", editedLesson.pdfFileUpload_de);
      }

      // إضافة المصادر
      editedLesson.sources.forEach((source, index) => {
        if (source.title.trim() && source.link.trim()) {
          formData.append(`sources[${index}][title]`, source.title);
          formData.append(`sources[${index}][link]`, source.link);
        }
      });

      await axios.put(`/VirtualPharmacyLesson/${lessonId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setIsEditing(false);
      fetchLesson();
      alert("✅ تم تحديث بيانات الدرس بنجاح!");
    } catch (err) {
      console.error("❌ خطأ أثناء تعديل الدرس:", err);
      alert("حدث خطأ أثناء حفظ التعديلات!");
    }
  };

  const handleAddComment = async (text, parentId = null) => {
    if (!text.trim()) return;
    try {
      await axios.post("/comments", {
        lessonId,
        parentId: parentId || null,
        userName: "Admin",
        userRole: "admin",
        text,
      });
      fetchComments();
    } catch (err) {
      console.error("❌ خطأ أثناء إضافة التعليق:", err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا التعليق وكل ردوده؟")) return;
    try {
      await axios.delete(`/comments/${commentId}`);
      fetchComments();
    } catch (err) {
      console.error("❌ خطأ أثناء حذف التعليق:", err);
    }
  };

  if (!lesson) return <p>⏳ جارٍ التحميل...</p>;

  return (
    <div className="p-4 bg-white rounded shadow">
      {/* Tabs */}
      <div className="flex border-b mb-4">
        {["video", "comments"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-bold ${
              activeTab === tab
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500"
            }`}
          >
            {tab === "video" ? "🎥 الفيديو والوصف" : "💬 التعليقات"}
          </button>
        ))}
      </div>

      {/* تبويب الفيديو والوصف */}
      {activeTab === "video" && (
        <div>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-bold">
              {getLocalizedValue(lesson, 'name', i18n.language) || lesson.name}
            </h2>
            <button
              className={`px-3 py-1 rounded text-white ${
                isEditing ? "bg-gray-500" : "bg-yellow-500"
              }`}
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? `❌ ${t('lessons.cancelEdit')}` : `✏️ ${t('lessons.edit')}`}
            </button>
          </div>

          {isEditing ? (
            <div className="space-y-3">
              <input
                type="text"
                placeholder="اسم الدرس (العربية)"
                className="border rounded p-2 w-full"
                value={editedLesson.name_ar}
                onChange={(e) =>
                  setEditedLesson({ ...editedLesson, name_ar: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Lesson name (English)"
                className="border rounded p-2 w-full"
                value={editedLesson.name_en}
                onChange={(e) =>
                  setEditedLesson({ ...editedLesson, name_en: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Name des Unterrichts (Deutsch)"
                className="border rounded p-2 w-full"
                value={editedLesson.name_de}
                onChange={(e) =>
                  setEditedLesson({ ...editedLesson, name_de: e.target.value })
                }
              />

              {/* رفع الفيديو */}
              <div>
                <label className="block text-sm font-semibold mb-1">
                  🎥 رفع فيديو الدرس (العربية):
                </label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) =>
                    setEditedLesson({
                      ...editedLesson,
                      videoFile_ar: e.target.files[0],
                      videoPreview: URL.createObjectURL(e.target.files[0]),
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">
                  🎥 رفع فيديو الدرس (الإنجليزية):
                </label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) =>
                    setEditedLesson({ ...editedLesson, videoFile_en: e.target.files[0] })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">
                  🎥 رفع فيديو الدرس (الألمانية):
                </label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) =>
                    setEditedLesson({ ...editedLesson, videoFile_de: e.target.files[0] })
                  }
                />
              </div>
              {editedLesson.videoPreview && (
                <video width="300" height="200" controls className="mt-2">
                  <source src={editedLesson.videoPreview} type="video/mp4" />
                </video>
              )}

              {/* رفع PDF */}
              <div>
                <label className="block text-sm font-semibold mb-1">📄 ملف PDF (العربية):</label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) =>
                    setEditedLesson({ ...editedLesson, pdfFileUpload_ar: e.target.files[0] })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">📄 ملف PDF (الإنجليزية):</label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) =>
                    setEditedLesson({ ...editedLesson, pdfFileUpload_en: e.target.files[0] })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">📄 ملف PDF (الألمانية):</label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) =>
                    setEditedLesson({ ...editedLesson, pdfFileUpload_de: e.target.files[0] })
                  }
                />
              </div>

              <textarea
                placeholder="الوصف (العربية)"
                className="border rounded p-2 w-full"
                rows="3"
                value={editedLesson.description_ar}
                onChange={(e) =>
                  setEditedLesson({ ...editedLesson, description_ar: e.target.value })
                }
              />
              <textarea
                placeholder="Lesson description (English)"
                className="border rounded p-2 w-full"
                rows="3"
                value={editedLesson.description_en}
                onChange={(e) =>
                  setEditedLesson({ ...editedLesson, description_en: e.target.value })
                }
              />
              <textarea
                placeholder="Beschreibung der Lektion (Deutsch)"
                className="border rounded p-2 w-full"
                rows="3"
                value={editedLesson.description_de}
                onChange={(e) =>
                  setEditedLesson({ ...editedLesson, description_de: e.target.value })
                }
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
                {editedLesson.sources.map((source, index) => (
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
                      disabled={editedLesson.sources.length === 1}
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>

              <button
                className="bg-blue-600 text-white px-4 py-2 rounded"
                onClick={handleUpdateLesson}
              >
                💾 {t('lessons.saveChanges')}
              </button>
            </div>
          ) : (
            <div>
              {/* خيار الجودة */}
              <div className="mb-3">
                <label className="block text-sm font-semibold mb-1">🎥 جودة الفيديو:</label>
                <select
                  value={videoQuality}
                  onChange={(e) => setVideoQuality(e.target.value)}
                  className="border rounded p-2"
                >
                  <option value="480p">480p - جودة منخفضة (سريعة)</option>
                  <option value="720p">720p - جودة متوسطة (موصى به)</option>
                </select>
              </div>

              {/* عرض الفيديو */}
              {getLocalizedValue(lesson, 'videoUrl', i18n.language) ? (
                <video width="300" height="200" controls className="mb-3">
                  <source src={getVideoUrl(lesson, videoQuality)} type="video/mp4" />
                </video>
              ) : (
                <p className="text-gray-500 italic">لا يوجد فيديو لهذا الدرس.</p>
              )}

              {/* الوصف */}
              <p className="mt-4 text-gray-700">
                {getLocalizedValue(lesson, 'description', i18n.language) || lesson.description}
              </p>

              {/* عرض المصادر */}
              {lesson.sources && lesson.sources.length > 0 && (
                <div className="mt-4">
                  <p className="font-semibold mb-2">🔗 المصادر:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {lesson.sources.map((source, index) => (
                      <li key={index}>
                        <a
                          href={source.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline"
                        >
                          {source.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* عرض PDF */}
              {getPdfUrl(lesson, 'pdfFile') && (
                <div className="mt-4">
                  <p className="font-semibold">📄 معاينة ملف PDF:</p>
                  <iframe
                    src={getPdfUrl(lesson, 'pdfFile')}
                    width="100%"
                    height="500px"
                    className="border mt-2"
                    title="PDF Preview"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* تبويب التعليقات */}
      {activeTab === "comments" && (
        <div>
          <h3 className="text-lg font-semibold mb-2">💬 التعليقات</h3>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="أضف تعليقك..."
              className="border rounded p-2 flex-1"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded"
              onClick={() => {
                handleAddComment(newComment);
                setNewComment("");
              }}
            >
              إرسال
            </button>
          </div>

          {comments.length === 0 ? (
            <p className="text-gray-500">لا توجد تعليقات بعد.</p>
          ) : (
            <div className="space-y-3">
              {comments.map((comment) => (
                <CommentItem
                  key={comment._id}
                  comment={comment}
                  onReply={handleAddComment}
                  onDeleteComment={handleDeleteComment}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function CommentItem({ comment, onReply, onDeleteComment }) {
  const [replyText, setReplyText] = useState("");

  return (
    <div className="border rounded p-3">
      <div className="flex justify-between items-center">
        <p className="font-semibold text-gray-800">{comment.userName || "مستخدم"}</p>
        <button
          className="text-red-600 text-sm"
          onClick={() => onDeleteComment(comment._id)}
        >
          🗑️ حذف التعليق
        </button>
      </div>

      <p className="text-gray-700">{comment.text}</p>

      <div className="mt-2">
        <input
          type="text"
          placeholder="رد..."
          className="border rounded p-1 text-sm w-2/3"
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
        />
        <button
          className="ml-2 bg-green-500 text-white px-2 py-1 rounded text-sm"
          onClick={() => {
            if (replyText.trim()) {
              onReply(replyText, comment._id);
              setReplyText("");
            }
          }}
        >
          رد
        </button>
      </div>

      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-6 mt-3 border-l pl-3">
          {comment.replies.map((r, index) => (
            <div key={index} className="flex justify-between text-sm mb-1">
              <p>
                <strong>{r.userName || "مستخدم"}:</strong> {r.text}
              </p>
              <button
                className="text-red-500 text-xs"
                onClick={() => onDeleteComment(r._id)}
              >
                حذف الرد
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
