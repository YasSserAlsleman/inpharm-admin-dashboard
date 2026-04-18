import React, { useEffect, useState } from "react";
import axios from "../../api/axiosClient";
import { BASE_FILE_URL } from '../../config/config';  // أضف هذا في الأعلى

export default function AboutPage() {
  const [about, setAbout] = useState({
    platformIntro: "",
    platformIntro_en: "",
    platformIntro_de: "",
    goals: "",
    goals_en: "",
    goals_de: "",
    visionMission: "",
    visionMission_en: "",
    visionMission_de: "",
    offerings: "",
    offerings_en: "",
    offerings_de: "",
    targetAudience: "",
    targetAudience_en: "",
    targetAudience_de: "",
    policies: "",
    policies_en: "",
    policies_de: "",
    faq: [],
    management: [],
    teachingStaff: [],
    contact: { facebook: "", youtube: "", whatsapp: "", email: "", telegram: "" },
  });

  const contactFields = ['facebook', 'youtube', 'whatsapp', 'email', 'telegram'];

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAbout();
  }, []);

  const fetchAbout = async () => {
    try {
      const res = await axios.get("/about");
      const data = res.data;
      // Split academicPath into arrays for each language
      data.management = data.management.map(m => ({
        ...m,
        academicPath: m.academicPath ? m.academicPath.split('\n').filter(line => line.trim()) : [],
        academicPath_en: m.academicPath_en ? m.academicPath_en.split('\n').filter(line => line.trim()) : [],
        academicPath_de: m.academicPath_de ? m.academicPath_de.split('\n').filter(line => line.trim()) : [],
      }));
      data.teachingStaff = data.teachingStaff.map(t => ({
        ...t,
        academicPath: t.academicPath ? t.academicPath.split('\n').filter(line => line.trim()) : [],
        academicPath_en: t.academicPath_en ? t.academicPath_en.split('\n').filter(line => line.trim()) : [],
        academicPath_de: t.academicPath_de ? t.academicPath_de.split('\n').filter(line => line.trim()) : [],
      }));
      console.log("✅ بيانات 'من نحن' تم جلبها:", data);
      setAbout(data);
    } catch (err) {
      console.error("❌ خطأ أثناء التحميل:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (key, index, file) => {
    const updated = [...about[key]];
    updated[index].file = file;
    setAbout({ ...about, [key]: updated });
  };

  const handleSave = async () => {
    try {
      const dataToSave = { ...about };
      // Join academicPath arrays to strings for each language
      dataToSave.management = dataToSave.management.map(m => ({
        ...m,
        academicPath: m.academicPath.join('\n'),
        academicPath_en: m.academicPath_en.join('\n'),
        academicPath_de: m.academicPath_de.join('\n'),
      }));
      dataToSave.teachingStaff = dataToSave.teachingStaff.map(t => ({
        ...t,
        academicPath: t.academicPath.join('\n'),
        academicPath_en: t.academicPath_en.join('\n'),
        academicPath_de: t.academicPath_de.join('\n'),
      }));

      const formData = new FormData();
      formData.append("data", JSON.stringify(dataToSave));

      about.management.forEach((m) => {
        if (m.file) formData.append("managementImages", m.file);
      });
      about.teachingStaff.forEach((t) => {
        if (t.file) formData.append("teachingImages", t.file);
      });

      await axios.post("/about", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("✅ تم حفظ البيانات بنجاح!");
      fetchAbout();
    } catch (err) {
      console.error("❌ فشل في الحفظ:", err);
    }
  };

  if (loading) return <p>⏳ تحميل...</p>;

  return (
    <div className="p-6 bg-white rounded-lg shadow-md space-y-6">
      <h2 className="text-3xl font-bold mb-4 text-center text-primary">من نحن</h2>

      <SectionInput
        label="تعريف المنصة (العربية)"
        value={about.platformIntro}
        onChange={(v) => setAbout({ ...about, platformIntro: v })}
      />
      <SectionInput
        label="About the platform (English)"
        value={about.platformIntro_en}
        onChange={(v) => setAbout({ ...about, platformIntro_en: v })}
      />
      <SectionInput
        label="Über die Plattform (Deutsch)"
        value={about.platformIntro_de}
        onChange={(v) => setAbout({ ...about, platformIntro_de: v })}
      />

      <SectionInput
        label="أهداف المنصة (العربية)"
        value={about.goals}
        onChange={(v) => setAbout({ ...about, goals: v })}
      />
      <SectionInput
        label="Platform goals (English)"
        value={about.goals_en}
        onChange={(v) => setAbout({ ...about, goals_en: v })}
      />
      <SectionInput
        label="Ziele der Plattform (Deutsch)"
        value={about.goals_de}
        onChange={(v) => setAbout({ ...about, goals_de: v })}
      />

      <SectionInput
        label="الرؤية والرسالة (العربية)"
        value={about.visionMission}
        onChange={(v) => setAbout({ ...about, visionMission: v })}
      />
      <SectionInput
        label="Vision & Mission (English)"
        value={about.visionMission_en}
        onChange={(v) => setAbout({ ...about, visionMission_en: v })}
      />
      <SectionInput
        label="Vision & Mission (Deutsch)"
        value={about.visionMission_de}
        onChange={(v) => setAbout({ ...about, visionMission_de: v })}
      />

      <SectionInput
        label="ما نقدمه (العربية)"
        value={about.offerings}
        onChange={(v) => setAbout({ ...about, offerings: v })}
      />
      <SectionInput
        label="What We Offer (English)"
        value={about.offerings_en}
        onChange={(v) => setAbout({ ...about, offerings_en: v })}
      />
      <SectionInput
        label="Was wir bieten (Deutsch)"
        value={about.offerings_de}
        onChange={(v) => setAbout({ ...about, offerings_de: v })}
      />

      <SectionInput
        label="الجمهور المستهدف (العربية)"
        value={about.targetAudience}
        onChange={(v) => setAbout({ ...about, targetAudience: v })}
      />
      <SectionInput
        label="Target Audience (English)"
        value={about.targetAudience_en}
        onChange={(v) => setAbout({ ...about, targetAudience_en: v })}
      />
      <SectionInput
        label="Zielgruppe (Deutsch)"
        value={about.targetAudience_de}
        onChange={(v) => setAbout({ ...about, targetAudience_de: v })}
      />

      <SectionInput
        label="سياسات المنصة (العربية)"
        value={about.policies}
        onChange={(v) => setAbout({ ...about, policies: v })}
      />
      <SectionInput
        label="Platform Policies (English)"
        value={about.policies_en}
        onChange={(v) => setAbout({ ...about, policies_en: v })}
      />
      <SectionInput
        label="Plattformrichtlinien (Deutsch)"
        value={about.policies_de}
        onChange={(v) => setAbout({ ...about, policies_de: v })}
      />

      <div>
        <h3 className="font-semibold mb-2 text-lg text-gray-700">❓ الأسئلة الشائعة</h3>
        {about.faq.map((item, index) => (
          <div key={index} className="border p-3 mb-3 rounded relative bg-gray-50">
            <input
              type="text"
              value={item.question}
              onChange={(e) => {
                const updatedFaq = [...about.faq];
                updatedFaq[index].question = e.target.value;
                setAbout({ ...about, faq: updatedFaq });
              }}
              placeholder="السؤال (عربية)"
              className="border p-2 rounded w-full mb-2"
            />
            <input
              type="text"
              value={item.question_en || ""}
              onChange={(e) => {
                const updatedFaq = [...about.faq];
                updatedFaq[index].question_en = e.target.value;
                setAbout({ ...about, faq: updatedFaq });
              }}
              placeholder="Question (English)"
              className="border p-2 rounded w-full mb-2"
            />
            <input
              type="text"
              value={item.question_de || ""}
              onChange={(e) => {
                const updatedFaq = [...about.faq];
                updatedFaq[index].question_de = e.target.value;
                setAbout({ ...about, faq: updatedFaq });
              }}
              placeholder="Frage (Deutsch)"
              className="border p-2 rounded w-full mb-2"
            />
            <textarea
              value={item.answer}
              onChange={(e) => {
                const updatedFaq = [...about.faq];
                updatedFaq[index].answer = e.target.value;
                setAbout({ ...about, faq: updatedFaq });
              }}
              placeholder="الجواب (عربية)"
              className="border p-2 rounded w-full mb-2"
            />
            <textarea
              value={item.answer_en || ""}
              onChange={(e) => {
                const updatedFaq = [...about.faq];
                updatedFaq[index].answer_en = e.target.value;
                setAbout({ ...about, faq: updatedFaq });
              }}
              placeholder="Answer (English)"
              className="border p-2 rounded w-full mb-2"
            />
            <textarea
              value={item.answer_de || ""}
              onChange={(e) => {
                const updatedFaq = [...about.faq];
                updatedFaq[index].answer_de = e.target.value;
                setAbout({ ...about, faq: updatedFaq });
              }}
              placeholder="Antwort (Deutsch)"
              className="border p-2 rounded w-full mb-2"
            />
            <button
              onClick={() =>
                setAbout({
                  ...about,
                  faq: about.faq.filter((_, idx) => idx !== index),
                })
              }
              className="absolute top-2 right-2 text-red-600"
            >
              ❌
            </button>
          </div>
        ))}
        <button
          onClick={() =>
            setAbout({
              ...about,
              faq: [...about.faq, { question: "", question_en: "", question_de: "", answer: "", answer_en: "", answer_de: "" }],
            })
          }
          className="bg-green-600 text-white px-4 py-1 rounded"
        >
          ➕ إضافة سؤال جديد
        </button>
      </div>

      <PeopleSection
        label="الإدارة"
        data={about.management}
        onAdd={() =>
          setAbout({ ...about, management: [...about.management, { name: "", name_en: "", name_de: "", info: "", info_en: "", info_de: "", role: "", role_en: "", role_de: "", academicPath: [], academicPath_en: [], academicPath_de: [], imageUrl: "", whatsapp: "", email_contact: "", facebook: "", telegram: "" }] })
        }
        onChange={(i, f, v) => {
          const updated = [...about.management];
          updated[i][f] = v;
          setAbout({ ...about, management: updated });
        }}
        onFileChange={(i, f) => handleFileChange("management", i, f)}
        onDelete={(i) =>
          setAbout({
            ...about,
            management: about.management.filter((_, idx) => idx !== i),
          })
        }
      />

      <PeopleSection
        label="طاقم التدريس"
        data={about.teachingStaff}
        onAdd={() =>
          setAbout({
            ...about,
            teachingStaff: [...about.teachingStaff, { name: "", name_en: "", name_de: "", info: "", info_en: "", info_de: "", role: "", role_en: "", role_de: "", academicPath: [], academicPath_en: [], academicPath_de: [], imageUrl: "", whatsapp: "", email_contact: "", facebook: "", telegram: "" }],
          })
        }
        onChange={(i, f, v) => {
          const updated = [...about.teachingStaff];
          updated[i][f] = v;
          setAbout({ ...about, teachingStaff: updated });
        }}
        onFileChange={(i, f) => handleFileChange("teachingStaff", i, f)}
        onDelete={(i) =>
          setAbout({
            ...about,
            teachingStaff: about.teachingStaff.filter((_, idx) => idx !== i),
          })
        }
      />

 {/* تواصل معنا */}
    <div>
      <h3 className="font-semibold mb-2 text-lg text-gray-700">📞 تواصل معنا</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {contactFields.map((key) => (
          <input
            key={key}
            type="text"
            placeholder={`رابط ${key}`}
            value={about.contact[key] || ''}  // استخدم '' إذا كانت القيمة غير موجودة
            onChange={(e) =>
              setAbout({
                ...about,
                contact: { ...about.contact, [key]: e.target.value },
              })
            }
            className="border p-2 rounded"
          />
        ))}
      </div>
    </div>


      <div className="text-center">
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition"
        >
          💾 حفظ التعديلات
        </button>
      </div>
    </div>
  );
}

function SectionInput({ label, value, onChange }) {
  return (
    <div>
      <h3 className="font-semibold mb-2 text-lg text-gray-700">{label}</h3>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border p-3 rounded-lg h-28"
      />
    </div>
  );
}

function PeopleSection({ label, data, onAdd, onChange, onDelete, onFileChange }) {
  return (
    <div>
      <h3 className="font-semibold mb-2 text-lg text-gray-700">{label}</h3>
      {data.map((p, i) => (
        <div key={i} className="border p-3 mb-3 rounded relative bg-gray-50">
          {p.imageUrl && (
            <img
              src={`${BASE_FILE_URL}${p.imageUrl}`}
              alt="preview"
              className="w-20 h-20 object-cover rounded mb-2"
            />
          )}
          <input
            type="file"
            onChange={(e) => onFileChange(i, e.target.files[0])}
            className="mb-2"
          />
          <input
            type="text"
            value={p.name}
            onChange={(e) => onChange(i, "name", e.target.value)}
            placeholder="الاسم (عربي)"
            className="border p-2 rounded w-full mb-2"
          />
          <input
            type="text"
            value={p.name_en || ""}
            onChange={(e) => onChange(i, "name_en", e.target.value)}
            placeholder="Name (English)"
            className="border p-2 rounded w-full mb-2"
          />
          <input
            type="text"
            value={p.name_de || ""}
            onChange={(e) => onChange(i, "name_de", e.target.value)}
            placeholder="Name (Deutsch)"
            className="border p-2 rounded w-full mb-2"
          />
          <textarea
            value={p.info}
            onChange={(e) => onChange(i, "info", e.target.value)}
            placeholder="معلومات (عربية)"
            className="border p-2 rounded w-full mb-2"
          />
          <textarea
            value={p.info_en || ""}
            onChange={(e) => onChange(i, "info_en", e.target.value)}
            placeholder="Info (English)"
            className="border p-2 rounded w-full mb-2"
          />
          <textarea
            value={p.info_de || ""}
            onChange={(e) => onChange(i, "info_de", e.target.value)}
            placeholder="Info (Deutsch)"
            className="border p-2 rounded w-full mb-2"
          />
          <input
            type="text"
            value={p.role || ""}
            onChange={(e) => onChange(i, "role", e.target.value)}
            placeholder="الدور الوظيفي (عربي)"
            className="border p-2 rounded w-full mb-2"
          />
          <input
            type="text"
            value={p.role_en || ""}
            onChange={(e) => onChange(i, "role_en", e.target.value)}
            placeholder="Role (English)"
            className="border p-2 rounded w-full mb-2"
          />
          <input
            type="text"
            value={p.role_de || ""}
            onChange={(e) => onChange(i, "role_de", e.target.value)}
            placeholder="Rolle (Deutsch)"
            className="border p-2 rounded w-full mb-2"
          />
          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">المسار الأكاديمي</label>
            {p.academicPath.map((point, idx) => (
              <div key={idx} className="border p-3 mb-2 rounded bg-white">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
                  <input
                    type="text"
                    value={point}
                    onChange={(e) => {
                      const updated = [...p.academicPath];
                      updated[idx] = e.target.value;
                      onChange(i, "academicPath", updated);
                    }}
                    placeholder={`البند ${idx + 1} (عربي)`}
                    className="border p-2 rounded"
                  />
                  <input
                    type="text"
                    value={(p.academicPath_en || [])[idx] || ""}
                    onChange={(e) => {
                      const updated = [...(p.academicPath_en || [])];
                      updated[idx] = e.target.value;
                      onChange(i, "academicPath_en", updated);
                    }}
                    placeholder={`Point ${idx + 1} (English)`}
                    className="border p-2 rounded"
                  />
                  <input
                    type="text"
                    value={(p.academicPath_de || [])[idx] || ""}
                    onChange={(e) => {
                      const updated = [...(p.academicPath_de || [])];
                      updated[idx] = e.target.value;
                      onChange(i, "academicPath_de", updated);
                    }}
                    placeholder={`Punkt ${idx + 1} (Deutsch)`}
                    className="border p-2 rounded"
                  />
                </div>
                <button
                  onClick={() => {
                    const updatedAr = p.academicPath.filter((_, index) => index !== idx);
                    const updatedEn = (p.academicPath_en || []).filter((_, index) => index !== idx);
                    const updatedDe = (p.academicPath_de || []).filter((_, index) => index !== idx);
                    onChange(i, "academicPath", updatedAr);
                    onChange(i, "academicPath_en", updatedEn);
                    onChange(i, "academicPath_de", updatedDe);
                  }}
                  className="text-red-600 text-sm"
                >
                  ❌ حذف البند
                </button>
              </div>
            ))}
            <button
              onClick={() => {
                const updatedAr = [...p.academicPath, ""];
                const updatedEn = [...(p.academicPath_en || []), ""];
                const updatedDe = [...(p.academicPath_de || []), ""];
                onChange(i, "academicPath", updatedAr);
                onChange(i, "academicPath_en", updatedEn);
                onChange(i, "academicPath_de", updatedDe);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded text-sm"
            >
              ➕ إضافة بند جديد
            </button>
          </div>
          
          <hr className="my-4" />
          <h4 className="font-semibold mb-3 text-gray-700">خيارات التواصل</h4>
          
          <input
            type="text"
            value={p.whatsapp || ""}
            onChange={(e) => onChange(i, "whatsapp", e.target.value)}
            placeholder="WhatsApp (رقم الهاتف)"
            className="border p-2 rounded w-full mb-2"
          />
          
          <input
            type="email"
            value={p.email_contact || ""}
            onChange={(e) => onChange(i, "email_contact", e.target.value)}
            placeholder="البريد الإلكتروني"
            className="border p-2 rounded w-full mb-2"
          />
          
          <input
            type="text"
            value={p.facebook || ""}
            onChange={(e) => onChange(i, "facebook", e.target.value)}
            placeholder="Facebook URL"
            className="border p-2 rounded w-full mb-2"
          />
          
          <input
            type="text"
            value={p.telegram || ""}
            onChange={(e) => onChange(i, "telegram", e.target.value)}
            placeholder="Telegram (اسم المستخدم أو ID)"
            className="border p-2 rounded w-full mb-2"
          />

          <button
            onClick={() => onDelete(i)}
            className="absolute top-2 right-2 text-red-600"
          >
            ❌
          </button>
        </div>
      ))}
      <button
        onClick={onAdd}
        className="bg-green-600 text-white px-4 py-1 rounded"
      >
        ➕ إضافة {label === "الإدارة" ? "مدير" : "مدرس"}
      </button>
    </div>
  );
}
