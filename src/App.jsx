import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./components/AdminLayout";
import { useAuth } from "./contexts/AuthContext";
import PrivateRoute from "./pages/privateRoute";

// Pages
import Login from "./pages/Login";

      {/* ---------------- Pharmacy in Germany (behaves like Learning) ---------------- */}
      <Route
        path="/pharmacy-germany"
        element={
          <PrivateRoute roles={['admin','manager']}>
            <AdminLayout><LearningMainTopic /></AdminLayout>
          </PrivateRoute>
        }
      />
import NotFound from "./pages/NotFound";
import Users from "./pages/user/Users";
import Managers from "./pages/user/Managers";
import Students from "./pages/user/Students";
import ChangePassword from "./pages/user/ChangePassword";
import ResetPassword from "./pages/ResetPassword";

import Codes from "./pages/codes/Codes";
import Plans from "./pages/codes/Plans";

import LearningMainTopic from "./pages/learning/LearningMainTopic";  
import LearningLectureList from "./pages/learning/LearningLectureList";
import LearningResearchList from "./pages/learning/LearningResearchList";
import LearningLessonList from "./pages/learning/LearningLessonList";
import LearningLessonDetails from "./pages/learning/LearningLessonDetails";
import LearningQuestionList from "./pages/learning/LearningQuestionList";
import LearningLessonComments from "./pages/learning/LearningLessonComments";

import GermanyPharmacyMainTopic from "./pages/GermanyPharmacy/GermanyPharmacyMainTopic";  
import GermanyPharmacyLectureList from "./pages/GermanyPharmacy/GermanyPharmacyLectureList";
import GermanyPharmacyResearchList from "./pages/GermanyPharmacy/GermanyPharmacyResearchList";
import GermanyPharmacyLessonList from "./pages/GermanyPharmacy/GermanyPharmacyLessonList";
import GermanyPharmacyLessonDetails from "./pages/GermanyPharmacy/GermanyPharmacyLessonDetails";
import GermanyPharmacyQuestionList from "./pages/GermanyPharmacy/GermanyPharmacyQuestionList";
import GermanyPharmacyLessonComments from "./pages/GermanyPharmacy/GermanyPharmacyLessonComments";

import VirtualPharmacyMainTopic from "./pages/virtualPharmacy/VirtualPharmacyMainTopic";
import VirtualPharmacyLessonList from "./pages/virtualPharmacy/VirtualPharmacyLessonList";
import VirtualPharmacyLessonDetails from  "./pages/virtualPharmacy/VirtualPharmacyLessonDetails";
import VirtualPharmacyQuestionList from   "./pages/virtualPharmacy/VirtualPharmacyQuestionList";
import VirtualPharmacyLessonComments from "./pages/virtualPharmacy/VirtualPharmacyLessonComments";

import PodcastMainTopic from "./pages/podcast/PodcastMainTopic";
import PodcastLessonList from "./pages/podcast/PodcastLessonList";
import PodcastLessonDetails from  "./pages/podcast/PodcastLessonDetails";
import PodcastQuestionList from   "./pages/podcast/PodcastQuestionList";
import PodcastLessonComments from "./pages/podcast/PodcastLessonComments";
import Sections from "./pages/sections/Sections";

import News from "./pages/news/News";
import SubNews from "./pages/news/SubNews";
import AboutPage from "./pages/about/AboutPage";
import Notifications from "./pages/notifications/Notifications";
import NotificationListener from "./components/NotificationListener";

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <>
    <NotificationListener />
    <Routes>
      {/* 🔹 Login */}
      <Route path="/login" element={<Login />} />
      <Route path="/inpharm" element={<ResetPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* 🔹 Dashboard / Main page (Admin + Manager) */}
      <Route
        path="/"
        element={
          <PrivateRoute roles={['admin','manager']}>
            <AdminLayout>
              <LearningMainTopic />
            </AdminLayout>
          </PrivateRoute>
        }
      />

      {/* ---------------- Learning ---------------- */}
      <Route
        path="/main/:mainId/research"
        element={
          <PrivateRoute roles={['admin','manager']}>
            <AdminLayout><LearningResearchList /></AdminLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/research/:researchId/lectures"
        element={
          <PrivateRoute roles={['admin','manager']}>
            <AdminLayout><LearningLectureList /></AdminLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/lecture/:lectureId/lessons"
        element={
          <PrivateRoute roles={['admin','manager']}>
            <AdminLayout><LearningLessonList /></AdminLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/learningLesson/:lessonId/details"
        element={
          <PrivateRoute roles={['admin','manager']}>
            <AdminLayout><LearningLessonDetails /></AdminLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/learningLesson/:lessonId/questions"
        element={
          <PrivateRoute roles={['admin','manager']}>
            <AdminLayout><LearningQuestionList /></AdminLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/learningLesson/:lessonId/comments"
        element={
          <PrivateRoute roles={['admin','manager']}>
            <AdminLayout><LearningLessonComments /></AdminLayout>
          </PrivateRoute>
        }
      />

  

      {/* ---------------- Germany Pharmacy ---------------- */}
       <Route
        path="/pharmacy-germany"
        element={
          <PrivateRoute roles={['admin','manager']}>
            <AdminLayout>
              <GermanyPharmacyMainTopic />
            </AdminLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/main/:mainId/germanyPharmacyresearch"
        element={
          <PrivateRoute roles={['admin','manager']}>
            <AdminLayout><GermanyPharmacyResearchList /></AdminLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/germanyPharmacyResearch/:researchId/lectures"
        element={
          <PrivateRoute roles={['admin','manager']}>
            <AdminLayout><GermanyPharmacyLectureList /></AdminLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/germanyPharmacyLecture/:lectureId/lessons"
        element={
          <PrivateRoute roles={['admin','manager']}>
            <AdminLayout><GermanyPharmacyLessonList /></AdminLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/germanyPharmacyLesson/:lessonId/details"
        element={
          <PrivateRoute roles={['admin','manager']}>
            <AdminLayout><GermanyPharmacyLessonDetails /></AdminLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/germanyPharmacyLesson/:lessonId/questions"
        element={
          <PrivateRoute roles={['admin','manager']}>
            <AdminLayout><GermanyPharmacyQuestionList /></AdminLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/germanyPharmacyLesson/:lessonId/comments"
        element={
          <PrivateRoute roles={['admin','manager']}>
            <AdminLayout><GermanyPharmacyLessonComments /></AdminLayout>
          </PrivateRoute>
        }
      />
      {/* ---------------- Virtual Pharmacy ---------------- */}
      <Route
        path="/virtualPharmacy"
        element={
          <PrivateRoute roles={['admin','manager']}>
            <AdminLayout><VirtualPharmacyMainTopic /></AdminLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/virtualPharmacy/:mainId/lesson"
        element={
          <PrivateRoute roles={['admin','manager']}>
            <AdminLayout><VirtualPharmacyLessonList /></AdminLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/virtualPharmacyLesson/:lessonId/details"
        element={
          <PrivateRoute roles={['admin','manager']}>
            <AdminLayout><VirtualPharmacyLessonDetails /></AdminLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/virtualPharmacyLesson/:lessonId/questions"
        element={
          <PrivateRoute roles={['admin','manager']}>
            <AdminLayout><VirtualPharmacyQuestionList /></AdminLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/virtualPharmacyLesson/:lessonId/comments"
        element={
          <PrivateRoute roles={['admin','manager']}>
            <AdminLayout><VirtualPharmacyLessonComments /></AdminLayout>
          </PrivateRoute>
        }
      />

      {/* ---------------- Podcast ---------------- */}
      <Route
        path="/podcast"
        element={
          <PrivateRoute roles={['admin','manager']}>
            <AdminLayout><PodcastMainTopic /></AdminLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/sections"
        element={
          <PrivateRoute roles={['admin','manager']}>
            <AdminLayout><Sections /></AdminLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/podcast/:mainId/lesson"
        element={
          <PrivateRoute roles={['admin','manager']}>
            <AdminLayout><PodcastLessonList /></AdminLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/podcastLesson/:lessonId/details"
        element={
          <PrivateRoute roles={['admin','manager']}>
            <AdminLayout><PodcastLessonDetails /></AdminLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/podcastLesson/:lessonId/questions"
        element={
          <PrivateRoute roles={['admin','manager']}>
            <AdminLayout><PodcastQuestionList /></AdminLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/podcastLesson/:lessonId/comments"
        element={
          <PrivateRoute roles={['admin','manager']}>
            <AdminLayout><PodcastLessonComments /></AdminLayout>
          </PrivateRoute>
        }
      />

      {/* ---------------- Users ---------------- */}
      <Route
        path="/users"
        element={
          <PrivateRoute roles={['admin','manager']}>
            <AdminLayout><Users /></AdminLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/Students"
        element={
          <PrivateRoute roles={['admin','manager']}>
            <AdminLayout><Students /></AdminLayout>
          </PrivateRoute>
        }
      />

      {/* ---------------- Managers (Admin only) ---------------- */}
      <Route
        path="/Managers"
        element={
          <PrivateRoute roles={['admin','manager']}>
            <AdminLayout><Managers /></AdminLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/change-password"
        element={
          <PrivateRoute roles={['admin','manager']}>
            <AdminLayout><ChangePassword /></AdminLayout>
          </PrivateRoute>
        }
      />

      {/* ---------------- Codes & Plans (Admin only) ---------------- */}
      <Route
        path="/codes"
        element={
          <PrivateRoute roles={['admin','manager']}>
            <AdminLayout><Codes /></AdminLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/plans"
        element={
          <PrivateRoute roles={['admin','manager']}>
            <AdminLayout><Plans /></AdminLayout>
          </PrivateRoute>
        }
      />

      {/* ---------------- News & About (Admin + Manager) ---------------- */}
      <Route
        path="/news"
        element={
          <PrivateRoute roles={['admin','manager']}>
            <AdminLayout><News /></AdminLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/news/:newsId/subNews"
        element={
          <PrivateRoute roles={['admin','manager']}>
            <AdminLayout><SubNews /></AdminLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/notifications"
        element={
          <PrivateRoute roles={['admin','manager']}>
            <AdminLayout><Notifications /></AdminLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/about"
        element={
          <PrivateRoute roles={['admin','manager']}>
            <AdminLayout><AboutPage /></AdminLayout>
          </PrivateRoute>
        }
      />

      {/* ---------------- Fallback 404 ---------------- */}
      <Route path="*" element={<NotFound />} />
    </Routes>
    </>
  );
}

export default App;