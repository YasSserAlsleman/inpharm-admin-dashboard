
import React, { useState } from "react";

// 🔹 مكون فرعي لعرض/تعديل محور واحد
export default function  TopicCard({ topic, handleDeleteMain, handleSaveEdit, navigate, handleImageChange }) {
  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState(topic.name);
  const [editDescription, setEditDescription] = useState(topic.description || "");
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
            <img src={`https://inpharm-admin-backend.onrender.com${topic.imageUrl}`} alt={topic.name} className="w-full h-40 object-cover" />
          )}
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2">{topic.name}</h3>
{topic.description ? (
  <p className="text-gray-600 text-sm mb-3">
    {topic.description.length > 100
      ? topic.description.slice(0, 100) + "…"
      : topic.description}
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
                ✏️ تعديل
              </button>
              <button
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                onClick={() => handleDeleteMain(topic._id)}
              >
                🗑 حذف
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
