import React from "react";
import { useTranslation } from "react-i18next";

/**
 * ✨ مكون عرض اللغات المتاحة والناقصة
 * يعرض رموز ملونة لكل لغة:
 * 🟢 متوفرة - لديها محتوى
 * 🔴 ناقصة - بحاجة لإضافة
 */
export default function LanguageIndicator({ lesson, compact = false }) {
  const { t } = useTranslation();

  // تحديد اللغات المتاحة
  const languages = [
    {
      code: "ar",
      label: "العربية",
      hasName: !!lesson?.name_ar||!!lesson?.name, // قبول الحقلين لمرونة
      hasVideo: !!lesson?.videoUrl,
      hasPdf: !!lesson?.pdfFile,
      hasDescription: !!lesson?.description_ar || !!lesson?.description, // قبول الحقلين لمرونة
    },
    {
      code: "en",
      label: "English",
      hasName: !!lesson?.name_en,
      hasVideo: !!lesson?.videoUrl_en,
      hasPdf: !!lesson?.pdfFile_en,
      hasDescription: !!lesson?.description_en,
    },
    {
      code: "de",
      label: "Deutsch",
      hasName: !!lesson?.name_de,
      hasVideo: !!lesson?.videoUrl_de,
      hasPdf: !!lesson?.pdfFile_de,
      hasDescription: !!lesson?.description_de,
    },
  ];

  const isAvailable = (lang) => lang.hasName && (lang.hasVideo || lang.hasPdf);

  if (compact) {
    // نسخة مختصرة - تظهر رموز فقط
    return (
      <div className="flex gap-1 items-center">
        {languages.map((lang) => (
          <span
            key={lang.code}
            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              isAvailable(lang)
                ? "bg-green-200 text-green-800"
                : "bg-red-200 text-red-800"
            }`}
            title={`${lang.label}: ${
              isAvailable(lang)
                ? "متوفرة ✓"
                : "ناقصة - بحاجة لإضافة"
            }`}
          >
            {lang.code.toUpperCase()}
          </span>
        ))}
      </div>
    );
  }

  // نسخة مفصلة
  return (
    <div className="bg-blue-50 p-3 rounded border border-blue-200 my-3">
      <h4 className="font-bold text-blue-900 mb-2">
        🌐 {t('lessons.availableLanguages', 'اللغات المتاحة')}
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        {languages.map((lang) => (
          <div
            key={lang.code}
            className={`p-2 rounded border-l-4 ${
              isAvailable(lang)
                ? "bg-green-50 border-green-500"
                : "bg-red-50 border-red-500"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold">{lang.label}</span>
              <span className="text-lg">
                {isAvailable(lang) ? "✅" : "⚠️"}
              </span>
            </div>
            <div className="text-xs text-gray-600 mt-1 space-y-1">
              <div className={lang.hasName ? "text-green-700" : "text-red-700"}>
                • {lang.hasName ? "✓" : "✗"} الاسم
              </div>
              <div
                className={
                  lang.hasVideo || lang.hasPdf
                    ? "text-green-700"
                    : "text-red-700"
                }
              >
                • {lang.hasVideo || lang.hasPdf ? "✓" : "✗"} فيديو/PDF
              </div>
              <div className={lang.hasDescription ? "text-green-700" : "text-red-700"}>
                • {lang.hasDescription ? "✓" : "✗"} الوصف
              </div>
            </div>
          </div>
        ))}
      </div>

     
    </div>
  );
}
