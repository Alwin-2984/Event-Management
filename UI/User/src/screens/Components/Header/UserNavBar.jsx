import HomeIcon from "@mui/icons-material/Home";
import FavoriteIcon from "@mui/icons-material/Favorite";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import HistoryIcon from "@mui/icons-material/History";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LogoutIcon from "@mui/icons-material/Logout";
import Modal from "@mui/material/Modal";
import { Box } from "@mui/material";
import LoginMidleware from "../Login/LoginMidleware";
import { NavLink } from "react-router-dom";
import "./header.css";
export function NavBar(
  token,
  logout,
  handleOpen,
  open,
  handleClose,
  modalClose
) {
  return (
    <ul className="menu" style={{ backgroundColor: "rgb(0 151 122)" }}>
      {/* Navigation links */}
      <li>
        <NavLink
          to="/dashboard/home"
          style={({ isActive }) => (isActive ? { color: "black" } : undefined)}
        >
          <HomeIcon /> Home
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/dashboard/eventDetailedView2ndTheme"
          style={({ isActive }) => (isActive ? { color: "black" } : undefined)}
        >
          <FavoriteIcon /> Favorite
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/dashboard/book"
          style={({ isActive }) => (isActive ? { color: "black" } : undefined)}
        >
          <EventAvailableIcon />
          Booked
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/dashboard/Layout4"
          style={({ isActive }) => (isActive ? { color: "black" } : undefined)}
        >
          <HistoryIcon />
          Layout4
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/dashboard/BookedEventsPro"
          style={({ isActive }) => (isActive ? { color: "black" } : undefined)}
        >
          <HistoryIcon />
          History
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/organizerLogin"
          style={({ isActive }) => (isActive ? { color: "black" } : undefined)}
        >
          <PlaylistAddIcon />
          Post Event
        </NavLink>
      </li>
      {/* Conditional rendering of "Sign In" or "Log out" based on token */}
      <li>
        {token ? (
          <a onClick={logout}>
            <LogoutIcon />
            Log out
          </a>
        ) : (
          <a onClick={handleOpen}>
            <PersonOutlineIcon />
            Sign In
          </a>
        )}
        {/* Modal for the login/sign-up process */}
        <Modal keepMounted open={open} disableAutoFocus onClose={handleClose}>
          <Box className="absolute top-0 max-lg:left-[20%]  left-[35%] h-screen w-[58vh] max-md:w-screen max-md:left-0 max-md:h-screen  bg-[#145ceb] ">
            <LoginMidleware Close={modalClose} />
          </Box>
        </Modal>
      </li>
    </ul>
  );
}
