import { Route, Routes } from "react-router-dom";
import Dashboard from "./screens/Admin/Dashboard/Dashboard/Dashboard";
import UserList from "./screens/Admin/UserList/UserList";
import CategoryList from "./screens/Admin/Category/CategoryList";
import AdminLogin from "./screens/Admin/AdminLogin/AdminLogin";
import NotFound from "./screens/Components/NotFound404";
import RequireAuth from "./screens/Components/RequireAuth";
import AdminOrganizer from "./screens/Admin/AdminOrganizer/AdminOrganizer";
import AdminHome from "./screens/Admin/AdminHomePage/AdminHome";
import EventList from "./screens/Admin/EventList/EventList";

function AppRouter() {
  const token = localStorage.getItem("accessToken");
  return (
    <Routes>
      <Route path="/" element={<AdminLogin />} />
      <Route
        path="/Dashboard"
        element={
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        }
      >
        <Route path="User" element={<UserList />} />
        <Route path="Category" element={<CategoryList />} />
        <Route path="Organizer" element={<AdminOrganizer />} />
        <Route path="Home" element={<AdminHome />} />
        <Route path="Event" element={<EventList />} />
      </Route>
      <Route path="/Login" element={<AdminLogin />} />
      <Route path="*" element={<NotFound />} />
      {!token && <Route path="/Login" element={<AdminLogin />} />}
    </Routes>
  );
}

export default AppRouter;
