import React, { useState, useEffect, useCallback } from "react";
import axios from "../api/axiosClient";
import Swal from "sweetalert2";

export default function RelatedLessonsModal({ isOpen, onClose,relatedLessons, onSave, currentLessonId }) {
  const [selectedLessons, setSelectedLessons] = useState(relatedLessons || []);
  const [activeTab, setActiveTab] = useState("learning"); // learning, podcast, pharmacy

  // Learning tab states
  const [learningMainTopics, setLearningMainTopics] = useState([]);
  const [selectedLearningTopic, setSelectedLearningTopic] = useState(null);
  const [researches, setResearches] = useState([]);
  const [selectedResearch, setSelectedResearch] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [learningLessons, setLearningLessons] = useState([]);

  // Podcast tab states
  const [podcastMainTopics, setPodcastMainTopics] = useState([]);
  const [selectedPodcastTopic, setSelectedPodcastTopic] = useState(null);
  const [podcastLessons, setPodcastLessons] = useState([]);

  // Pharmacy tab states
  const [pharmacyMainTopics, setPharmacyMainTopics] = useState([]);
  const [selectedPharmacyTopic, setSelectedPharmacyTopic] = useState(null);
  const [pharmacyLessons, setPharmacyLessons] = useState([]);

  const [loadingLearning, setLoadingLearning] = useState(false)
  const [loadingPodcast, setLoadingPodcast] = useState(false)
  const [loadingPharmacy, setLoadingPharmacy] = useState(false)
  


  // Load initial data
  useEffect(() => {
    if (isOpen) {
      fetchLearningTopic();
      fetchPodcastMainTopics();
      fetchPharmacyMainTopics();
    }
  }, [isOpen]);

  // Load research when main topic is selected
  useEffect(() => {
    if (selectedLearningTopic) {
      fetchResearchesByTopic(selectedLearningTopic);
    }
  }, [selectedLearningTopic]);

  // Load lectures when research is selected
  useEffect(() => {
    if (selectedResearch) {
      fetchLecturesByResearch(selectedResearch);
    }
  }, [selectedResearch]);

  // Load learning lessons when lecture is selected
  useEffect(() => {
    if (selectedLecture) {
      fetchLearningLessonsByLecture(selectedLecture);
    }
  }, [selectedLecture]);

  // Load podcast lessons when topic is selected
  useEffect(() => {
    if (selectedPodcastTopic) {
      fetchPodcastLessonsByMainTopic(selectedPodcastTopic);
    }
  }, [selectedPodcastTopic]);

  // Load pharmacy lessons when topic is selected
  useEffect(() => {
    if (selectedPharmacyTopic) {
      fetchPharmacyLessonsByMainTopic(selectedPharmacyTopic);
    }
  }, [selectedPharmacyTopic]);

  // 📚 Fetch Learning Main Topic
  const fetchLearningTopic = useCallback(async () => {
    try {
      setLoadingLearning(true);
      const res = await axios.get("/learningMainTopic");
      setLearningMainTopics(res.data);
    } catch (err) {
      console.error("Error fetching researches:", err);
      Swal.fire("خطأ", "فشل في جلب الأبحاث", "error");
    } finally {
      setLoadingLearning(false);
    }
  }, []);

  // 📚 Fetch researches by main topic
  const fetchResearchesByTopic = useCallback(async (topicId) => {

    try {
      setLoadingLearning(true);
      const res = await axios.get(`/learningResearch/byMain/${topicId}`);
      setResearches(res.data);
     } catch (err) {
      console.error("Error fetching researches:", err);
    } finally {
      setLoadingLearning(false);
    }
  }, []);

  // 📖 Fetch lectures by research
  const fetchLecturesByResearch = useCallback(async (researchId) => {



    try {
      setLoadingLearning(true);
      const res = await axios.get(`/lecture/byResearch/${researchId}`);
      setLectures(res.data);
      setSelectedLecture(null);
      setLearningLessons([]);
    } catch (err) {
      console.error("Error fetching lectures:", err);
    } finally {
      setLoadingLearning(false);
    }
  }, []);

  // 📝 Fetch learning lessons by lecture
  const fetchLearningLessonsByLecture = useCallback(async (lectureId) => {
   
    try {
      setLoadingLearning(true);
      const res = await axios.get(
        `/learningLesson/byLecture/${lectureId}`
      );
      setLearningLessons(res.data.filter((l) => l._id !== currentLessonId));

    } catch (err) {
      console.error("Error fetching learning lessons:", err);
    } finally {
      setLoadingLearning(false);
    }
  }, []);

  // 🎙️ Fetch podcast main topics
  const fetchPodcastMainTopics = useCallback(async () => {

    try {
      setLoadingPodcast(true);
      const res = await axios.get("/podcastMainTopic");
      setPodcastMainTopics(res.data);
    } catch (err) {
      console.error("Error fetching podcast main topics:", err);
    } finally {
      setLoadingPodcast(false);
    }
  }, []);

  // 🎙️ Fetch podcast lessons by main topic
  const fetchPodcastLessonsByMainTopic = useCallback(async (mainId) => {
    try {
      setLoadingPodcast(true);
      const res = await axios.get(
        `/podcastLesson/byLecture/${mainId}`
      );
      setPodcastLessons(res.data.filter((l) => l._id !== currentLessonId));
    } catch (err) {
      console.error("Error fetching podcast lessons:", err);
    } finally {
      setLoadingPodcast(false);
    }
  }, []);

  // 💊 Fetch pharmacy main topics
  const fetchPharmacyMainTopics = useCallback(async () => {
    try {
      setLoadingPharmacy(true);
      const res = await axios.get("/VirtualPharmacyMainTopic");
      setPharmacyMainTopics(res.data);
    } catch (err) {
      console.error("Error fetching pharmacy main topics:", err);
    } finally {
      setLoadingPharmacy(false);
    }
  }, []);

  // 💊 Fetch pharmacy lessons by main topic
  const fetchPharmacyLessonsByMainTopic = useCallback(async (mainId) => {
    try {
      setLoadingPharmacy(true);
      const res = await axios.get(
        `/VirtualPharmacyLesson/byLecture/${mainId}`
      );
      setPharmacyLessons(res.data.filter((l) => l._id !== currentLessonId));
    } catch (err) {
      console.error("Error fetching pharmacy lessons:", err);
    } finally {
      setLoadingPharmacy(false);
    }
  }, []);

  // Add lesson to selected list
  const addLesson = (lessonId, lessonType, lessonName) => {
    // Check if already selected
    const exists = selectedLessons.some(
      (l) => l.lessonId === lessonId && l.lessonType === lessonType
    );

    if (!exists) {
      setSelectedLessons(prev => [
        ...prev,
        { lessonId, lessonType, name: lessonName }
      ]);
    }
  };

  // Remove lesson from selected list
  const removeLesson = (lessonId, lessonType) => {
    const lessonName = selectedLessons.find(
      l => l.lessonId === lessonId && l.lessonType === lessonType
    )?.name || "الدرس";

    Swal.fire({
      title: "تأكيد الحذف",
      text: `هل تريد حذف "${lessonName}" من الدروس المرتبطة؟`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "نعم، احذفه",
      cancelButtonText: "إلغاء"
    }).then((result) => {
      if (result.isConfirmed) {
        setSelectedLessons(prev =>
          prev.filter(
            l => !(l.lessonId === lessonId && l.lessonType === lessonType)
          )
        );
        Swal.fire({
          title: "تم الحذف",
          text: "تم حذف الدرس المرتبط بنجاح",
          icon: "success",
          timer: 2000
        });
      }
    });
  };

  // Save selected lessons
  const handleSave = () => {
    Swal.fire({
      title: "جاري الحفظ",
      text: "يتم حفظ الدروس المرتبطة...",
      icon: "info",
      allowOutsideClick: false,
      didOpen: async () => {
        Swal.showLoading();
        try {
          await onSave(selectedLessons);
          const message = selectedLessons.length === 0 
            ? "تم مسح جميع الدروس المرتبطة بنجاح"
            : "تم حفظ الدروس المرتبطة بنجاح";
          Swal.fire({
            title: "تم بنجاح",
            text: message,
            icon: "success",
            timer: 2000
          });
        } catch (error) {
          Swal.fire({
            title: "خطأ",
            text: error.message || "حدث خطأ أثناء حفظ الدروس",
            icon: "error"
          });
        }
      }
    });
    
    setSelectedLessons([]);
    setActiveTab("learning");
    setSelectedResearch(null);
    setSelectedLecture(null);
    setSelectedPodcastTopic(null);
    setSelectedPharmacyTopic(null);
    handleClose();
  };

  const handleClose = () => {
    // إعادة تعيين selectedLessons إلى relatedLessons الأصلية (بدون حفظ)
    setSelectedLessons(relatedLessons || []);
    setSelectedLearningTopic(null);
    setSelectedResearch(null);
    setSelectedLecture(null);
    setSelectedPodcastTopic(null);
    setSelectedPharmacyTopic(null);

    setResearches([]);
    setLectures([]);
    setLearningLessons([]);
    setPodcastLessons([]);
    setPharmacyLessons([]);

    onClose();
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gray-100 border-b p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">اختر الدروس المرتبطة</h2>
          <button
            onClick={handleClose}
            className="text-2xl font-bold text-gray-600 hover:text-gray-900"
          >
            ×
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Tabs for lesson types */}
          <div className="lg:col-span-1">
            <div className="space-y-2">
              <button
                onClick={() => {
                  setActiveTab("learning");
                  setSelectedPodcastTopic(null);
                  setSelectedPharmacyTopic(null);
                  setSelectedResearch(null);
                  setSelectedLecture(null);
                }}
                className={`w-full p-3 rounded text-left font-medium transition ${activeTab === "learning"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  }`}
              >
                📚 دروس التعلم
              </button>
              <button
                onClick={() => {
                  setActiveTab("podcast");
                  setSelectedLearningTopic(null);
                  setSelectedPharmacyTopic(null);
                }}
                className={`w-full p-3 rounded text-left font-medium transition ${activeTab === "podcast"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  }`}
              >
                🎙️ دروس البودكاست
              </button>
              <button
                onClick={() => {
                  setActiveTab("pharmacy");
                  setSelectedLearningTopic(null);
                  setSelectedPodcastTopic(null);
                }}
                className={`w-full p-3 rounded text-left font-medium transition ${activeTab === "pharmacy"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  }`}
              >
                💊 دروس الصيدلية
              </button>
            </div>
          </div>

          {/* Middle: Category selection */}

          <div className="lg:col-span-1">
            {activeTab === "learning" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اختر المحور الرئيسي
                </label>
                <select
                  value={selectedLearningTopic || ""}
                  onChange={(e) => {
                    setSelectedLearningTopic(e.target.value);

                    setSelectedResearch(null);
                    setSelectedLecture(null);

                    setResearches([]);
                    setLectures([]);
                    setLearningLessons([]);

                  }}
                  className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
                >
                  <option value="">-- اختر المحور الرئيسي --</option>
                  {learningMainTopics.map((topic) => (
                    <option key={topic._id} value={topic._id}>
                      {topic.name_ar || topic.name}
                    </option>
                  ))}
                </select>
                {selectedLearningTopic && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      اختر البحث
                    </label>
                    <select
                      value={selectedResearch || ""}
                      onChange={(e) => {
                        setSelectedResearch(e.target.value);


                      }}
                      className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
                    >
                      <option value="">-- اختر البحث --</option>
                      {researches.map((research) => (
                        <option key={research._id} value={research._id}>
                          {research.name_ar || research.name}
                        </option>
                      ))}
                    </select>

                    {selectedResearch && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          اختر المحاضرة
                        </label>
                        <select
                          value={selectedLecture || ""}
                          onChange={(e) => setSelectedLecture(e.target.value)}
                          className="w-full border border-gray-300 rounded px-3 py-2"
                        >
                          <option value="">-- اختر المحاضرة --</option>
                          {lectures.map((lecture) => (
                            <option key={lecture._id} value={lecture._id}>
                              {lecture.name_ar || lecture.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                  </div>
                )}



              </div>
            )}

            {activeTab === "podcast" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اختر المحور الرئيسي
                </label>
                <select
                  value={selectedPodcastTopic || ""}
                  onChange={(e) => setSelectedPodcastTopic(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                >
                  <option value="">-- اختر المحور --</option>
                  {podcastMainTopics.map((topic) => (
                    <option key={topic._id} value={topic._id}>
                      {topic.name_ar || topic.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {activeTab === "pharmacy" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اختر المحور الرئيسي
                </label>
                <select
                  value={selectedPharmacyTopic || ""}
                  onChange={(e) => setSelectedPharmacyTopic(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                >
                  <option value="">-- اختر المحور --</option>
                  {pharmacyMainTopics.map((topic) => (
                    <option key={topic._id} value={topic._id}>
                      {topic.name_ar || topic.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Right: Lessons selection */}
          <div className="lg:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              اختر الدروس
            </label>
            <div className="border border-gray-300 rounded p-3 max-h-64 overflow-y-auto bg-gray-50">
              {loadingLearning || loadingPodcast || loadingPharmacy ? (
                <p className="text-gray-500">جاري التحميل...</p>
              ) : (
                <>
                  {activeTab === "learning" &&
                    selectedResearch &&
                    selectedLearningTopic &&
                    selectedLecture &&
                    learningLessons.map((lesson) => (
                      <label key={lesson._id} className="flex items-center mb-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedLessons.some(
                            (l) =>
                              l.lessonId === lesson._id &&
                              l.lessonType === "learning"
                          )}
                          onChange={(e) => {
                            if (e.target.checked) {
                              addLesson(
                                lesson._id,
                                "learning",
                                lesson.name_ar || lesson.name
                              );
                            } else {
                              removeLesson(lesson._id, "learning");
                            }
                          }}
                          className="w-4 h-4"
                        />
                        <span className="mr-2 text-sm">
                          {lesson.name_ar || lesson.name}
                        </span>
                      </label>
                    ))}

                  {activeTab === "podcast" &&
                    selectedPodcastTopic &&
                    podcastLessons.map((lesson) => (
                      <label key={lesson._id} className="flex items-center mb-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedLessons.some(
                            (l) =>
                              l.lessonId === lesson._id &&
                              l.lessonType === "podcast"
                          )}
                          onChange={(e) => {
                            if (e.target.checked) {
                              addLesson(
                                lesson._id,
                                "podcast",
                                lesson.name_ar || lesson.name
                              );
                            } else {
                              removeLesson(lesson._id, "podcast");
                            }
                          }}
                          className="w-4 h-4"
                        />
                        <span className="mr-2 text-sm">
                          {lesson.name_ar || lesson.name}
                        </span>
                      </label>
                    ))}

                  {activeTab === "pharmacy" &&
                    selectedPharmacyTopic &&
                    pharmacyLessons.map((lesson) => (
                      <label key={lesson._id} className="flex items-center mb-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedLessons.some(
                            (l) =>
                              l.lessonId === lesson._id &&
                              l.lessonType === "pharmacy"
                          )}
                          onChange={(e) => {
                            if (e.target.checked) {
                              addLesson(
                                lesson._id,
                                "pharmacy",
                                lesson.name_ar || lesson.name
                              );
                            } else {
                              removeLesson(lesson._id, "pharmacy");
                            }
                          }}
                          className="w-4 h-4"
                        />
                        <span className="mr-2 text-sm">
                          {lesson.name_ar || lesson.name}
                        </span>
                      </label>
                    ))}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Selected Lessons Summary */}
        <div className="border-t border-gray-300 p-4 bg-gray-50">
          <h3 className="font-semibold mb-3 text-gray-800">الدروس المختارة</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {selectedLessons.map((lesson, idx) => (
              <div
                key={idx}
                className="bg-blue-100 border border-blue-300 rounded p-3 flex justify-between items-center"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{lesson.name}</p>
                  <p className="text-xs text-gray-600">
                    {lesson.lessonType === "learning"
                      ? "📚 تعلم"
                      : lesson.lessonType === "podcast"
                        ? "🎙️ بودكاست"
                        : "💊 صيدلية"}
                  </p>
                </div>
                <button
                  onClick={() => removeLesson(lesson.lessonId, lesson.lessonType)}
                  className="ml-2 text-red-600 hover:text-red-800 font-bold"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {selectedLessons.length === 0 && (
            <p className="text-gray-500 italic">لم تختر أي دروس بعد</p>
          )}
        </div>

        {/* Footer buttons */}
        <div className="border-t border-gray-300 p-4 bg-gray-100 flex gap-3 justify-end">
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
          >
            إلغاء
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            حفظ ({selectedLessons.length})
          </button>
        </div>
      </div>
    </div>
  );
}
