import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "../../api/axiosClient";
import { BASE_FILE_URL } from '../../config/config';  // أضف هذا في الأعلى
import { useTranslation } from 'react-i18next';
import { getLocalizedValue } from '../../utils/getLocalizedValue';

export default function LearningQuestionList() {
  const { lessonId } = useParams();
  const [lesson, setLesson] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { i18n } = useTranslation();

  // نص السؤال + صورة السؤال
  const [newQuestionText, setNewQuestionText] = useState("");
  const [newQuestionTextAr, setNewQuestionTextAr] = useState("");
  const [newQuestionTextEn, setNewQuestionTextEn] = useState("");
  const [newQuestionTextDe, setNewQuestionTextDe] = useState("");
  const [questionImage, setQuestionImage] = useState(null);
  const [questionImagePreview, setQuestionImagePreview] = useState(null);

  // الملاحظة
  const [noteText, setNoteText] = useState("");
  const [noteTextAr, setNoteTextAr] = useState("");
  const [noteTextEn, setNoteTextEn] = useState("");
  const [noteTextDe, setNoteTextDe] = useState("");
  const [noteImage, setNoteImage] = useState(null);
  const [noteImagePreview, setNoteImagePreview] = useState(null);

  // خيارات السؤال
  const [options, setOptions] = useState([
    { text_ar: "", text_en: "", text_de: "", image: null, preview: null, isCorrect: false }
  ]);

  const [isMultipleCorrect, setIsMultipleCorrect] = useState(false);

  // المصادر
  const [sources, setSources] = useState([""]);


  useEffect(() => {
    if (!lessonId) return;
    fetchLessonAndQuestions();
  }, [lessonId]);

  const fetchLessonAndQuestions = async () => {
    try {
      setLoading(true);
      const [lessonRes, questionRes] = await Promise.all([
        axios.get(`/learningLesson/admin/${lessonId}`),
        axios.get(`/question/byLesson/${lessonId}`)
      ]);
      setLesson(lessonRes.data);
      setQuestions(questionRes.data);
    } catch (err) {
      console.error("❌ خطأ أثناء تحميل البيانات:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddOption = () => {
    setOptions([...options, { text_ar: "", text_en: "", text_de: "", image: null, preview: null, isCorrect: false }]);
  };

  const handleRemoveOption = (index) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleOptionChange = (index, field, value) => {
    const updated = [...options];
    updated[index][field] = value;
    setOptions(updated);
  };

  const handleOptionImageChange = (index, file) => {
    const updated = [...options];
    updated[index].image = file;
    updated[index].preview = URL.createObjectURL(file);
    setOptions(updated);
  };

  const handleTypeChange = (e) => {
    const isMultiple = e.target.value === "multiple";
    setIsMultipleCorrect(isMultiple);
    if (!isMultiple) {
      setOptions(prev => prev.map(opt => ({ ...opt, isCorrect: false })));
    }
  };

  const handleSourceChange = (index, value) => {
    const updated = [...sources];
    updated[index] = value;
    setSources(updated);
  };

  const handleAddSource = () => setSources([...sources, ""]);
  const handleRemoveSource = (index) => setSources(sources.filter((_, i) => i !== index));

  const handleCorrectChange = (index, checked) => {
    if (isMultipleCorrect) {
      const updated = [...options];
      updated[index].isCorrect = checked;
      setOptions(updated);
    } else {
      const updated = options.map((opt, i) => ({ ...opt, isCorrect: i === index }));
      setOptions(updated);
    }
  };

  const handleAddQuestion = async () => {
    if (!newQuestionTextEn.trim()) return alert("أدخل نص السؤال بالإنجليزية على الأقل!");
    if (options.length === 0) return alert("أضف على الأقل خياراً واحداً!");
    
    // التحقق من وجود خيار واحد على الأقل مع نص
    const hasValidOptions = options.some(opt => opt.text_ar.trim() || opt.text_en.trim() || opt.text_de.trim());
    if (!hasValidOptions) return alert("يجب أن يحتوي كل خيار على نص بإحدى اللغات!");
    
    // التحقق من وجود إجابة صحيحة واحدة على الأقل
    const hasCorrectAnswer = options.some(opt => opt.isCorrect);
    if (!hasCorrectAnswer) return alert("يجب تحديد إجابة صحيحة واحدة على الأقل!");

    try {
      const formData = new FormData();
      formData.append("lessonId", lessonId);
      formData.append("text", newQuestionText || newQuestionTextEn || newQuestionTextAr || newQuestionTextDe);
      formData.append("text_ar", newQuestionTextAr);
      formData.append("text_en", newQuestionTextEn);
      formData.append("text_de", newQuestionTextDe);
      formData.append("isMultipleCorrect", isMultipleCorrect);
      if (questionImage) formData.append("questionImage", questionImage);
      formData.append("noteText", noteText);
      formData.append("noteText_ar", noteTextAr);
      formData.append("noteText_en", noteTextEn);
      formData.append("noteText_de", noteTextDe);
      if (noteImage) formData.append("noteImage", noteImage);

      formData.append("sources", JSON.stringify(sources.filter((s) => s.trim() !== "")));

      // خيارات كـ JSON
      const formattedOptions = options.map(opt => ({ 
        text_ar: opt.text_ar, 
        text_en: opt.text_en, 
        text_de: opt.text_de, 
        isCorrect: opt.isCorrect 
      }));
      formData.append("options", JSON.stringify(formattedOptions));

      // صور الخيارات منفصلة
      options.forEach((opt) => {
        if (opt.image) formData.append("optionImages", opt.image);
      });


      await axios.post(`/question`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      setNewQuestionText("");
      setNewQuestionTextAr("");
      setNewQuestionTextEn("");
      setNewQuestionTextDe("");
      setQuestionImage(null);
      setQuestionImagePreview(null);
      setNoteText("");
      setNoteTextAr("");
      setNoteTextEn("");
      setNoteTextDe("");
      setNoteImage(null);
      setNoteImagePreview(null);
      setOptions([{ text_ar: "", text_en: "", text_de: "", image: null, preview: null, isCorrect: false }]);
      setIsMultipleCorrect(false);

      fetchLessonAndQuestions();
    } catch (err) {
      console.error("❌ خطأ أثناء إضافة السؤال:", err);
    }
  };

  const handleDeleteQuestion = async (id) => {
    if (!window.confirm("هل تريد حذف هذا السؤال؟")) return;
    try {
      await axios.delete(`/question/${id}`);
      fetchLessonAndQuestions();
    } catch (err) {
      console.error("❌ خطأ أثناء الحذف:", err);
    }
  };

  if (loading) return <p>⏳ جارٍ تحميل الأسئلة...</p>;

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold text-primary mb-4">
        🧠 الأسئلة الخاصة بالدرس: {lesson?.name || "غير معروف"}
      </h2>

      {/* إضافة سؤال */}
      <div className="mb-6 space-y-3 border p-4 rounded-lg bg-gray-50">
        <div>
          <label className="block text-sm font-medium mb-1">Question Text (Arabic)</label>
          <input
            type="text"
            placeholder="نص السؤال بالعربية"
            className="w-full border rounded p-2 mb-2"
            value={newQuestionTextAr}
            onChange={(e) => setNewQuestionTextAr(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Question Text (English)</label>
          <input
            type="text"
            placeholder="Question text in English"
            className="w-full border rounded p-2 mb-2"
            value={newQuestionTextEn}
            onChange={(e) => setNewQuestionTextEn(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Question Text (German)</label>
          <input
            type="text"
            placeholder="Fragetext auf Deutsch"
            className="w-full border rounded p-2 mb-2"
            value={newQuestionTextDe}
            onChange={(e) => setNewQuestionTextDe(e.target.value)}
          />
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0];
            setQuestionImage(file);
            setQuestionImagePreview(URL.createObjectURL(file));
          }}
        />
        {questionImagePreview && <img src={questionImagePreview} alt="preview" className="w-40 h-40 object-contain border mt-2" />}

        <div className="flex gap-4 items-center my-2">
          <label>
            <input type="radio" name="type" value="single" checked={!isMultipleCorrect} onChange={handleTypeChange} /> إجابة واحدة
          </label>
          <label>
            <input type="radio" name="type" value="multiple" checked={isMultipleCorrect} onChange={handleTypeChange} /> إجابات متعددة
          </label>
        </div>

        <h4 className="font-semibold">خيارات الإجابة:</h4>
        {options.map((opt, index) => (
          <div key={index} className="mb-4 p-2 border rounded">
            <div className="grid grid-cols-1 gap-2 mb-2">
              <div>
                <label className="block text-sm font-medium">Option Text (Arabic)</label>
                <input
                  type="text"
                  placeholder={`الخيار ${index + 1} بالعربية`}
                  className="w-full border rounded p-2"
                  value={opt.text_ar}
                  onChange={(e) => handleOptionChange(index, "text_ar", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Option Text (English)</label>
                <input
                  type="text"
                  placeholder={`Option ${index + 1} in English`}
                  className="w-full border rounded p-2"
                  value={opt.text_en}
                  onChange={(e) => handleOptionChange(index, "text_en", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Option Text (German)</label>
                <input
                  type="text"
                  placeholder={`Option ${index + 1} auf Deutsch`}
                  className="w-full border rounded p-2"
                  value={opt.text_de}
                  onChange={(e) => handleOptionChange(index, "text_de", e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleOptionImageChange(index, e.target.files[0])}
              />
              {opt.preview && <img src={opt.preview} alt="option preview" className="w-20 h-20 object-contain border" />}
              <label className="flex items-center gap-1">
                {isMultipleCorrect ? (
                  <input type="checkbox" checked={opt.isCorrect} onChange={(e) => handleCorrectChange(index, e.target.checked)} />
                ) : (
                  <input type="radio" name="singleCorrect" checked={opt.isCorrect} onChange={() => handleCorrectChange(index, true)} />
                )}
                صحيح
              </label>
              <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => handleRemoveOption(index)}>✖</button>
            </div>
          </div>
        ))}

        <div className="flex gap-2 mt-2">
          <button className="bg-gray-400 text-white px-3 py-1 rounded" onClick={handleAddOption}>+ خيار جديد</button>
        </div>

        <div className="mt-3">
          <h4 className="font-semibold">ملاحظة السؤال (اختياري):</h4>
          <div>
            <label className="block text-sm font-medium mb-1">Note (Arabic)</label>
            <textarea
              placeholder="ملاحظة نصية بالعربية"
              className="w-full border rounded p-2 mb-2"
              value={noteTextAr}
              onChange={(e) => setNoteTextAr(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Note (English)</label>
            <textarea
              placeholder="Note in English"
              className="w-full border rounded p-2 mb-2"
              value={noteTextEn}
              onChange={(e) => setNoteTextEn(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Note (German)</label>
            <textarea
              placeholder="Notiz auf Deutsch"
              className="w-full border rounded p-2 mb-2"
              value={noteTextDe}
              onChange={(e) => setNoteTextDe(e.target.value)}
            />
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              setNoteImage(file);
              setNoteImagePreview(URL.createObjectURL(file));
            }}
          />
          {noteImagePreview && <img src={noteImagePreview} alt="note preview" className="w-40 h-40 object-contain border mt-2" />}
        </div>

        <h4 className="font-semibold mt-4">📚 المصادر (اختياري):</h4>
        {sources.map((src, index) => (
          <div key={index} className="flex gap-2 items-center mb-2">
            <input
              type="text"
              placeholder={`المصدر ${index + 1}`}
              className="flex-1 border rounded p-2"
              value={src}
              onChange={(e) => handleSourceChange(index, e.target.value)}
            />
            <button
              className="bg-red-500 text-white px-2 py-1 rounded"
              onClick={() => handleRemoveSource(index)}
            >
              ✖
            </button>
          </div>
        ))}
        <button
          className="bg-gray-400 text-white px-3 py-1 rounded"
          onClick={handleAddSource}
        >
          + إضافة مصدر جديد
        </button>


 <div className="flex gap-2 mt-2">
          <button className="bg-primary text-white px-4 py-2 rounded" onClick={handleAddQuestion}>✅ إضافة السؤال</button>
        </div>

      </div>

      {/* عرض الأسئلة */}
      {questions.length === 0 ? (
        <p className="text-gray-500">لا توجد أسئلة حالياً.</p>
      ) : (
        <div className="space-y-4">
          {questions.map((q, idx) => (
            <div key={q._id} className="border p-3 rounded bg-gray-50">
              <h4 className="font-bold">{idx + 1}. {getLocalizedValue(q, 'text', i18n.language)}</h4>
              {q.image && <img src={`${BASE_FILE_URL}/${q.image}`} alt="question" className="w-40 h-40 object-contain mt-1" />}
               <ul className="list-disc ms-6 mt-2">
                {q.options.map((opt, i) => (
                  <li key={i} className={opt.isCorrect ? "text-green-600 font-bold" : ""}>
                    {getLocalizedValue(opt, 'text', i18n.language)} {opt.isCorrect && "✅"}
                    {opt.image && <img src={`${BASE_FILE_URL}/${opt.image}`} alt="option" className="w-20 h-20 object-contain inline-block ml-2" />} 
                  </li>
                ))}
                
                {getLocalizedValue(q, 'note', i18n.language) && <p className="mt-1 italic text-gray-700">💡 {getLocalizedValue(q, 'note', i18n.language)}</p>}
              {q.noteImage && <img src={`${BASE_FILE_URL}/${q.noteImage}`} alt="note" className="w-40 h-40 object-contain mt-1" />}
             
                {q.sources?.length > 0 && (
                  <div className="mt-2">
                    <h4 className="font-semibold">📚 المصادر:</h4>
                    <ul className="list-disc ms-6 text-blue-600">
                      {q.sources.map((src, i) => (
                        <li key={i}>
                          {src.startsWith("http") ? (
                            <a href={src} target="_blank" rel="noopener noreferrer">{src}</a>
                          ) : (
                            src
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}


              </ul>
              <button onClick={() => handleDeleteQuestion(q._id)} className="bg-red-500 text-white px-3 py-1 rounded mt-2">حذف</button>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6">
        <Link to={-1} className="text-blue-600 hover:underline">← الرجوع إلى الدروس</Link>
      </div>
    </div>
  );
}
