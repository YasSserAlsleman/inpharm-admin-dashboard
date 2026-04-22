import React from 'react';

/**
 * Component يعرض النصوص مع الروابط القابلة للنقر
 * يكتشف الروابط تلقائياً ويجعلها قابلة للنقر
 */
export default function LinkableText({ text, className = '' }) {
  if (!text || typeof text !== 'string') {
    return <span className={className}>{text}</span>;
  }

  // regex للبحث عن الروابط
  const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/g;
  const parts = text.split(urlRegex);

  return (
    <span className={className}>
      {parts.map((part, index) => {
        if (urlRegex.test(part)) {
          let url = part;
          // إضافة https:// إذا لم تكن موجودة
          if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
          }

          // اختصار الرابط إذا كان طويلاً
          let displayUrl = part;
          if (displayUrl.length > 40) {
            displayUrl = displayUrl.substring(0, 37) + '...';
          }

          return (
            <a
              key={index}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline cursor-pointer"
              title={part}
            >
              {displayUrl}
            </a>
          );
        }
        return (
          <span key={index}>
            {part}
          </span>
        );
      })}
    </span>
  );
}
