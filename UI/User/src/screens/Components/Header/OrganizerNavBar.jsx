import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import HistoryIcon from "@mui/icons-material/History";
import HomeIcon from "@mui/icons-material/Home";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import { BsCalendar2Plus } from "react-icons/bs";
import { TbCalendarCancel } from "react-icons/tb";
import { NavLink } from "react-router-dom";

export function OrganizerNavBar(token, logout) {
  return (
    <ul className="menu" style={{ backgroundColor: "rgb(21,20,24)" }}>
      <li>
        <NavLink
          to="/Organiser/app"
          style={({ isActive }) => (isActive ? { color: "#8739FA" } : undefined)}
        >
          <HomeIcon /> Home
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/dashboard/home2"
          style={({ isActive }) => (isActive ? { color: "#8739FA" } : undefined)}
        >
          <BsCalendar2Plus size={"1.3rem"} /> Add 
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/Organiser/UpcomingEvent"
          style={({ isActive }) => (isActive ? { color: "#8739FA" } : undefined)}
        >
          <EventAvailableIcon />
          Upocoming 
        </NavLink>
      </li>
      <li>
          <NavLink
            to="/dashboard/home"
            style={({ isActive }) =>
              isActive ? { color: "black" } : undefined
            }
          >
            <HistoryIcon />
             History
          </NavLink>
      </li>
      <li>
          <NavLink
            to="/organizerLogin"
            style={({ isActive }) =>
              isActive ? { color: "black" } : undefined
            }
          >
            <TbCalendarCancel size={"1.3rem"} />
            Cancelled 
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
          <a href="/organizerLogin">
            <PersonOutlineIcon />
            Sign In
          </a>
        )}
        {/* Modal for the login/sign-up process */}
      </li>
    </ul>
  );
}
