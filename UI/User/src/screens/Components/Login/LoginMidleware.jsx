import { useNavigate } from "react-router-dom";
import { useState } from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Login from "./Login";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import HomeIcon from "@mui/icons-material/Home";


// Function to render custom tab panel with conditional rendering of content
function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

// Function to generate accessibility props for tab elements
function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

// Main component - LoginMiddleware
// eslint-disable-next-line react/prop-types
export default function LoginMidleware({ isOrganiser, Close }) {
  const [value, setValue] = useState(0); // State for handling tab selection
  const navigate = useNavigate(); // React Router's navigate function for navigation

  // Function to handle tab change
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // Function to navigate back to the dashboard
  function BackToHome() {
    
    navigate("/dashboard");
  }

  return (
    <Box sx={{ height :"100vh",width: "100%", backgroundColor: "#F3F4F6" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        {/* Render tabs for sign-up and log-in options */}
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          centered
        >
          <Tab label="Sign Up" {...a11yProps(0)} />
          <Tab label="Log In" {...a11yProps(1)} />
        </Tabs>
      </Box>

      {/* Render a back button based on the 'isOrganiser' prop */}
      {isOrganiser ? (
        <div className=" absolute top-3 left-3">
          <HomeIcon onClick={BackToHome} />{" "}
        </div>
      ) : (
        <div className="md:hidden absolute top-3 left-3">
          <ChevronLeftIcon onClick={() => Close()} />{" "}
        </div>
      )}

      {/* Render the custom tab panels with corresponding forms */}
      <CustomTabPanel value={value} index={0}>
        <Login setValue={setValue} close={Close} isOrganiser={isOrganiser} signUp={true} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <Login close={Close} isOrganiser={isOrganiser} />
      </CustomTabPanel>
    </Box>
  );
}
