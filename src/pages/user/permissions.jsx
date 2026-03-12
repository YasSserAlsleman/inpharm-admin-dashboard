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
      { key: "deleteResearch", label: "Delete Research" }
    ]
  },
  {
    title: "Lectures",
    permissions: [
      { key: "addLecture", label: "Add Lecture" },
      { key: "deleteLecture", label: "Delete Lecture" }
    ]
  },
  {
    title: "Questions",
    permissions: [
      { key: "addQuestion", label: "Add Question" },
      { key: "deleteQuestion", label: "Delete Question" }
    ]
  },
  {
    title: "News",
    permissions: [
      { key: "addNews", label: "Add News" },
      { key: "deleteNews", label: "Delete News" },
      { key: "addSubNews", label: "Add Sub News" },
      { key: "deleteSubNews", label: "Delete Sub News" }
    ]
  },
  {
    title: "Codes & Plans",
    permissions: [
      { key: "generateCodes", label: "Generate Codes" },
      { key: "generatePlans", label: "Add Plans" },
      { key: "deletePlans", label: "Delete Plans" }
    ]
  },
  {
    title: "Users",
    permissions: [
      { key: "deleteUser", label: "Delete User" },
      { key: "createManager", label: "Create Manager" },
      { key: "updateManagerPermissions", label: "Update Manager Permissions" }
    ]
  },
  {
    title: "Other",
    permissions: [
      { key: "addAbout", label: "Edit About Page" }
    ]
  }
];