
import React, { useEffect, useState } from "react";
import axios from "../../api/axiosClient";

import { useNavigate } from "react-router-dom";


export default function News() {

    const [news, setNews] = useState([]);
    const [newName, setNewName] = useState("");
    const [newDescription, setNewDescription] = useState("");



    const navigate = useNavigate();


    // 🔹 جلب المحاور الرئيسية من الخادم
    const fetchNews = async () => {
        try {
            const res = await axios.get("/news");
            setNews(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error("❌ Error loading news:", err);
        }
    };

    useEffect(() => {
        fetchNews();
    }, []);



    // ➕ إضافة محور جديد
    const handleAddNews = async () => {
        if (!newName.trim()) return;

        try {



            await axios.post("/news", { name: newName, description: newDescription });


            setNewName("");
            setNewDescription("");


            fetchNews();
        } catch (err) {
            console.error("❌ Error adding news :", err);
        }
    };
    // 🗑 حذف محور رئيسي
    const handleDeleteNews = async (id) => {
        if (!window.confirm("هل تريد حذف هذا القسم؟")) return;
        try {
            await axios.delete(`/news/${id}`);
            fetchNews();
        } catch (err) {
            console.error("❌ Error deleting news:", err);
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800"> الأخبار والتنبيهات</h2>

            <div className="bg-white p-6 rounded-lg shadow-md mb-6 max-w-lg mx-auto flex flex-col gap-4">

                <input
                    className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    placeholder="العنوان"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                />


                <textarea
                    className="border border-gray-300 rounded px-3 py-2 overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    placeholder="الوصف"
                    value={newDescription}
                    rows={1}
                    onChange={(e) => setNewDescription(e.target.value)}
                    onInput={(e) => {
                        e.target.style.height = "auto";
                        e.target.style.height = e.target.scrollHeight + "px";
                    }}
                />

                {/* زر الإضافة */}
                <button
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                    onClick={handleAddNews}
                >
                    ➕ إضافة قسم جديد
                </button>
            </div>


            {/* 🔹 عرض قائمة المحاور */}
            {news.length === 0 ? (
                <p className="text-gray-500">لا توجد اقسام للاخبار والتنبيهات بعد .</p>
            ) : (

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {news.map((item) => (
                        <div key={item._id} className="bg-white p-4 rounded-lg shadow">
                            <h3 className="font-semibold text-lg text-gray-800">{item.name}</h3>
                            <p className="text-gray-600 mt-2">{item.description}</p>
                            <div className="flex gap-2">

                                <button
                                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                    onClick={() => navigate(`/news/${item._id}/subNews`)}
                                >
                                    استكشاف
                                </button>
                                <button
                                    onClick={() => handleDeleteNews(item._id)}
                                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                >
                                    🗑 حذف
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

            )}

            
        </div>
    );


}
