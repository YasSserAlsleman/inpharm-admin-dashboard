import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "../api/axiosClient";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    document.title = "InPharm";
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!token) {
      setError("رابط إعادة التعيين غير صالح أو منتهي.");
      return;
    }
    if (password.length < 6) {
      setError("يجب أن تتكون كلمة المرور من 6 أحرف على الأقل.");
      return;
    }
    if (password !== confirmPassword) {
      setError("كلمتا المرور غير متطابقتين.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("/auth/reset-password", { token, password });
      setMessage(response.data.message || "تم تحديث كلمة المرور بنجاح.");
      setCompleted(true);
      setPassword("");
      setConfirmPassword("");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "تعذر تحديث كلمة المرور. حاول استخدام رابط جديد.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#e8f7ea] p-4" dir="rtl">
      <section className="w-full max-w-md rounded-2xl border border-[#299633]/20 bg-white p-8 shadow-xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-[#299633] text-2xl font-bold text-white">i</div>
          <h1 className="text-2xl font-bold text-[#222]">تغيير كلمة المرور</h1>
          <p className="mt-2 text-sm text-[#6b6b6b]">ادخل كلمة المرور الجديدة لحسابك في منصة InPharm</p>
        </div>

        {message && <div className="mb-4 rounded-lg bg-[#e8f7ea] p-3 text-sm text-[#299633]">{message}</div>}
        {error && <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}

        {!completed && (
          <form onSubmit={handleSubmit} className="space-y-5">
            <label className="block text-sm font-medium text-[#222]">
              كلمة المرور الجديدة
              <input
                type="password"
                minLength={6}
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-3 outline-none focus:border-[#299633] focus:ring-2 focus:ring-[#e8f7ea]"
              />
            </label>
            <label className="block text-sm font-medium text-[#222]">
              تأكيد كلمة المرور
              <input
                type="password"
                minLength={6}
                required
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-3 outline-none focus:border-[#299633] focus:ring-2 focus:ring-[#e8f7ea]"
              />
            </label>
            <button
              type="submit"
              disabled={loading || !token}
              className="w-full rounded-lg bg-[#299633] px-4 py-3 font-semibold text-white transition hover:bg-[#227a2a] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "جارٍ الحفظ..." : "حفظ كلمة المرور"}
            </button>
          </form>
        )}
      </section>
    </main>
  );
}
