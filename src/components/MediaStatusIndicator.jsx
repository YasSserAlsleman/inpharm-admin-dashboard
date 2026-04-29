import React from "react";
import { useTranslation } from "react-i18next";

/**
 * 🎬 مكون عرض حالة الفيديو والـ PDF
 * يعرض حالة الملفات المتاحة لكل لغة
 * 🟢 متوفر | 🔴 ناقص
 */
export default function MediaStatusIndicator({ lesson, type = "learning", compact = false }) {
  const { t } = useTranslation();

  // تحديد نوع الملف حسب نوع الدرس
  const getMediaFields = (langCode) => {
    const baseCode = langCode === "ar" ? "" : `_${langCode}`;
    
    if (type === "podcast") {
      // البودكاست: صوت + PDF
      return {
        media: `audio${baseCode}`,
        pdf: `pdfFile${baseCode}`,
        mediaLabel: "🎙️ صوت",
        label: "بودكاست"
      };
    } else if (type === "pharmacy") {
      // الصيدلية: فيديو + PDF
      return {
        media: `videoUrl${baseCode}`,
        pdf: `pdfFile${baseCode}`,
        mediaLabel: "🎥 فيديو",
        label: "صيدلية"
      };
    } else {
      // التعلم: فيديو + PDF (افتراضي)
      return {
        media: `videoUrl${baseCode}`,
        pdf: `pdfFile${baseCode}`,
        mediaLabel: "🎥 فيديو",
        label: "تعلم"
      };
    }
  };

  // اللغات المتاحة
  const languages = [
    { code: "ar", label: "العربية" },
    { code: "en", label: "English" },
    { code: "de", label: "Deutsch" }
  ];

  // حساب الحالة
  const getMediaStatus = (langCode) => {
    const fields = getMediaFields(langCode);
    const hasMedia = !!lesson?.[fields.media];
    const hasPdf = !!lesson?.[fields.pdf];
    return { hasMedia, hasPdf, fields };
  };

  if (compact) {
    // نسخة مختصرة - رموز فقط في الجدول
    return (
      <div className="flex gap-2 items-center justify-start">
        {languages.map((lang) => {
          const { hasMedia, hasPdf } = getMediaStatus(lang.code);
          const hasContent = hasMedia || hasPdf;
          
          return (
            <div
              key={lang.code}
              className="flex flex-col items-center gap-0.5"
              title={`${lang.label}: ${
                hasMedia ? "✓ ملف" : "✗ بدون ملف"
              } | ${hasPdf ? "✓ PDF" : "✗ بدون PDF"}`}
            >
              <span className="text-xs font-bold">{lang.code.toUpperCase()}</span>
              <span className={`text-lg ${hasContent ? "✅" : "⚠️"}`}>
                {hasMedia ? "🎬" : "❌"}
              </span>
            </div>
          );
        })}
      </div>
    );
  }

  // نسخة مفصلة - صندوق كامل
  return (
    <div className="bg-purple-50 p-3 rounded border border-purple-200 my-3">
      <h4 className="font-bold text-purple-900 mb-2">
        🎬 {type === "podcast" ? "🎙️ حالة الصوتيات" : "🎥 حالة الملفات"}
      </h4>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        {languages.map((lang) => {
          const { hasMedia, hasPdf, fields } = getMediaStatus(lang.code);
          const hasContent = hasMedia || hasPdf;
          
          return (
            <div
              key={lang.code}
              className={`p-2 rounded border-l-4 ${
                hasContent
                  ? "bg-green-50 border-green-500"
                  : "bg-red-50 border-red-500"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm">{lang.label}</span>
                <span className="text-lg">
                  {hasContent ? "✅" : "⚠️"}
                </span>
              </div>
              
              <div className="text-xs text-gray-600 mt-1 space-y-1">
                <div className={hasMedia ? "text-green-700" : "text-red-700"}>
                  • {hasMedia ? "✓" : "✗"} {fields.mediaLabel}
                </div>
                <div className={hasPdf ? "text-green-700" : "text-red-700"}>
                  • {hasPdf ? "✓" : "✗"} 📄 PDF
                </div>
              </div>
            </div>
          );
        })}
      </div>

     
    </div>
  );
}
