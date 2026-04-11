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
       setAbout(res.data);
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
      const formData = new FormData();
      formData.append("data", JSON.stringify(about));

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

      <PeopleSection
        label="الإدارة"
        data={about.management}
        onAdd={() =>
          setAbout({ ...about, management: [...about.management, { name: "", name_en: "", name_de: "", info: "", info_en: "", info_de: "", imageUrl: "" }] })
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
            teachingStaff: [...about.teachingStaff, { name: "", name_en: "", name_de: "", info: "", info_en: "", info_de: "", imageUrl: "" }],
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
            className="border p-2 rounded w-full"
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
