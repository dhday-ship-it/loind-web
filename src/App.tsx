import { Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage/HomePage";
import AboutPage from "./pages/AboutPage/AboutPage";
import ServicePage from "./pages/ServicePage/ServicePage";
import StoryPage from "./pages/StoryPage/StoryPage";
import StoryDetailPage from "./pages/StoryDetailPage/StoryDetailPage";
import ContactPage from "./pages/ContactPage/ContactPage";
import AdminPage from "./pages/AdminPage/AdminPage";

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
      </Route>
      <Route path="admin" element={<AdminPage />} />
    </Routes>
  );
}
