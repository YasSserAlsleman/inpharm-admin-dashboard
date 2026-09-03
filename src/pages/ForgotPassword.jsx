import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "../api/axiosClient";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await axios.post("/auth/forgot-password", {
        email: email.trim().toLowerCase()
      });
      setMessage(response.data.message || "تم إرسال رابط إعادة التعيين إلى بريدك الإلكتروني.");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "تعذر إرسال طلب إعادة التعيين.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4" dir="rtl">
      <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl border border-slate-200">
        <h1 className="text-2xl font-bold text-slate-900 text-center">إعادة تعيين كلمة المرور</h1>
        <p className="mt-2 mb-6 text-sm text-slate-500 text-center">أدخل بريدك الإلكتروني لإرسال رابط آمن</p>
        {message && <div className="mb-4 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">{message}</div>}
        {error && <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block text-sm font-medium text-slate-700">
            البريد الإلكتروني
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-3 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-emerald-600 px-4 py-3 font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            {loading ? "جارٍ الإرسال..." : "إرسال الرابط"}
          </button>
        </form>
        <Link to="/login" className="mt-5 block text-center text-sm text-emerald-700">العودة لتسجيل الدخول</Link>
      </section>
    </main>
  );
}
