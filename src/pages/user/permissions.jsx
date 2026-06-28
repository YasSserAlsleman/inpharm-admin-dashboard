// src/config/permissions.js
export const permissionGroups = [
  {
    title: "Lessons",
    permissions: [
      { key: "addLesson", label: "Add Lesson" },
      { key: "updateLesson", label: "Update Lesson" },
      { key: "deleteLesson", label: "Delete Lesson" }
    ]
  },
  {
    title: "Main Topics",
    permissions: [
      { key: "addMainTopic", label: "Add Main Topic" },
      { key: "updateMainTopic", label: "Update Main Topic" },
      { key: "deleteMainTopic", label: "Delete Main Topic" }
    ]
  },
  {
    title: "Research",
    permissions: [
      { key: "addResearch", label: "Add Research" },
      { key: "updateResearch", label: "Update Research" },
      { key: "deleteResearch", label: "Delete Research" }
    ]
  },
  {
    title: "Lectures",
    permissions: [
      { key: "addLecture", label: "Add Lecture" },
      { key: "updateLecture", label: "Update Lecture" },
      { key: "deleteLecture", label: "Delete Lecture" }
    ]
  },
  {
    title: "Questions",
    permissions: [
      { key: "addQuestion", label: "Add Question" },
      { key: "updateQuestion", label: "Update Question" },
      { key: "deleteQuestion", label: "Delete Question" }
    ]
  },
  {
    title: "News",
    permissions: [
      { key: "addNews", label: "Add News" },
      { key: "updateNews", label: "Update News" },
      { key: "deleteNews", label: "Delete News" },
      { key: "addSubNews", label: "Add Sub News" },
      { key: "updateSubNews", label: "Update Sub News" },
      { key: "deleteSubNews", label: "Delete Sub News" }
    ]
  },
  {
    title: "Codes & Plans",
    permissions: [
      { key: "generateCodes", label: "Generate Codes" },
      { key: "generatePlans", label: "Add Plans" },
      { key: "updatePlans", label: "Update Plans" },
      { key: "deletePlans", label: "Delete Plans" }
    ]
  },
  {
    title: "Users",
    permissions: [
      { key: "deleteUser", label: "Delete User" },
      { key: "deleteManager", label: "Delete Manager" },
      { key: "createManager", label: "Create Manager" },
      { key: "updateManagerPermissions", label: "Update Manager Permissions" }
    ]
  },
  {
    title: "Comments",
    permissions: [
      { key: "deleteComment", label: "Delete Comment" }
    ]
  },
  {
    title: "System Settings",
    permissions: [
      { key: "updateAppSettings", label: "Update App Settings (WhatsApp)" },
      { key: "changeUserRole", label: "Change User Roles" }
    ]
  }
];