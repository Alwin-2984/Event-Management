// Importing required components and modules
import { useState, useEffect } from "react";
import { Card, List, ListItem, ListItemPrefix } from "@material-tailwind/react";
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
  const [selectedItem, setSelectedItem] = useState("");// Used to store the selected dashboard item
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

  return (
    <Card className="fixed top-10 h-[calc(100vh-2rem)] w-full max-w-[16.5rem] p-4 shadow-xl shadow-blue-gray-900/5">
      <div className="mb-2 p-4"></div>
      <List>
        <Link to="/Dashboard/Home">
          <ListItem
            className={selectedItem === "dashboard" ? "bg-blue-gray-50" : ""}
            onClick={() => handleItemClick("dashboard")}
          >
            <ListItemPrefix>
              <PresentationChartBarIcon className="h-5 w-5" />
            </ListItemPrefix>
            Dashboard
          </ListItem>
        </Link>
        <Link to="/Dashboard/User">
          <ListItem
            className={selectedItem === "user" ? "bg-blue-gray-50" : ""}
            onClick={() => handleItemClick("user")}
          >
            <ListItemPrefix>
              <UserCircleIcon className="h-5 w-5" />
            </ListItemPrefix>
            User
          </ListItem>
        </Link>
        <Link to="/Dashboard/Organizer">
          <ListItem
            className={selectedItem === "organizer" ? "bg-blue-gray-50" : ""}
            onClick={() => handleItemClick("organizer")}
          >
            <ListItemPrefix>
              <UserGroupIcon className="h-5 w-5" />
            </ListItemPrefix>
            Organizer
          </ListItem>
        </Link>
        <ListItem
          onClick={() => handleItemClick("event")}
          className={selectedItem === "event" ? "bg-blue-gray-50" : ""}
        >
          <ListItemPrefix>
            <CalendarDaysIcon className="h-5 w-5" />
          </ListItemPrefix>
          Event
        </ListItem>
        <ListItem
          onClick={() => handleItemClick("category")}
          className={selectedItem === "category" ? "bg-blue-gray-50" : ""}
        >
          <ListItemPrefix>
            <Square3Stack3DIcon className="h-5 w-5" />
          </ListItemPrefix>
          Category
        </ListItem>
        <ListItem
          onClick={() => handleItemClick("report")}
          className={selectedItem === "report" ? "bg-blue-gray-50" : ""}
        >
          <ListItemPrefix>
            <ExclamationTriangleIcon className="h-5 w-5" />
          </ListItemPrefix>
          Report
        </ListItem>
      </List>
    </Card>
  );
}
