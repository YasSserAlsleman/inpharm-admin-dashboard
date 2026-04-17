import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const STORAGE_KEY = 'inpharm_lang'
const savedLanguage = localStorage.getItem(STORAGE_KEY) || 'en'

const resources = {
  en: {
    translation: {
      inpharmAdmin: 'InPharm Admin',
      navigation: {
        learning: 'Learning',
        virtualPharmacy: 'Virtual Pharmacy',
        podcast: 'Podcast',
        news: 'News',
        about: 'About',
        codes: 'Codes',
        plans: 'Plans',
        students: 'Students',
        managers: 'Managers',
        changePassword: 'Change Password'
      },
      button: {
        logout: 'Logout',
        signIn: 'Sign In'
      },
      language: {
        label: 'Language',
        english: 'English',
        arabic: 'Arabic',
        german: 'German'
      },
      login: {
        title: 'Admin / Manager Login',
        email: 'Email',
        password: 'Password',
        signing: 'Signing...',
        failed: 'Login failed',
        deviceMismatch: 'Login from another device. Only one device login is allowed.'
      },
      lessons: {
        addLesson: 'Add Lesson',
        adding: 'Adding...',
        lessonName: 'Lesson Name',
        description: 'Description',
        videoFile: 'Video File',
        pdfFile: 'PDF File',
        status: 'Status',
        actions: 'Actions',
        noLessons: 'No lessons available.',
        edit: 'Edit',
        delete: 'Delete',
        confirmDelete: 'Are you sure?',
        deleteMessage: 'This lesson will be permanently deleted!',
        yesDelete: 'Yes, delete it',
        cancel: 'Cancel',
        deleted: 'Deleted!',
        deleteSuccess: 'Lesson deleted successfully.',
        error: 'Error',
        updateSuccess: 'Lesson updated successfully!',
        saveChanges: 'Save Changes',
        cancelEdit: 'Cancel',
        loading: 'Loading lessons...',
        lessonsForLecture: 'Lessons for Lecture:',
        enterName: 'Enter lesson name in at least one language!',
        videoAndDescription: 'Video and Description',
        removeOption: 'Remove',
        addNewOption: 'Add New Option',
        addQuestion: 'Add Question',
        deleteQuestion: 'Delete',
        confirmDeleteTitle: 'Are you sure?',
        confirmDeleteText: 'This will be permanently deleted!',
        confirmDeleteButton: 'Yes, delete it',
        cancelButton: 'Cancel',
        comments: 'Comments',
        addComment: 'Add your comment...',
        send: 'Send',
        noComments: 'No comments yet.',
        deleteComment: 'Delete Comment',
        confirmDeleteCommentMessage: 'Are you sure you want to delete this comment and all its replies?',
        reply: 'Reply',
        user: 'User',
        video: 'Video',
        videQuality: 'Video Quality',
        videoLabelAr: 'Upload Video (Arabic)',
        videoLabelEn: 'Upload Video (English)',
        videoLabelDe: 'Upload Video (German)',
        pdfLabelAr: 'PDF File (Arabic)',
        pdfLabelEn: 'PDF File (English)',
        pdfLabelDe: 'PDF File (German)',
        lessonNameArPlaceholder: 'Lesson Name (Arabic)',
        descriptionArPlaceholder: 'Description (Arabic)',
        descriptionEnPlaceholder: 'Lesson Description (English)',
        descriptionDePlaceholder: 'Description of Lesson (German)',
        pdfPreview: 'PDF Preview',
        loading: 'Loading...',
        tabs: {
          video: 'Video and Description',
          comments: 'Comments'
        }
      },
      common: {
        loading: 'Loading...',
        pleaseWait: 'Please wait...',
        error: 'Error',
        success: 'Success',
        delete: 'Delete',
        edit: 'Edit',
        cancel: 'Cancel',
        save: 'Save',
        close: 'Close',
        confirm: 'Confirm',
        notAvailable: 'Not available',
        unknown: 'Unknown'
      }
    }
  },
  ar: {
    translation: {
      inpharmAdmin: 'إدارة إنفارم',
      navigation: {
        learning: 'التعلم',
        virtualPharmacy: 'الصيدلية الافتراضية',
        podcast: 'البودكاست',
        news: 'الأخبار',
        about: 'حول',
        codes: 'الرموز',
        plans: 'الخطط',
        students: 'الطلاب',
        managers: 'المدراء'
      },
      button: {
        logout: 'تسجيل الخروج',
        signIn: 'تسجيل الدخول'
      },
      language: {
        label: 'اللغة',
        english: 'English',
        arabic: 'العربية',
        german: 'Deutsch'
      },
      login: {
        title: 'تسجيل دخول المسؤول / المدير',
        email: 'البريد الإلكتروني',
        password: 'كلمة المرور',
        signing: 'جاري الدخول...',
        failed: 'فشل تسجيل الدخول',
        deviceMismatch: 'تم تسجيل الدخول من جهاز آخر. يُسمح بتسجيل الدخول من جهاز واحد فقط.'
      },
      lessons: {
        addLesson: 'إضافة درس',
        adding: 'جاري الإضافة...',
        lessonName: 'اسم الدرس',
        description: 'الوصف',
        videoFile: 'ملف الفيديو',
        pdfFile: 'ملف PDF',
        status: 'الحالة',
        actions: 'الإجراءات',
        noLessons: 'لا توجد دروس حالياً.',
        edit: 'تعديل',
        delete: 'حذف',
        confirmDelete: 'هل أنت متأكد؟',
        deleteMessage: 'سيتم حذف هذا الدرس نهائياً!',
        yesDelete: 'نعم، احذفه',
        cancel: 'إلغاء',
        deleted: 'تم الحذف!',
        deleteSuccess: 'تم حذف الدرس بنجاح.',
        error: 'خطأ',
        updateSuccess: 'تم تحديث بيانات الدرس بنجاح!',
        saveChanges: 'حفظ التعديلات',
        cancelEdit: 'إلغاء',
        loading: 'جاري تحميل الدروس...',
        lessonsForLecture: 'الدروس التابعة للمحاضرة:',
        enterName: 'أدخل اسم الدرس على الأقل بلغة واحدة!',
        videoAndDescription: 'الفيديو والوصف',
        removeOption: 'إزالة',
        addNewOption: '+ خيار جديد',
        addQuestion: 'إضافة السؤال',
        deleteQuestion: 'حذف',
        confirmDeleteTitle: 'هل أنت متأكد؟',
        confirmDeleteText: 'سيتم حذف هذا نهائياً!',
        confirmDeleteButton: 'نعم، احذفه',
        cancelButton: 'إلغاء',
        comments: 'التعليقات',
        addComment: 'أضف تعليقك...',
        send: 'إرسال',
        noComments: 'لا توجد تعليقات بعد.',
        deleteComment: 'حذف التعليق',
        confirmDeleteCommentMessage: 'هل أنت متأكد من حذف هذا التعليق وكل ردوده؟',
        reply: 'رد',
        user: 'مستخدم',
        video: 'الفيديو',
        videoQuality: 'جودة الفيديو',
        videoLabelAr: 'رفع فيديو الدرس (العربية)',
        videoLabelEn: 'رفع فيديو الدرس (الإنجليزية)',
        videoLabelDe: 'رفع فيديو الدرس (الألمانية)',
        pdfLabelAr: 'ملف PDF (العربية)',
        pdfLabelEn: 'ملف PDF (الإنجليزية)',
        pdfLabelDe: 'ملف PDF (الألمانية)',
        lessonNameArPlaceholder: 'اسم الدرس (العربية)',
        descriptionArPlaceholder: 'الوصف (العربية)',
        descriptionEnPlaceholder: 'Lesson description (English)',
        descriptionDePlaceholder: 'Beschreibung der Lektion (Deutsch)',
        pdfPreview: 'معاينة ملف PDF',
        tabs: {
          video: 'الفيديو والوصف',
          comments: 'التعليقات'
        }
      },
      common: {
        loading: 'جاري التحميل...',
        pleaseWait: 'من فضلك انتظر...',
        error: 'خطأ',
        success: 'نجح',
        delete: 'حذف',
        edit: 'تعديل',
        cancel: 'إلغاء',
        save: 'حفظ',
        close: 'إغلاق',
        confirm: 'تأكيد',
        notAvailable: 'غير متاح',
        unknown: 'غير معروف'
      }
    }
  },
  de: {
    translation: {
      inpharmAdmin: 'InPharm Admin',
      navigation: {
        learning: 'Lernen',
        virtualPharmacy: 'Virtuelle Apotheke',
        podcast: 'Podcast',
        news: 'Nachrichten',
        about: 'Über',
        codes: 'Codes',
        plans: 'Pläne',
        students: 'Studenten',
        managers: 'Manager'
      },
      button: {
        logout: 'Abmelden',
        signIn: 'Anmelden'
      },
      language: {
        label: 'Sprache',
        english: 'Englisch',
        arabic: 'Arabisch',
        german: 'Deutsch'
      },
      login: {
        title: 'Admin/Manager Anmeldung',
        email: 'E-Mail',
        password: 'Passwort',
        signing: 'Anmeldung...',
        failed: 'Anmeldung fehlgeschlagen',
        deviceMismatch: 'Anmeldung von einem anderen Gerät. Nur eine Geräteanmeldung ist erlaubt.'
      },
      lessons: {
        addLesson: 'Lektion hinzufügen',
        adding: 'Hinzufügen...',
        lessonName: 'Lektionsname',
        description: 'Beschreibung',
        videoFile: 'Videodatei',
        pdfFile: 'PDF-Datei',
        status: 'Status',
        actions: 'Aktionen',
        noLessons: 'Keine Lektionen verfügbar.',
        edit: 'Bearbeiten',
        delete: 'Löschen',
        confirmDelete: 'Sind Sie sicher?',
        deleteMessage: 'Diese Lektion wird dauerhaft gelöscht!',
        yesDelete: 'Ja, löschen',
        cancel: 'Abbrechen',
        deleted: 'Gelöscht!',
        deleteSuccess: 'Lektion erfolgreich gelöscht.',
        error: 'Fehler',
        updateSuccess: 'Lektionsdaten erfolgreich aktualisiert!',
        saveChanges: 'Änderungen speichern',
        cancelEdit: 'Abbrechen',
        loading: 'Lektionen laden...',
        lessonsForLecture: 'Lektionen für Vorlesung:',
        enterName: 'Geben Sie den Lektionsnamen in mindestens einer Sprache ein!',
        videoAndDescription: 'Video und Beschreibung',
        removeOption: 'Entfernen',
        addNewOption: '+ Neue Option',
        addQuestion: 'Frage hinzufügen',
        deleteQuestion: 'Löschen',
        confirmDeleteTitle: 'Sind Sie sicher?',
        confirmDeleteText: 'Dies wird dauerhaft gelöscht!',
        confirmDeleteButton: 'Ja, löschen',
        cancelButton: 'Abbrechen',
        comments: 'Kommentare',
        addComment: 'Ihren Kommentar hinzufügen...',
        send: 'Senden',
        noComments: 'Bisher keine Kommentare.',
        deleteComment: 'Kommentar löschen',
        confirmDeleteCommentMessage: 'Möchten Sie diesen Kommentar und alle Antworten wirklich löschen?',
        reply: 'Antworten',
        user: 'Benutzer',
        video: 'Video',
        videoQuality: 'Videoqualität',
        videoLabelAr: 'Video hochladen (Arabisch)',
        videoLabelEn: 'Video hochladen (Englisch)',
        videoLabelDe: 'Video hochladen (Deutsch)',
        pdfLabelAr: 'PDF-Datei (Arabisch)',
        pdfLabelEn: 'PDF-Datei (Englisch)',
        pdfLabelDe: 'PDF-Datei (Deutsch)',
        lessonNameArPlaceholder: 'Lektionsname (Arabisch)',
        descriptionArPlaceholder: 'Beschreibung (Arabisch)',
        descriptionEnPlaceholder: 'Lektionsbeschreibung (Englisch)',
        descriptionDePlaceholder: 'Lektionsbeschreibung (Deutsch)',
        pdfPreview: 'PDF-Vorschau',
        tabs: {
          video: 'Video und Beschreibung',
          comments: 'Kommentare'
        }
      },
      common: {
        loading: 'Wird geladen...',
        pleaseWait: 'Bitte warten Sie...',
        error: 'Fehler',
        success: 'Erfolg',
        delete: 'Löschen',
        edit: 'Bearbeiten',
        cancel: 'Abbrechen',
        save: 'Speichern',
        close: 'Schließen',
        confirm: 'Bestätigen',
        notAvailable: 'Nicht verfügbar',
        unknown: 'Unbekannt'
      }
    }
  }
}

i18n.use(initReactI18next).init({
  resources,
  lng: savedLanguage,
  fallbackLng: 'en',
  supportedLngs: ['en', 'ar', 'de'],
  interpolation: {
    escapeValue: false
  },
  react: {
    useSuspense: false
  }
})

const setDocumentLanguage = (lng) => {
  document.documentElement.lang = lng
  document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr'
}

setDocumentLanguage(savedLanguage)
i18n.on('languageChanged', (lng) => {
  localStorage.setItem(STORAGE_KEY, lng)
  setDocumentLanguage(lng)
})

export default i18n
