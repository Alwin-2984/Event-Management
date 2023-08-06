// Importing required components and modules
import { useNavigate } from "react-router-dom";
import {
  Navbar,
  Typography,
  Avatar,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
import { useAuth } from "../../../Components/Auth";
import { Link } from "react-router-dom";

export default function Example() {
  const navigate = useNavigate();
  const auth = useAuth();

  // Function to handle user logout
  const Logout = () => {
    localStorage.clear();
    navigate("/");
    auth.logout();
  };

  return (
    <>
      {/* The top navigation bar */}
      <Navbar className="sticky top-0 z-50 h-max max-w-full rounded-none py-2 px-4 lg:px-8 lg:py-4 bg-white shadow">
        <div className="flex items-center justify-between text-blue-gray-900">
          <Link
            to="/Dashboard/home"
            className="mr-4 cursor-pointer flex items-center py-1.5 font-medium"
          >
            <img
              className="w-10 h-10 mr-2"
              src="/src/assets/birdlogo.png"
              alt="nature image"
            />
            <span className="text-cyan-600">Event Management</span>
          </Link>
          <div className="flex items-center gap-4">
            {/* User avatar */}
            <Typography
              as="li"
              variant="small"
              color="blue-gray"
              className="p-1 font-normal flex items-center justify-between"
            >
              <Avatar
                src="/src/assets/buddha.jpg"
                withBorder={true}
                color="gray"
                size="sm"
                alt="avatar"
              />
              <Menu>
                {/* MenuHandler is the trigger element for the user menu */}
                <MenuHandler>
                  <a
                    href="#"
                    className="flex items-center mr-1 ml-2 font-extrabold text-base"
                  >
                    ADMIN
                  </a>
                </MenuHandler>
                {/* MenuList contains the items/options in the user menu */}
                <MenuList>
                  {/* Menu item to handle user logout */}
                  <MenuItem onClick={Logout}>Logout</MenuItem>
                </MenuList>
              </Menu>
            </Typography>
          </div>
        </div>
      </Navbar>
    </>
  );
}
