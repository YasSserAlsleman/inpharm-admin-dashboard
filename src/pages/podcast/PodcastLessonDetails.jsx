import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getLocalizedValue } from "../../utils/getLocalizedValue";
import axios from "../../api/axiosClient";
import { useParams } from "react-router-dom";
import { BASE_FILE_URL } from '../../config/config';
import LinkableText from "../../components/LinkableText";

export default function PodcastLessonDetails() {
    const { t,i18n } = useTranslation();
    const { lessonId } = useParams();
    const [lesson, setLesson] = useState(null);
    const [activeTab, setActiveTab] = useState("audio");
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [editedLesson, setEditedLesson] = useState({
        name: "",
        name_ar: "",
        name_en: "",
        name_de: "",
        audioUrl: "",
        audioUrl_en: "",
        audioUrl_de: "",
        pdfFile: "",
        pdfFile_en: "",
        pdfFile_de: "",
        description: "",
        description_ar: "",
        description_en: "",
        description_de: "",
        audioFile_ar: null,
        audioFile_en: null,
        audioFile_de: null,
        pdfFileUpload_ar: null,
        pdfFileUpload_en: null,
        pdfFileUpload_de: null,
        audioPreview: null,
        sources: [{ title: "", link: "" }],
    });

    useEffect(() => {
        fetchLesson();
        fetchComments();
    }, [lessonId]);

    const fetchLesson = async () => {
        try {
            const res = await axios.get(`/podcastLesson/${lessonId}`);
            setLesson(res.data);
            setEditedLesson({
                name: res.data.name || "",
                name_ar: res.data.name_ar || "",
                name_en: res.data.name_en || "",
                name_de: res.data.name_de || "",
                audioUrl: res.data.audio || "",
                audioUrl_en: res.data.audio_en || "",
                audioUrl_de: res.data.audio_de || "",
                pdfFile: res.data.pdfFile || "",
                pdfFile_en: res.data.pdfFile_en || "",
                pdfFile_de: res.data.pdfFile_de || "",
                description: res.data.description || "",
                description_ar: res.data.description_ar || "",
                description_en: res.data.description_en || "",
                description_de: res.data.description_de || "",
                audioFile_ar: null,
                audioFile_en: null,
                audioFile_de: null,
                pdfFileUpload_ar: null,
                pdfFileUpload_en: null,
                pdfFileUpload_de: null,
                audioPreview: null,
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

    const getAudioUrl = (url) => {
         return url?.startsWith("http") ? url : `${BASE_FILE_URL}/uploads/podcastLesson/${url}`;
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

            if (editedLesson.audioFile_ar) {
                formData.append("audio_ar", editedLesson.audioFile_ar);
            }
            if (editedLesson.audioFile_en) {
                formData.append("audio_en", editedLesson.audioFile_en);
            }
            if (editedLesson.audioFile_de) {
                formData.append("audio_de", editedLesson.audioFile_de);
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

            await axios.put(`/podcastLesson/${lessonId}`, formData, {
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
                {["audio", "comments"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 text-sm font-bold ${activeTab === tab
                            ? "border-b-2 border-blue-600 text-blue-600"
                            : "text-gray-500"
                            }`}
                    >
                        {tab === "audio" ? "🎧 الصوت والوصف" : "💬 التعليقات"}                    </button>
                ))}
            </div>

            {/* تبويب الفيديو والوصف */}
            {activeTab === "audio" && (
                <div>
                    <div className="flex justify-between items-center mb-3">
<h2 className="text-xl font-bold">
                      {getLocalizedValue(lesson, 'name', i18n.language) || lesson.name}
                    </h2>
                    <button
                        className={`px-3 py-1 rounded text-white ${isEditing ? "bg-gray-500" : "bg-yellow-500"
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

                            {/* رفع الصوت */}
                            <div>
                                <label className="block text-sm font-semibold mb-1">
                                    🎧 رفع ملف صوتي (العربية):
                                </label>
                                <input
                                    type="file"
                                    accept="audio/*"
                                    onChange={(e) =>
                                        setEditedLesson({
                                            ...editedLesson,
                                            audioFile_ar: e.target.files[0],
                                            audioPreview: URL.createObjectURL(e.target.files[0]),
                                        })
                                    }
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-1">
                                    🎧 رفع ملف صوتي (الإنجليزية):
                                </label>
                                <input
                                    type="file"
                                    accept="audio/*"
                                    onChange={(e) =>
                                        setEditedLesson({
                                            ...editedLesson,
                                            audioFile_en: e.target.files[0],
                                        })
                                    }
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-1">
                                    🎧 رفع ملف صوتي (الألمانية):
                                </label>
                                <input
                                    type="file"
                                    accept="audio/*"
                                    onChange={(e) =>
                                        setEditedLesson({
                                            ...editedLesson,
                                            audioFile_de: e.target.files[0],
                                        })
                                    }
                                />
                            </div>
                            {editedLesson.audioPreview && (
                                <audio controls className="mt-2 w-full">
                                    <source src={editedLesson.audioPreview} />
                                    المتصفح لا يدعم تشغيل الصوت.
                                </audio>
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
                            {getLocalizedValue(lesson, 'audio', i18n.language) ? (
                                <audio controls className="mb-3 w-full">
                                    <source src={getAudioUrl(getLocalizedValue(lesson, 'audio', i18n.language))} />
                                    المتصفح لا يدعم تشغيل الصوت.
                                </audio>
                            ) : (
                                <p className="text-gray-500 italic">لا يوجد ملف صوتي لهذا الدرس.</p>
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
    const [replyImage, setReplyImage] = useState(null);

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
                    {comment.replies.map((r, index) => (
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
