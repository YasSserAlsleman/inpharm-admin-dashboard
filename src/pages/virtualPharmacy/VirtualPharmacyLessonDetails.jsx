import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getLocalizedValue } from "../../utils/getLocalizedValue";
import axios from "../../api/axiosClient";
import { useParams } from "react-router-dom";
import { BASE_FILE_URL } from '../../config/config';
import RelatedLessonsModal from "../../components/RelatedLessonsModal";
import LinkableText from "../../components/LinkableText";
import MediaStatusIndicator from "../../components/MediaStatusIndicator";
import Swal from "sweetalert2";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function VirtualPharmacyLessonDetails() {
  const { t, i18n } = useTranslation();

  const { lessonId } = useParams();
  const [lesson, setLesson] = useState(null);
  const [activeTab, setActiveTab] = useState("video");
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [videoQuality, setVideoQuality] = useState("720p"); // إضافة حالة للجودة
  const [showRelatedLessonsModal, setShowRelatedLessonsModal] = useState(false);
  const [relatedLessons, setRelatedLessons] = useState([]);
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
    isFree: false,
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
      setRelatedLessons(res.data.relatedLessons || []);
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
        isFree: res.data.isFree || false,
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
    const lang = i18n.language;
    const baseFieldName = lang === "en" ? "videoUrl_en" : lang === "de" ? "videoUrl_de" : "videoUrl";
    const baseUrl = lesson[baseFieldName] || lesson.videoUrl;
    if (!baseUrl) return null;

    const qualityFieldName = lang === "en"
      ? `videoUrl_en_${quality}`
      : lang === "de"
        ? `videoUrl_de_${quality}`
        : `videoUrl_${quality}`;

    const url = lesson[qualityFieldName] || baseUrl;
    console.log(`🔍 جلب رابط الفيديو: ${BASE_FILE_URL}/uploads${url}`);
    return url?.startsWith("http") ? url : `${BASE_FILE_URL}/uploads${url}`;
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

  const handleSaveRelatedLessons = async (selected) => {
    try {
      await axios.put(`/VirtualPharmacyLesson/${lessonId}/relatedLessons`, {
        relatedLessons: selected
      });
      setRelatedLessons(selected);
      setShowRelatedLessonsModal(false);
      Swal.fire({
        title: "تم بنجاح",
        text: "تم حفظ الدروس المرتبطة بنجاح",
        icon: "success",
        timer: 2000
      });
    } catch (err) {
      console.error("خطأ:", err);
      Swal.fire({
        title: "خطأ",
        text: err.response?.data?.message || "حدث خطأ أثناء حفظ الدروس المرتبطة",
        icon: "error"
      });
    }
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
      formData.append("isFree", editedLesson.isFree);

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

      await axios.put(`/VirtualPharmacyLesson/${lessonId}/relatedLessons`, {
        relatedLessons: relatedLessons
      });

      setShowRelatedLessonsModal(false);
      setIsEditing(false);
      
      Swal.fire({
        title: "تم بنجاح",
        text: "تم تحديث بيانات الدرس بنجاح!",
        icon: "success",
        timer: 2000
      });
    } catch (err) {
      console.error("❌ خطأ أثناء تعديل الدرس:", err);
      Swal.fire({
        title: "خطأ",
        text: err.response?.data?.message || "حدث خطأ أثناء حفظ التعديلات!",
        icon: "error"
      });
    }
  };

  const handleAddComment = async (text, imagefile, parentId = null) => {
    if (!text.trim()) return;
    try {
      const formData = new FormData();
      formData.append("lessonId", lessonId);
      formData.append("text", text);
      if (parentId) formData.append("parentId", parentId);
      if (imagefile) formData.append("commentImage", imagefile);

      await axios.post("/comments", formData, {
        headers: { "Content-Type": "multipart/form-data" },
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
          
          {/* مؤشر حالة الملفات */}
          {lesson && (
            <div className="mb-4 bg-gray-50 p-3 rounded border border-gray-200">
              <h3 className="font-semibold mb-2">📊 حالة الملفات:</h3>
              <MediaStatusIndicator lesson={lesson} type="pharmacy" compact={false} />
            </div>
          )}
           <div>
             < button     onClick={() => setIsEditing(!isEditing)}
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

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isFreeEditCheckbox"
                  checked={editedLesson.isFree}
                  onChange={(e) => setEditedLesson({ ...editedLesson, isFree: e.target.checked })}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="isFreeEditCheckbox" className="text-gray-700 font-semibold cursor-pointer">
                  مجاني (Free Lesson)
                </label>
              </div>

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

              <div className="md:col-span-2 space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-700">الوصف (العربية):</label>
                  <div className="bg-white">
                    <ReactQuill
                      theme="snow"
                      value={editedLesson.description_ar || ""}
                      onChange={(val) => setEditedLesson({ ...editedLesson, description_ar: val })}
                      className="h-40 mb-12"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-700">Description (English):</label>
                  <div className="bg-white">
                    <ReactQuill
                      theme="snow"
                      value={editedLesson.description_en || ""}
                      onChange={(val) => setEditedLesson({ ...editedLesson, description_en: val })}
                      className="h-40 mb-12"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-700">Beschreibung (Deutsch):</label>
                  <div className="bg-white">
                    <ReactQuill
                      theme="snow"
                      value={editedLesson.description_de || ""}
                      onChange={(val) => setEditedLesson({ ...editedLesson, description_de: val })}
                      className="h-40 mb-12"
                    />
                  </div>
                </div>
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

              {/* قسم الدروس المرتبطة */}
              <div className="md:col-span-2 bg-purple-50 p-4 rounded border-2 border-purple-200">
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-medium text-gray-700 font-semibold">🔗 الدروس المرتبطة</label>
                  <button
                    type="button"
                    onClick={() => setShowRelatedLessonsModal(true)}
                    className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700"
                  >
                    ➕ إضافة دروس مرتبطة
                  </button>
                </div>
                {relatedLessons.length > 0 ? (
                  <div className="space-y-2">
                    {relatedLessons.map((related, index) => (
                      <div
                        key={index}
                        className="bg-white p-3 rounded border border-purple-300 flex justify-between items-center"
                      >
                        <div>
                          <p className="font-medium text-gray-800">{related.name}</p>
                          <p className="text-xs text-gray-600">
                            {related.lessonType === "learning"
                              ? "📚 درس تعلم"
                              : related.lessonType === "podcast"
                              ? "🎙️ درس بودكاست"
                              : "💊 درس صيدلية"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic text-sm">لم تضف أي دروس مرتبطة بعد</p>
                )}
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

              {/* عرض الدروس المرتبطة */}
              {relatedLessons && relatedLessons.length > 0 && (
                <div className="mt-6 bg-purple-50 p-4 rounded border-2 border-purple-200">
                  <h3 className="font-semibold text-lg mb-3">🔗 الدروس المرتبطة</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {relatedLessons.map((related, index) => (
                      <div
                        key={index}
                        className="bg-white p-3 rounded border border-purple-300 hover:shadow-md transition"
                      >
                        <p className="font-medium text-gray-800">{related.name}</p>
                        <p className="text-xs text-gray-600 mt-1">
                          {related.lessonType === "learning"
                            ? "📚 درس تعلم"
                            : related.lessonType === "podcast"
                            ? "🎙️ درس بودكاست"
                            : "💊 درس صيدلية"}
                        </p>
                      </div>
                    ))}
                  </div>
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

            {/* Related Lessons Modal */}
            <RelatedLessonsModal
                isOpen={showRelatedLessonsModal}
                onClose={() => setShowRelatedLessonsModal(false)}
                relatedLessons={relatedLessons}
                onSave={handleSaveRelatedLessons}
                currentLessonId={lessonId}
            />

    </div>
  );
}

function CommentItem({ comment, onReply, onDeleteComment }) {
  const [replyText, setReplyText] = useState("");
  const [replyImage, setReplyImage] = useState(null);
  const [likes, setLikes] = useState(comment.likes || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [reported, setReported] = useState(false);
  const [reports] = useState(comment.reports || 0);

  const handleLike = async () => {
    try {
      const res = await axios.post(`/comments/${comment._id}/like`);
      setLikes(res.data.likes);
      setIsLiked(res.data.isLiked);
    } catch (err) {
      console.error("خطأ في الإعجاب:", err);
    }
  };

  const handleReport = async () => {
    if (reported) {
      alert("لقد أبلغت عن هذا التعليق بالفعل");
      return;
    }

    const reason = prompt("اختر سبب الإبلاغ:\n1- محتوى غير مناسب\n2- لغة سيئة\n3- رسالة مزعجة\n4- أخرى");
    
    if (!reason) return;

    try {
      await axios.post(`/comments/${comment._id}/report`, { 
        reason: reason || "محتوى غير مناسب"
      });
      setReported(true);
      alert("تم الإبلاغ عن التعليق بنجاح");
    } catch (err) {
      alert(err.response?.data?.message || "فشل في الإبلاغ");
    }
  };

  if (comment.isDeleted) {
    return (
      <div className="border rounded p-3 bg-gray-100 opacity-60">
        <p className="text-gray-500 italic text-sm">تم حذف هذا التعليق</p>
      </div>
    );
  }

  return (
    <div className="border rounded p-3">
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="font-semibold text-gray-800">{comment.userName || "مستخدم"}</p>
          <p className="text-xs text-gray-500">
            {comment.userType === "admin" ? "👨‍💼 مشرف" : 
             comment.userType === "manager" ? "👨‍🏫 معلم" : "👤 طالب"}
          </p>
        </div>
        <div className="flex gap-2">
          {/* زر الإعجاب */}
          <button
            onClick={handleLike}
            className={`px-2 py-1 rounded text-sm flex items-center gap-1 ${
              isLiked 
                ? "bg-red-100 text-red-600" 
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
            title="إعجاب"
          >
            ❤️ {likes}
          </button>

          {/* زر الإبلاغ */}
          <button
            onClick={handleReport}
            className={`px-2 py-1 rounded text-sm flex items-center gap-1 ${
              reported
                ? "bg-yellow-100 text-yellow-600"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
            title={reported ? "تم الإبلاغ" : "إبلاغ"}
          >
            🚩 {reports > 0 && reports}
          </button>

          {/* زر الحذف */}
          <button
            className="text-red-600 text-sm px-2 py-1 hover:bg-red-100 rounded"
            onClick={() => {
              if (window.confirm("هل تريد حذف هذا التعليق؟")) {
                onDeleteComment(comment._id);
              }
            }}
            title="حذف"
          >
            🗑️
          </button>
        </div>
      </div>

      <p className="text-gray-700"><LinkableText text={comment.text} className="text-gray-700" /></p>

      {/* 🖼️ عرض صورة التعليق إذا كانت موجودة */}
      {comment.commentImageUrl && (
        <div className="mt-2 mb-2">
          <img 
            src={`${BASE_FILE_URL}${comment.commentImageUrl}`} 
            alt="comment" 
            className="max-w-xs max-h-64 rounded border"
            onError={(e) => {
              e.target.src = "";
              e.target.style.display = "none";
            }}
          />
        </div>
      )}

      <div className="mt-2">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="رد..."
            className="border rounded p-1 text-sm w-2/3"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            className="text-sm"
            onChange={(e) => setReplyImage(e.target.files?.[0])}
            title="اختر صورة للرد"
          />
          <button
            className="ml-2 bg-green-500 text-white px-2 py-1 rounded text-sm"
            onClick={() => {
              if (replyText.trim()) {
                onReply(replyText, replyImage, comment._id);
                setReplyText("");
                setReplyImage(null);
              }
            }}
          >
            رد
          </button>
        </div>
        {replyImage && (
          <p className="text-xs text-gray-600 mt-1">
            ✓ تم اختيار صورة: {replyImage.name}
          </p>
        )}
      </div>

      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-6 mt-3 border-l pl-3">
          {comment.replies.filter(r => !r.isDeleted).map((r, index) => (
            <div key={index}>
              <div className="flex justify-between text-sm mb-1">
                <div>
                  <p>
                    <strong>{r.userName || "مستخدم"}:</strong> <LinkableText text={r.text} />
                  </p>
                  {/* 🖼️ عرض صورة الرد إذا كانت موجودة */}
                  {r.commentImageUrl && (
                    <img 
                      src={`${BASE_FILE_URL}${r.commentImageUrl}`} 
                      alt="reply" 
                      className="max-w-xs max-h-48 rounded border mt-1"
                      onError={(e) => {
                        e.target.src = "";
                        e.target.style.display = "none";
                      }}
                    />
                  )}
                </div>
                <button
                  className="text-red-500 text-xs"
                  onClick={() => onDeleteComment(r._id)}
                >
                  حذف الرد
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
