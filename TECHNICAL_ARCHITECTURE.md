# 🏗️ البنية التقنية: نظام تعديل الدروس متعددة اللغات

## 📐 رسم المعمارية

```
┌─────────────────────────────────────────────────────────────────┐
│                     LEARNING LESSON SYSTEM                      │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────┐         ┌──────────────────────────────┐
│   FRONTEND (React)  │         │    BACKEND (Node.js)         │
└─────────────────────┘         └──────────────────────────────┘

1️⃣ LearningLessonList.jsx ────▶ GET /learningLesson/byLecture/:id
   - عرض جدول الدروس
   - LanguageIndicator (compact)
   - زر "✏️ تعديل" مباشر
   
2️⃣ LearningLessonDetails.jsx ─▶ GET /learningLesson/admin/:id
   - عرض تفاصيل الدرس
   - LanguageIndicator (full)
   - نموذج التعديل
   
3️⃣ LanguageIndicator.jsx
   - عرض حالة اللغات
   - 🟢 متوفرة / 🔴 ناقصة
   - Compact أو Full mode

                                 Database: MongoDB
                                 ┌─────────────────┐
PUT /learningLesson/update/:id ─▶│ LearningLesson  │
POST multipart/form-data          │ ┌─────────────┐│
                                  │ │ name_ar     ││
                                  │ │ name_en     ││
                                  │ │ name_de     ││
                                  │ │ videoUrl*   ││
                                  │ │ videoUrl_en ││
                                  │ │ videoUrl_de ││
                                  │ │ pdfFile*    ││
                                  │ │ pdfFile_en  ││
                                  │ │ pdfFile_de  ││
                                  │ │ description*││
                                  │ │ desc_ar/en/de││
                                  │ │ status      ││
                                  │ │ progress    ││
                                  │ └─────────────┘│
                                  └─────────────────┘
```

---

## 📦 البيانات المنقولة

### API Request: PUT /learningLesson/update/:id

```javascript
// Headers
{
  "Content-Type": "multipart/form-data",
  "Authorization": "Bearer TOKEN"
}

// Body - FormData
{
  // النصوص
  name_ar: "علم الأدوية",
  name_en: "Pharmacology",
  name_de: "Pharmakologie",
  
  description_ar: "دراسة الأدوية...",
  description_en: "Study of drugs...",
  description_de: "Studium der Medikamente...",
  
  // الملفات
  video_ar: File(pharmacology_ar.mp4),
  video_en: File(pharmacology_en.mp4),
  video_de: File(pharmacology_de.mp4),
  
  pdfFile_ar: File(pharmacology_ar.pdf),
  pdfFile_en: File(pharmacology_en.pdf),
  pdfFile_de: File(pharmacology_de.pdf),
  
  // المصادر
  sources[0][title]: "مصدر 1",
  sources[0][link]: "https://example.com"
}
```

### API Response: 200 OK

```javascript
{
  _id: "507f1f77bcf86cd799439011",
  name: "علم الأدوية",
  name_ar: "علم الأدوية",
  name_en: "Pharmacology",
  name_de: "Pharmakologie",
  
  videoUrl: "/videos/timestamp-ar-pharmacology_ar.mp4",
  videoUrl_en: "/videos/timestamp-en-pharmacology_en.mp4",
  videoUrl_de: "/videos/timestamp-de-pharmacology_de.mp4",
  
  videoUrl_480p: "/processed/timestamp-ar-pharmacology_ar_480p.mp4",
  videoUrl_720p: "/processed/timestamp-ar-pharmacology_ar_720p.mp4",
  videoUrl_en_480p: "/processed/timestamp-en-pharmacology_en_480p.mp4",
  
  pdfFile: "timestamp-ar-pharmacology_ar.pdf",
  pdfFile_en: "timestamp-en-pharmacology_en.pdf",
  pdfFile_de: "timestamp-de-pharmacology_de.pdf",
  
  status: "processing",  // or "ready", "error"
  progress: 45,          // 0-100%
  
  createdAt: "2024-04-27T10:30:00Z",
  updatedAt: "2024-04-27T10:35:00Z"
}
```

---

## 🔄 سير العمل (Workflow)

### Phase 1: تحميل الصفحة

```
1. User clicks "✏️ Edit" button
2. Navigate to /learningLesson/:id/details
3. LearningLessonDetails.jsx mounts
4. fetch: GET /learningLesson/admin/:id
5. Populate editedLesson state
6. Render LanguageIndicator (full mode)
7. Display edit form
```

### Phase 2: تعديل المحتوى

```
1. User fills in English fields:
   - name_en: "Pharmacology"
   - description_en: "..."
   - videoFile_en: <File>
   - pdfFileUpload_en: <File>

2. State updates: editedLesson.name_en = "Pharmacology"

3. User clicks "Save" button
4. handleUpdateLesson() triggered
```

### Phase 3: إرسال البيانات

```
1. Create FormData object
2. Append all fields (text + files)
3. POST to: PUT /learningLesson/update/:id
4. Header: Content-Type: multipart/form-data

FormData Structure:
├─ name_ar
├─ name_en
├─ name_de
├─ description_ar
├─ description_en
├─ description_de
├─ video_ar (File)
├─ video_en (File)
├─ video_de (File)
├─ pdfFile_ar (File)
├─ pdfFile_en (File)
├─ pdfFile_de (File)
└─ sources (JSON array)
```

### Phase 4: معالجة الخادم

```
Backend: learningLessonController.updateLesson()

1. Parse FormData
2. For each PDF file:
   - Save to /uploads/pdfs/
   - Update DB: pdfFile, pdfFile_en, pdfFile_de

3. For each Video file:
   - Save to /uploads/videos/
   - Set status: "processing"
   - Update DB: videoUrl, videoUrl_en, videoUrl_de

4. Async: FFmpeg processing
   - 480p conversion
   - 720p conversion
   - Save to /uploads/processed/
   
5. Update DB:
   - videoUrl_480p
   - videoUrl_720p
   - videoUrl_1080p (original)
   - status: "ready" or "error"
   - progress: 100

6. Response: Updated lesson object
```

### Phase 5: التحديث الفوري (UI)

```
1. If response.status === 200:
   - Show success message
   - Call fetchLesson() to refresh
   - LanguageIndicator updates automatically
   - Example:
     🟢AR 🟢EN 🔴DE (changed from 🔴EN to 🟢EN)

2. If response.status !== 200:
   - Show error message
   - Keep form data
   - Allow retry
```

---

## 🗂️ هيكل الملفات

```
c:\InPharm\
├── inpharm-admin-dashboard-main/
│   └── src/
│       ├── pages/learning/
│       │   ├── LearningLessonList.jsx       ← عرض الجدول
│       │   ├── LearningLessonDetails.jsx    ← صفحة التعديل
│       │   └── LearningLessonComments.jsx
│       │
│       └── components/
│           ├── LanguageIndicator.jsx        ← مؤشرات اللغات (جديد)
│           └── RelatedLessonsModal.jsx
│
└── inpharm-admin-backend-main/
    └── src/
        ├── controllers/learningControllers/
        │   └── learningLessonController.js  ← معالجة التحديثات
        │
        ├── models/learningModels/
        │   └── LearningLesson.js            ← المخطط
        │
        ├── routes/learningRoutes/
        │   └── learningLessonRoutes.js      ← الـ Routes
        │
        └── middleware/
            └── upload.js                    ← معالج الملفات
```

---

## 🔐 التحقق من الصلاحيات

```javascript
// middleware/authMiddleware.js
// يتحقق من: هل المستخدم مسجل الدخول؟

// middleware/checkPermission.js
// يتحقق من: هل للمستخدم صلاحية updateLesson؟

// Required permission: "updateLesson"

PUT /learningLesson/update/:id
  ↓
authMiddleware         (✓ توثيق المستخدم)
  ↓
checkPermission("updateLesson")  (✓ تحقق الصلاحيات)
  ↓
updateLesson controller
```

---

## 📊 نقاط البيانات الرئيسية

### اللغات المدعومة

```javascript
languages = [
  { code: "ar", label: "🇸🇦 العربية" },
  { code: "en", label: "🇬🇧 English" },
  { code: "de", label: "🇩🇪 Deutsch" }
]
```

### حالات المعالجة

```javascript
status ∈ {
  "ready": "الفيديو معالج وجاهز",
  "processing": "جاري التحويل...",
  "error": "فشل التحويل"
}

progress ∈ [0, 100]  // نسبة التقدم %
```

### الحقول المخزنة

```
العربية:
  name          ← fallback من name_ar
  name_ar       ← اسم بالعربية
  description   ← fallback من description_ar
  description_ar
  videoUrl      ← الفيديو الأصلي
  videoUrl_480p ← معالج - جودة منخفضة
  videoUrl_720p ← معالج - جودة متوسطة
  videoUrl_1080p ← الأصلي - جودة عالية
  pdfFile

الإنجليزية:
  name_en
  description_en
  videoUrl_en
  videoUrl_en_480p
  videoUrl_en_720p
  videoUrl_en_1080p
  pdfFile_en

الألمانية:
  name_de
  description_de
  videoUrl_de
  videoUrl_de_480p
  videoUrl_de_720p
  videoUrl_de_1080p
  pdfFile_de
```

---

## ⚡ التحسينات المطبقة

| الميزة | السابق | الحالي |
|--------|--------|--------|
| عرض اللغات | ❌ لا يوجد | ✅ مؤشرات ملونة |
| زر التعديل | 🎥 أيقونة صغيرة | ✅ زر أزرق واضح |
| تحديد اللغات | ❌ غير واضح | ✅ صندوق معلومات بالأعلى |
| سهولة الاستخدام | متوسطة | ✅ عالية جداً |
| الملاحظات | ❌ لا توجد | ✅ نصائح مفيدة |

---

## 🧪 سيناريوهات الاختبار

### ✅ Test Case 1: أضف لغة جديدة
```
1. Open lesson with 🟢AR 🔴EN 🔴DE
2. Fill English fields
3. Click Save
4. Verify: 🟢AR 🟢EN 🔴DE ✓
```

### ✅ Test Case 2: تحديث فيديو فقط
```
1. Open lesson
2. Clear other fields
3. Only upload video_en
4. Click Save
5. Verify: status = "processing"
```

### ✅ Test Case 3: معالجة الفيديو
```
1. Upload video
2. Monitor progress bar
3. Wait for status: "ready"
4. Verify: videoUrl_480p, videoUrl_720p exist
```

### ✅ Test Case 4: الخطأ
```
1. Upload invalid format
2. Click Save
3. Verify: status = "error"
4. Allow retry
```

---

## 📝 الخلاصة

النظام يوفر:
- ✅ واجهة واضحة لتعديل الدروس متعددة اللغات
- ✅ معالجة تلقائية للفيديوهات والملفات
- ✅ تتبع الحالة والتقدم في الوقت الفعلي
- ✅ صلاحيات آمنة للمسؤولين فقط
- ✅ مرونة كاملة - أضف لغات تدريجياً

**الإصدار:** 2.0  
**التاريخ:** 27 أبريل 2026
