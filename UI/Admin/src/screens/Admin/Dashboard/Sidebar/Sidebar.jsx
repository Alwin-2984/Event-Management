// Importing required components and modules
import { useState, useEffect } from "react";
import {
  Card,
  List,
  ListItem,
  ListItemPrefix,
  IconButton,
} from "@material-tailwind/react";
import {
  PresentationChartBarIcon,
  UserCircleIcon,
  UserGroupIcon,
  CalendarDaysIcon,
  Square3Stack3DIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/solid";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const [selectedItem, setSelectedItem] = useState(""); // Used to store the selected dashboard item
  const location = useLocation(); // Used to get the current location in order to change the dashboard highlight when routing
  // According to the url setting the dashboard item
  const mapPathToSelectedItem = (path) => {
    switch (path) {
      case "/Dashboard/Home":
        return "dashboard";
      case "/Dashboard/User":
        return "user";
      case "/Dashboard/Organizer":
        return "organizer";
      case "/Dashboard/Event":
        return "event";
      case "/Dashboard/Category":
        return "category";
      case "/Dashboard/Report":
        return "report";
      default:
        return "";
    }
  };

  // Function to handle item selection
  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  // Load the previously selected item from localStorage on component rendering
  useEffect(() => {
    const storedSelectedItem = localStorage.getItem("selectedItem");
    if (storedSelectedItem) {
      setSelectedItem(storedSelectedItem);
    }
  }, []);

  useEffect(() => {
    return () => {
      setSelectedItem("");
    };
  }, []);
  // Change the dashboard highlight according to the routing
  useEffect(() => {
    handleItemClick(mapPathToSelectedItem(location.pathname));
  }, [location.pathname]);

  // Save the selected item to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("selectedItem", selectedItem);
  }, [selectedItem]);

  const [openNav, setOpenNav] = useState(false);

  const hanldeDashboard = () => {
    setOpenNav(!openNav);
  };

  // Reusable function to render the sidebar content
  // eslint-disable-next-line react/prop-types
  const DashboardItem = ({ to, label, icon, selected, onClick }) => (
    <Link to={to}>
      <ListItem className={selected ? "bg-blue-gray-50" : ""} onClick={onClick}>
        <ListItemPrefix>{icon}</ListItemPrefix>
        {label}
      </ListItem>
    </Link>
  );

  // Side bar contents
  const SidebarContent = () => (
    <List>
      <DashboardItem
        to="/Dashboard/Home"
        label="Dashboard"
        icon={<PresentationChartBarIcon className="h-5 w-5" />}
        selected={selectedItem === "dashboard"}
        onClick={() => handleItemClick("dashboard")}
      />
      <DashboardItem
        to="/Dashboard/User"
        label="User"
        icon={<UserCircleIcon className="h-5 w-5" />}
        selected={selectedItem === "user"}
        onClick={() => handleItemClick("user")}
      />
      <DashboardItem
        to="/Dashboard/Organizer"
        label="Organizer"
        icon={<UserGroupIcon className="h-5 w-5" />}
        selected={selectedItem === "organizer"}
        onClick={() => handleItemClick("organizer")}
      />
      <DashboardItem
        to="/Dashboard/Event"
        label="Event"
        icon={<CalendarDaysIcon className="h-5 w-5" />}
        selected={selectedItem === "event"}
        onClick={() => handleItemClick("event")}
      />
      <DashboardItem
        to="/Dashboard/Category"
        label="Category"
        icon={<Square3Stack3DIcon className="h-5 w-5" />}
        selected={selectedItem === "category"}
        onClick={() => handleItemClick("category")}
      />
      <DashboardItem
        to="/Dashboard/Report"
        label="Report"
        icon={<ExclamationTriangleIcon className="h-5 w-5" />}
        selected={selectedItem === "report"}
        onClick={() => handleItemClick("report")}
      />
    </List>
  );

  const DashboardMobileviewIcon = () => (
    <IconButton
      variant="text"
      className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent md:hidden"
      ripple={false}
      onClick={() => hanldeDashboard()}
    >
      {openNav ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          className="h-6 w-6"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      )}
    </IconButton>
  );

  return (
    <div>
      {/* Displaying the sidebar menu */}
      <Card className="hidden md:block fixed top-10 h-[calc(100vh-2rem)] w-full max-w-[16.5rem] p-4 shadow-xl shadow-blue-gray-900/5">
        <div className="mb-2 p-4"></div>
        <SidebarContent />
      </Card>
      {/* Displaying the Hamburger button in mobile view*/}
      <DashboardMobileviewIcon />
      {/* showing the dashboard according to the hamburger button and close button */}
      {openNav && (
        <Card className="fixed top-10 h-[calc(100vh-2rem)] w-full max-w-[16.5rem] p-4 shadow-xl shadow-blue-gray-900/5">
          <div className="mb-2 p-4"></div>
          <DashboardMobileviewIcon />
          <SidebarContent />
        </Card>
      )}
    </div>
  );
}
