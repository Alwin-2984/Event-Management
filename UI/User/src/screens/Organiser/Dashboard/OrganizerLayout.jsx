import { Outlet } from "react-router-dom";
import Header from "../../Components/Header/Header";

const OrganizerLayout = () => {
  return (
    <>
      <div className="sticky top-0 z-50">
        <div>
          <Header isOrganizer={true} />
        </div>
      </div>
      <Outlet />
    </>
  );
};

export default OrganizerLayout;
