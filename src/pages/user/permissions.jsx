// src/config/permissions.js
export const permissionStorageAliases = {
  "lessons.view": "viewLessons", "topics.view": "viewTopics", "research.view": "viewResearch",
  "lectures.view": "viewLectures", "questions.view": "viewQuestions", "news.view": "viewNews",
  "subNews.view": "viewSubNews", "codes.view": "viewCodes", "plans.view": "viewPlans",
  "students.view": "viewStudents", "managers.view": "viewManagers", "about.view": "viewAbout",
  "sections.view": "viewSections", "notifications.view": "viewNotifications",
  "students.update": "updateStudents", "students.delete": "deleteStudents",
  "sections.create": "createSections", "sections.update": "updateSections", "sections.delete": "deleteSections",
  "lessons.create": "addLesson", "lessons.update": "updateLesson", "lessons.delete": "deleteLesson",
  "topics.create": "addMainTopic", "topics.update": "updateMainTopic", "topics.delete": "deleteMainTopic",
  "research.create": "addResearch", "research.update": "updateResearch", "research.delete": "deleteResearch",
  "lectures.create": "addLecture", "lectures.update": "updateLecture", "lectures.delete": "deleteLecture",
  "questions.create": "addQuestion", "questions.update": "updateQuestion", "questions.delete": "deleteQuestion",
  "news.create": "addNews", "news.update": "updateNews", "news.delete": "deleteNews",
  "subNews.create": "addSubNews", "subNews.update": "updateSubNews", "subNews.delete": "deleteSubNews",
  "codes.create": "generateCodes", "plans.create": "generatePlans", "plans.update": "updatePlans", "plans.delete": "deletePlans",
  "users.delete": "deleteUser", "managers.create": "createManager", "managers.delete": "deleteManager",
  "managers.permissions": "updateManagerPermissions", "users.role": "changeUserRole",
  "comments.delete": "deleteComment", "settings.update": "updateAppSettings"
};

export const hasStoredPermission = (permissions, permission) =>
  Boolean(permissions?.[permission] || permissions?.[permissionStorageAliases[permission]]);

export const permissionGroups = [
  {
    title: "View Access",
    permissions: [
      { key: "lessons.view", label: "View Lessons" },
      { key: "topics.view", label: "View Main Topics" },
      { key: "research.view", label: "View Research" },
      { key: "lectures.view", label: "View Lectures" },
      { key: "questions.view", label: "View Questions" },
      { key: "news.view", label: "View News" },
      { key: "subNews.view", label: "View Sub News" },
      { key: "codes.view", label: "View Codes" },
      { key: "plans.view", label: "View Plans" },
      { key: "students.view", label: "View Students" },
      { key: "managers.view", label: "View Managers" },
      { key: "about.view", label: "View About" },
      { key: "sections.view", label: "View Sections" },
      { key: "notifications.view", label: "View Notifications" }
    ]
  },
  {
    title: "Lessons",
    permissions: [
      { key: "lessons.create", label: "Create Lesson" },
      { key: "lessons.update", label: "Update Lesson" },
      { key: "lessons.delete", label: "Delete Lesson" }
    ]
  },
  {
    title: "Main Topics",
    permissions: [
      { key: "topics.create", label: "Create Main Topic" },
      { key: "topics.update", label: "Update Main Topic" },
      { key: "topics.delete", label: "Delete Main Topic" }
    ]
  },
  {
    title: "Research",
    permissions: [
      { key: "research.create", label: "Create Research" },
      { key: "research.update", label: "Update Research" },
      { key: "research.delete", label: "Delete Research" }
    ]
  },
  {
    title: "Lectures",
    permissions: [
      { key: "lectures.create", label: "Create Lecture" },
      { key: "lectures.update", label: "Update Lecture" },
      { key: "lectures.delete", label: "Delete Lecture" }
    ]
  },
  {
    title: "Questions",
    permissions: [
      { key: "questions.create", label: "Create Question" },
      { key: "questions.update", label: "Update Question" },
      { key: "questions.delete", label: "Delete Question" }
    ]
  },
  {
    title: "News",
    permissions: [
      { key: "news.create", label: "Create News" },
      { key: "news.update", label: "Update News" },
      { key: "news.delete", label: "Delete News" },
      { key: "subNews.create", label: "Create Sub News" },
      { key: "subNews.update", label: "Update Sub News" },
      { key: "subNews.delete", label: "Delete Sub News" }
    ]
  },
  {
    title: "Codes & Plans",
    permissions: [
      { key: "codes.create", label: "Create Codes" },
      { key: "plans.create", label: "Create Plans" },
      { key: "plans.update", label: "Update Plans" },
      { key: "plans.delete", label: "Delete Plans" }
    ]
  },
  {
    title: "Users",
    permissions: [
      { key: "students.update", label: "Update Students" },
      { key: "students.delete", label: "Delete Students" },
      { key: "sections.create", label: "Create Sections" },
      { key: "sections.update", label: "Update Sections" },
      { key: "sections.delete", label: "Delete Sections" },
      { key: "users.delete", label: "Delete Users" },
      { key: "managers.create", label: "Create Managers" },
      { key: "managers.delete", label: "Delete Managers" },
      { key: "managers.permissions", label: "Update Manager Permissions" },
      { key: "users.role", label: "Change User Roles" }
    ]
  },
  {
    title: "Comments",
    permissions: [
      { key: "comments.delete", label: "Delete Comments" }
    ]
  },
  {
    title: "System Settings",
    permissions: [
      { key: "settings.update", label: "Update App Settings (WhatsApp)" }
    ]
  }
];