

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "../../api/axiosClient";

export default function VirtualPharmacyQuestionList() {
  const { lessonId } = useParams();
  const [lesson, setLesson] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  // نص السؤال + صورة السؤال
  const [newQuestionText, setNewQuestionText] = useState("");
  const [questionImage, setQuestionImage] = useState(null);
  const [questionImagePreview, setQuestionImagePreview] = useState(null);

  // الملاحظة
  const [noteText, setNoteText] = useState("");
  const [noteImage, setNoteImage] = useState(null);
  const [noteImagePreview, setNoteImagePreview] = useState(null);

  // خيارات السؤال
  const [options, setOptions] = useState([
    { text: "", image: null, preview: null, isCorrect: false }
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
        axios.post(`/VirtualPharmacyLesson/admin/${lessonId}`),
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
    setOptions([...options, { text: "", image: null, preview: null, isCorrect: false }]);
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
    if (!newQuestionText.trim()) return alert("أدخل نص السؤال أولاً!");
    if (options.length === 0) return alert("أضف على الأقل خياراً واحداً!");

    try {
      const formData = new FormData();
      formData.append("lessonId", lessonId);
      formData.append("text", newQuestionText);
      formData.append("isMultipleCorrect", isMultipleCorrect);
      if (questionImage) formData.append("questionImage", questionImage);
      formData.append("noteText", noteText);
      if (noteImage) formData.append("noteImage", noteImage);

      formData.append("sources", JSON.stringify(sources.filter((s) => s.trim() !== "")));

      // خيارات كـ JSON
      const formattedOptions = options.map(opt => ({ text: opt.text, isCorrect: opt.isCorrect }));
      formData.append("options", JSON.stringify(formattedOptions));

      // صور الخيارات منفصلة
      options.forEach((opt) => {
        if (opt.image) formData.append("optionImages", opt.image);
      });


      await axios.post(`/question`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      setNewQuestionText("");
      setQuestionImage(null);
      setQuestionImagePreview(null);
      setNoteText("");
      setNoteImage(null);
      setNoteImagePreview(null);
      setOptions([{ text: "", image: null, preview: null, isCorrect: false }]);
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
        <input
          type="text"
          placeholder="نص السؤال الجديد"
          className="w-full border rounded p-2 mb-2"
          value={newQuestionText}
          onChange={(e) => setNewQuestionText(e.target.value)}
        />
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
          <div key={index} className="flex gap-2 items-center mb-1">
            <input
              type="text"
              placeholder={`الخيار ${index + 1}`}
              className="flex-1 border rounded p-2"
              value={opt.text}
              onChange={(e) => handleOptionChange(index, "text", e.target.value)}
            />
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
        ))}

        <div className="flex gap-2 mt-2">
          <button className="bg-gray-400 text-white px-3 py-1 rounded" onClick={handleAddOption}>+ خيار جديد</button>
        </div>

        <div className="mt-3">
          <h4 className="font-semibold">ملاحظة السؤال (اختياري):</h4>
          <textarea
            placeholder="ملاحظة نصية"
            className="w-full border rounded p-2 mb-2"
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
          />
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
              <h4 className="font-bold">{idx + 1}. {q.text}</h4>
              {q.image && <img src={`http://localhost:5000/${q.image}`} alt="question" className="w-40 h-40 object-contain mt-1" />}
               <ul className="list-disc ms-6 mt-2">
                {q.options.map((opt, i) => (
                  <li key={i} className={opt.isCorrect ? "text-green-600 font-bold" : ""}>
                    {opt.text} {opt.isCorrect && "✅"}
                    {opt.image && <img src={`http://localhost:5000/${opt.image}`} alt="option" className="w-20 h-20 object-contain inline-block ml-2" />} 
                  </li>
                ))}
                
                {q.noteText && <p className="mt-1 italic text-gray-700">💡 {q.noteText}</p>}
              {q.noteImage && <img src={`http://localhost:5000/${q.noteImage}`} alt="note" className="w-40 h-40 object-contain mt-1" />}
             
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
