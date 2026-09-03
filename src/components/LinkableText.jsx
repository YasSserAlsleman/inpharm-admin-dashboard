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
  const hasHtml = /<\/?[a-z][^>]*>/i.test(text);

  if (hasHtml) {
    const sanitizedHtml = text
      .replace(/<\s*(script|style|iframe|object|embed)[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi, '')
      .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
      .replace(/javascript\s*:/gi, '');

    return (
      <span
        className={className}
        dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
      />
    );
  }

  const parts = text.split(urlRegex);

  return (
    <span className={className}>
      {parts.map((part, index) => {
        if (/^(https?:\/\/[^\s]+|www\.[^\s]+)$/.test(part)) {
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
