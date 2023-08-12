// Importing required components and modules
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import Sidebar from "../Sidebar/Sidebar";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Dashboard = () => {
  return (
    <div>
      {/* added header,sidebar,outlet and footer component to display in dashboard */}
      <Header />
      <div className="lg:flex">
        {/* Sidebar */}
        <Sidebar />

        <div className="lg:flex-1 min-w-0 px-4 py-12 md:ml-80">
          {/* Content Area */}
          <Outlet />
          <ToastContainer />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
