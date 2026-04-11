
import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import { getLocalizedValue } from '../utils/getLocalizedValue';
import { BASE_FILE_URL } from '../config/config';  // أضف هذا في الأعلى

// 🔹 مكون فرعي لعرض/تعديل محور واحد
export default function  TopicCard({ topic, handleDeleteMain, handleSaveEdit, navigate, handleImageChange ,handleToggleHide}) {
  const { i18n, t } = useTranslation();
  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState(getLocalizedValue(topic, 'name', i18n.language));
  const [editDescription, setEditDescription] = useState(getLocalizedValue(topic, 'description', i18n.language) || "");
  const [editImageFile, setEditImageFile] = useState(null);
  const [editPreviewImage, setEditPreviewImage] = useState(topic.imageUrl || null);

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden">
      {editMode ? (
        <div className="p-4 flex flex-col gap-2">
          <input
            className="border rounded px-3 py-2"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
          />
          <textarea
            className="border rounded px-3 py-2 overflow-hidden"
            value={editDescription}
            rows={1}
            onChange={(e) => setEditDescription(e.target.value)}
            onInput={(e) => {
              e.target.style.height = "auto";
              e.target.style.height = e.target.scrollHeight + "px";
            }}
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              handleImageChange(e.target.files[0], setEditPreviewImage, setEditImageFile)
            }
          />
          {editPreviewImage && (
            <img src={editPreviewImage} alt="Preview" className="w-full h-32 object-cover rounded border" />
          )}
          <div className="flex gap-2 mt-2">
            <button
              className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
              onClick={() => {
                handleSaveEdit({
                  ...topic,
                  editName,
                  editDescription,
                  editImageFile,
                });
                setEditMode(false);
              }}
            >
              💾 حفظ
            </button>
            <button
              className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
              onClick={() => setEditMode(false)}
            >
              ❌ إلغاء
            </button>
          </div>
        </div>
      ) : (
        <>
          {topic.imageUrl && (
            <img src={`${BASE_FILE_URL}${topic.imageUrl}`} alt={topic.name} className="w-full h-40 object-cover" />
          )}
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2">{getLocalizedValue(topic, 'name', i18n.language)}</h3>
{getLocalizedValue(topic, 'description', i18n.language) ? (
  <p className="text-gray-600 text-sm mb-3">
    {getLocalizedValue(topic, 'description', i18n.language).length > 100
      ? getLocalizedValue(topic, 'description', i18n.language).slice(0, 100) + "…"
      : getLocalizedValue(topic, 'description', i18n.language)}
  </p>
) : (
  <p className="text-gray-400 text-sm mb-3">لا يوجد وصف متاح</p>
)}            <div className="flex gap-2">
              <button
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                onClick={() => navigate(`/podcast/${topic._id}/lesson`)}
              >
                📂 عرض الدروس  
              </button>
              <button
                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                onClick={() => setEditMode(true)}
              >
                ✏️ {t('lessons.edit')}
              </button>
              <button
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                onClick={() => handleDeleteMain(topic._id)}
              >
                🗑 {t('lessons.delete')}
              </button>
            </div>




            {/* 🔹 إضافة Toggle للإخفاء */}
            <div className="mt-4 flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">إخفاء من التطبيق الجوال</label>
              <input
                type="checkbox"
                checked={topic.isHidden || false}
                onChange={(e) => handleToggleHide(topic._id, e.target.checked)}
                className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
            </div>

            {/* إشارة بصرية لحالة الإخفاء */}
            {topic.isHidden && (
              <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                مخفي
              </div>
            )}


          </div>
        </>
      )}
    </div>
  );
}
