import { useState, useEffect } from "react";
import axios from "../../api/axiosClient";
import { useParams } from "react-router-dom";

export default function LearningLessonDetails() {
  const { lessonId } = useParams();
  const [lesson, setLesson] = useState(null);
  const [activeTab, setActiveTab] = useState("video");
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedLesson, setEditedLesson] = useState({
    name: "",
    videoUrl: "",
    pdfFile: null,
    description: "",
    videoFile: null,
    videoPreview: null,
  });

  useEffect(() => {
    fetchLesson();
    fetchComments();
  }, [lessonId]);

  const fetchLesson = async () => {
    try {
      const res = await axios.post(`/learningLesson/admin/${lessonId}`);
      setLesson(res.data);
      setEditedLesson({
        name: res.data.name || "",
        videoUrl: res.data.videoUrl || "",
        pdfFile: null,
        description: res.data.description || "",
        videoFile: null,
        videoPreview: null,
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

  const getVideoUrl = (url) => {
    return url?.startsWith("http") ? url : `https://inpharm-admin-backend.onrender.com${url}`;
  };

  const handleUpdateLesson = async () => {
    try {
      const formData = new FormData();
      formData.append("name", editedLesson.name);
      formData.append("description", editedLesson.description);

      if (editedLesson.videoFile) {
        formData.append("video", editedLesson.videoFile);
      }
      if (editedLesson.pdfFile) {
        formData.append("pdfFile", editedLesson.pdfFile);
      }

      await axios.put(`/learningLesson/update/${lessonId}`, formData, {
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
            <h2 className="text-xl font-bold">{lesson.name}</h2>
            <button
              className={`px-3 py-1 rounded text-white ${
                isEditing ? "bg-gray-500" : "bg-yellow-500"
              }`}
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? "❌ إلغاء" : "✏️ تعديل"}
            </button>
          </div>

          {isEditing ? (
            <div className="space-y-3">
              <input
                type="text"
                placeholder="اسم الدرس"
                className="border rounded p-2 w-full"
                value={editedLesson.name}
                onChange={(e) =>
                  setEditedLesson({ ...editedLesson, name: e.target.value })
                }
              />

              {/* رفع الفيديو */}
              <div>
                <label className="block text-sm font-semibold mb-1">
                  🎥 رفع فيديو الدرس:
                </label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) =>
                    setEditedLesson({
                      ...editedLesson,
                      videoFile: e.target.files[0],
                      videoPreview: URL.createObjectURL(e.target.files[0]),
                    })
                  }
                />
                {editedLesson.videoPreview && (
                  <video width="300" height="200" controls className="mt-2">
                    <source src={editedLesson.videoPreview} type="video/mp4" />
                  </video>
                )}
              </div>

              {/* رفع PDF */}
              <div>
                <label className="block text-sm font-semibold mb-1">📄 ملف PDF:</label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) =>
                    setEditedLesson({ ...editedLesson, pdfFile: e.target.files[0] })
                  }
                />
                {editedLesson.pdfFile && (
                  <p className="text-gray-700 mt-1">{editedLesson.pdfFile.name}</p>
                )}
              </div>

              <textarea
                placeholder="الوصف"
                className="border rounded p-2 w-full"
                rows="3"
                value={editedLesson.description}
                onChange={(e) =>
                  setEditedLesson({ ...editedLesson, description: e.target.value })
                }
              />

              <button
                className="bg-blue-600 text-white px-4 py-2 rounded"
                onClick={handleUpdateLesson}
              >
                💾 حفظ التعديلات
              </button>
            </div>
          ) : (
            <div>
              {/* عرض الفيديو */}
              {lesson.videoUrl ? (
                <video width="300" height="200" controls className="mb-3">
                  <source src={getVideoUrl(lesson.videoUrl)} type="video/mp4" />
                </video>
              ) : (
                <p className="text-gray-500 italic">لا يوجد فيديو لهذا الدرس.</p>
              )}

              {/* الوصف */}
              <p className="mt-4 text-gray-700">{lesson.description}</p>

              {/* عرض PDF */}
              {lesson.pdfFile && (
                <div className="mt-4">
                  <p className="font-semibold">📄 معاينة ملف PDF:</p>
                  <iframe
                    src={`https://inpharm-admin-backend.onrender.com/uploads/pdfs/${lesson.pdfFile}`}
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
