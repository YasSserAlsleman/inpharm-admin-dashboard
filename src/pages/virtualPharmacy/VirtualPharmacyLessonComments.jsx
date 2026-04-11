import React, { useEffect, useState } from "react";
import axios from "../../api/axiosClient";
import { useParams } from "react-router-dom";

export default function VirtualPharmacyLessonComments() {
  const { lessonId } = useParams();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    fetchComments();
  }, [lessonId]);

  const fetchComments = async () => {
    const res = await axios.get(`/comment/byLesson/${lessonId}`);
    setComments(res.data);
  };

  const addComment = async () => {
    if (!newComment.trim()) return;
    await axios.post("/comment", {
      lessonId,
      userName: "Admin",
      userRole: "admin",
      text: newComment,
    });
    setNewComment("");
    fetchComments();
  };

  const addReply = async (commentId, replyText) => {
    if (!replyText.trim()) return;
    await axios.post(`/comment/${commentId}/reply`, {
      userName: "Admin",
      userRole: "admin",
      text: replyText,
    });
    fetchComments();
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">💬 التعليقات</h2>

      <div className="mb-4">
        <textarea
          className="border rounded w-full p-2"
          placeholder="أضف تعليقًا..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 mt-2 rounded"
          onClick={addComment}
        >
          ➕ نشر
        </button>
      </div>

      {comments.map((c) => (
        <div key={c._id} className="border-t pt-3 mt-3">
          <p>
            <strong>{c.userName}:</strong> {c.text}
          </p>
          <div className="ml-6 mt-2 space-y-1">
            {c.replies.map((r, i) => (
              <p key={i} className="text-gray-600 text-sm">
                ↳ <strong>{r.userName}:</strong> {r.text}
              </p>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
