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
      <Sidebar />
      <div className="ml-80 max-w-5xl to-blue-gray-900 py-12">
        <Outlet />
        <ToastContainer />
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
