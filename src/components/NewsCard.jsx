
import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import { getLocalizedValue } from '../utils/getLocalizedValue';

export default function NewsCard({ item, handleDeleteNews, handleSaveEdit, navigate, handleToggleHide }) {
  const { i18n, t } = useTranslation();
  const [editMode, setEditMode] = useState(false);
  const [editNameAr, setEditNameAr] = useState(item.name_ar || "");
  const [editNameEn, setEditNameEn] = useState(item.name_en || "");
  const [editNameDe, setEditNameDe] = useState(item.name_de || "");
  const [editDescriptionAr, setEditDescriptionAr] = useState(item.description_ar || "");
  const [editDescriptionEn, setEditDescriptionEn] = useState(item.description_en || "");
  const [editDescriptionDe, setEditDescriptionDe] = useState(item.description_de || "");

  return (
    <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition relative">
      {editMode ? (
        <div className="flex flex-col gap-2">
          <input
            className="border rounded px-3 py-2"
            placeholder="الاسم (العربية)"
            value={editNameAr}
            onChange={(e) => setEditNameAr(e.target.value)}
          />
          <input
            className="border rounded px-3 py-2"
            placeholder="Name (English)"
            value={editNameEn}
            onChange={(e) => setEditNameEn(e.target.value)}
          />
          <input
            className="border rounded px-3 py-2"
            placeholder="Name (Deutsch)"
            value={editNameDe}
            onChange={(e) => setEditNameDe(e.target.value)}
          />
          <textarea
            className="border rounded px-3 py-2 overflow-hidden"
            placeholder="الوصف (العربية)"
            value={editDescriptionAr}
            rows={1}
            onChange={(e) => setEditDescriptionAr(e.target.value)}
          />
          <textarea
            className="border rounded px-3 py-2 overflow-hidden"
            placeholder="Description (English)"
            value={editDescriptionEn}
            rows={1}
            onChange={(e) => setEditDescriptionEn(e.target.value)}
          />
          <textarea
            className="border rounded px-3 py-2 overflow-hidden"
            placeholder="Beschreibung (Deutsch)"
            value={editDescriptionDe}
            rows={1}
            onChange={(e) => setEditDescriptionDe(e.target.value)}
          />
          <div className="flex gap-2 mt-2">
            <button
              className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
              onClick={() => {
                handleSaveEdit({
                  ...item,
                  editNameAr,
                  editNameEn,
                  editNameDe,
                  editDescriptionAr,
                  editDescriptionEn,
                  editDescriptionDe,
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
          <h3 className="font-semibold text-lg text-gray-800">{getLocalizedValue(item, 'name', i18n.language)}</h3>
          <p className="text-gray-600 mt-2 mb-4">{getLocalizedValue(item, 'description', i18n.language)}</p>
          <div className="flex gap-2">
            <button
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
              onClick={() => navigate(`/news/${item._id}/subNews`)}
            >
              استكشاف
            </button>
            <button
              className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm"
              onClick={() => setEditMode(true)}
            >
              ✏️ تعديل
            </button>
            <button
              onClick={() => handleDeleteNews(item._id)}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
            >
              🗑 حذف
            </button>
          </div>

          {/* 🔹 إضافة Toggle للإخفاء */}
          <div className="mt-4 flex items-center justify-between border-t pt-2">
            <label className="text-sm font-medium text-gray-700">إخفاء من التطبيق</label>
            <input
              type="checkbox"
              checked={item.isHidden || false}
              onChange={(e) => handleToggleHide(item._id, e.target.checked)}
              className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
          </div>

          {/* إشارة بصرية لحالة الإخفاء */}
          {item.isHidden && (
            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded shadow-sm">
              مخفي
            </div>
          )}
        </>
      )}
    </div>
  );
}
