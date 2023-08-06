/* eslint-disable react/prop-types */
import { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import "./header.css";
import { useNavigate } from "react-router-dom";
import { NavBar } from "./UserNavBar";
import { OrganizerNavBar } from "./OrganizerNavBar";

/**
 * 
 * @param {boolean} isOrganizer 
 * @returns 
 */
export default function Header({ isOrganizer }) {
  const navigate = useNavigate(); // React Router's navigate function for navigation

  const [open, setOpen] = useState(false); // State to control the modal visibility
  const handleOpen = () => setOpen(true); // Function to open the modal
  const handleClose = () => setOpen(false); // Function to close the modal
  const modalClose = () => {
    setOpen(false);
  };

  // Get the user's profile and token from the local storage
  const profile = JSON.parse(localStorage.getItem(isOrganizer ? "OrganizationProfile" : "Profile"));
  const token = profile?.data.accessToken;

  // Function to handle user logout
 const logout = () => {

  if (isOrganizer) {
    localStorage.removeItem("OrganizationProfile");
  } else {
    localStorage.removeItem("Profile");
  }
  
  isOrganizer ? navigate("/organizerLogin") : navigate("/dashboard"); // Navigate to the login page or Home page after logout
  window.location.reload();
};

  return (
    <header className={!isOrganizer ? "headerOrg" : "header"} >
      <nav>
        <div className="logo">
          <a href="/dashboard/home">
            Event<span className={!isOrganizer && "Wire"}>Wire</span>
          </a>
        </div>
        <div className="input" style={{ marginLeft: "10px" }}>
          <SearchIcon sx={{ marginLeft: "10px" }} />
          <input
            className="search"
            placeholder="Search"
          />
        </div>
        <input type="checkbox" id="menu-toggle" />
        <label htmlFor="menu-toggle" className="menu-icon" >
          &#9776;
        </label>
        {/*  */}
        {isOrganizer
          ? OrganizerNavBar(token, logout)
          : NavBar(token, logout, handleOpen, open, handleClose, modalClose)}
      </nav>
    </header>
  );
}
