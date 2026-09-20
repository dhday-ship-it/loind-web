import { Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage/HomePage";
import AboutPage from "./pages/AboutPage/AboutPage";
import ServicePage from "./pages/ServicePage/ServicePage";
import StoryPage from "./pages/StoryPage/StoryPage";
import StoryDetailPage from "./pages/StoryDetailPage/StoryDetailPage";
import ContactPage from "./pages/ContactPage/ContactPage";
import AdminPage from "./pages/AdminPage/AdminPage";
import ComingSoonPage from "./pages/ComingSoonPage/ComingSoonPage";
import CreatorGroundPage from "./pages/CreatorGroundPage/CreatorGroundPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="service" element={<ServicePage />} />
        <Route path="story" element={<StoryPage />} />
        <Route path="story/:id" element={<StoryDetailPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="artisan" element={<ComingSoonPage title="아티즌, 기독교 아웃소싱" />} />
        <Route path="rise" element={<ComingSoonPage title="라이즈, 크리스천 사역 인큐베이팅" />} />
      </Route>
      <Route path="admin" element={<AdminPage />} />
      <Route path="creator" element={<CreatorGroundPage />} />
    </Routes>
  );
}
