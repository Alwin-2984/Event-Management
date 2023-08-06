import Header from "../../Components/Header/Header";
import { Outlet } from "react-router-dom";
const UserLayout = () => {
  return (
    <>
      <div className="sticky top-0 z-50">
        <div>
          <Header />
        </div>
      </div>
      <Outlet />
    </>
  );
};

export default UserLayout;
