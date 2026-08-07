import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout() {
  const { pathname } = useLocation();
  const variant = pathname.startsWith("/about") ? "sticky" : "static";

  return (
    <>
      <Header variant={variant} />
      <Outlet />
      <Footer />
    </>
  );
}
