
import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import { getLocalizedValue } from '../utils/getLocalizedValue';
import { BASE_FILE_URL } from '../config/config';

export default function SubNewsCard({ item, handleDelete, handleSaveEdit, handleToggleHide }) {
  const { i18n, t } = useTranslation();
  const [editMode, setEditMode] = useState(false);
  
  const [editTitleAr, setEditTitleAr] = useState(item.title_ar || "");
  const [editTitleEn, setEditTitleEn] = useState(item.title_en || "");
  const [editTitleDe, setEditTitleDe] = useState(item.title_de || "");
  const [editDescriptionAr, setEditDescriptionAr] = useState(item.description_ar || "");
  const [editDescriptionEn, setEditDescriptionEn] = useState(item.description_en || "");
  const [editDescriptionDe, setEditDescriptionDe] = useState(item.description_de || "");
  
  const [editImageFile, setEditImageFile] = useState(null);
  const [editAudioArFile, setEditAudioArFile] = useState(null);
  const [editAudioEnFile, setEditAudioEnFile] = useState(null);
  const [editAudioDeFile, setEditAudioDeFile] = useState(null);

  const getAudioUrl = (url) => {
    if (!url) return "";
    return url.startsWith("http") ? url : `${BASE_FILE_URL}/uploads/subnews/${url}`;
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition relative">
      {editMode ? (
        <div className="flex flex-col gap-3">
          <input
            className="border rounded px-3 py-2 text-sm"
            placeholder="العنوان (العربية)"
            value={editTitleAr}
            onChange={(e) => setEditTitleAr(e.target.value)}
          />
          <input
            className="border rounded px-3 py-2 text-sm"
            placeholder="Title (English)"
            value={editTitleEn}
            onChange={(e) => setEditTitleEn(e.target.value)}
          />
          <input
            className="border rounded px-3 py-2 text-sm"
            placeholder="Titel (Deutsch)"
            value={editTitleDe}
            onChange={(e) => setEditTitleDe(e.target.value)}
          />
          <textarea
            className="border rounded px-3 py-2 text-sm"
            placeholder="الوصف (العربية)"
            value={editDescriptionAr}
            rows={2}
            onChange={(e) => setEditDescriptionAr(e.target.value)}
          />
          <textarea
            className="border rounded px-3 py-2 text-sm"
            placeholder="Description (English)"
            value={editDescriptionEn}
            rows={2}
            onChange={(e) => setEditDescriptionEn(e.target.value)}
          />
          <textarea
            className="border rounded px-3 py-2 text-sm"
            placeholder="Beschreibung (Deutsch)"
            value={editDescriptionDe}
            rows={2}
            onChange={(e) => setEditDescriptionDe(e.target.value)}
          />
          
          <div className="border-t pt-2">
            <label className="block text-xs text-gray-500 mb-1">🖼️ الصورة</label>
            <input type="file" accept="image/*" className="text-xs" onChange={(e) => setEditImageFile(e.target.files[0])} />
          </div>

          <div className="border-t pt-2 grid grid-cols-1 gap-2">
            <div>
              <label className="block text-xs text-gray-500 mb-1">🎙️ الصوت (العربية)</label>
              <input type="file" accept="audio/*" className="text-xs" onChange={(e) => setEditAudioArFile(e.target.files[0])} />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">🎙️ الصوت (English)</label>
              <input type="file" accept="audio/*" className="text-xs" onChange={(e) => setEditAudioEnFile(e.target.files[0])} />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">🎙️ الصوت (Deutsch)</label>
              <input type="file" accept="audio/*" className="text-xs" onChange={(e) => setEditAudioDeFile(e.target.files[0])} />
            </div>
          </div>

          <div className="flex gap-2 mt-2">
            <button
              className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600 text-sm"
              onClick={() => {
                handleSaveEdit({
                  ...item,
                  editTitleAr,
                  editTitleEn,
                  editTitleDe,
                  editDescriptionAr,
                  editDescriptionEn,
                  editDescriptionDe,
                  editImageFile,
                  editAudioArFile,
                  editAudioEnFile,
                  editAudioDeFile,
                });
                setEditMode(false);
              }}
            >
              💾 حفظ
            </button>
            <button
              className="bg-gray-400 text-white px-4 py-1 rounded hover:bg-gray-500 text-sm"
              onClick={() => setEditMode(false)}
            >
              ❌ إلغاء
            </button>
          </div>
        </div>
      ) : (
        <>
          <h3 className="font-semibold text-lg">{getLocalizedValue(item, 'title', i18n.language)}</h3>
          <p className="text-gray-600 text-sm mt-1 mb-3">
            {getLocalizedValue(item, 'description', i18n.language)}
          </p>

          {item.image && (
            <img
              src={`${BASE_FILE_URL}/uploads/subnews/${item.image}`}
              alt=""
              className="w-full h-32 object-cover rounded mb-3"
            />
          )}

          {(item.audio || item.audio_en || item.audio_de) && (
            <audio controls className="mb-3 w-full h-8">
              <source src={getAudioUrl(getLocalizedValue(item, 'audio', i18n.language))} />
              المتصفح لا يدعم تشغيل الصوت.
            </audio>
          )}

          <div className="flex gap-2 border-t pt-3">
            <button
              className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm"
              onClick={() => setEditMode(true)}
            >
              ✏️ تعديل
            </button>
            <button
              onClick={() => handleDelete(item._id)}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
            >
              🗑 حذف
            </button>
          </div>

          <div className="mt-4 flex items-center justify-between border-t pt-2">
            <label className="text-sm font-medium text-gray-700">إخفاء</label>
            <input
              type="checkbox"
              checked={item.isHidden || false}
              onChange={(e) => handleToggleHide(item._id, e.target.checked)}
              className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
          </div>

          {item.isHidden && (
            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
              مخفي
            </div>
          )}
        </>
      )}
    </div>
  );
}
