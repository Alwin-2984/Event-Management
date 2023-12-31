// Importing required components and modules
import { Card, Button, Typography } from "@material-tailwind/react";
import loginCss from "./AdminLogin.module.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Components/Auth";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { adminLogin } from "../../../api/ServiceFile/ApiService";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ErrorCodes from "../../../api/ErrorCodes/ErrorCodes";
import Toaster from "../../Components/Toaster";
import { HardCodedValues } from "../../../api/HardCodedValues/HardCodedValues";
export default function AdminLogin() {
  // State variables for store Email, Password, and their respective error messages
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [emailErr, setEmailErr] = useState();
  const [passErr, setPassErr] = useState();

  // Get the navigation function from react-router-dom to programmatically navigate to different pages
  const navigate = useNavigate();

  // Get the authentication object from the Auth component
  const auth = useAuth();

  // useEffect hook to check if the user is already authenticated (logged in) and redirect them to the appropriate page accordingly
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      navigate("/Dashboard/Home", { replace: true });
    }
    if (!token) {
      navigate("/", { replace: true });
    }
  }, [auth, navigate]);

  // Event handler for handling changes in the Email input field
  const handleEmail = (e) => {
    e.preventDefault();
    const emailValue = e.target.value;
    if (emailValue === null || emailValue === "") {
      setEmailErr(HardCodedValues.EmailValidation);
    } else {
      setEmailErr("");
      setEmail(e.target.value);
    }
  };

  // Event handler for handling changes in the password input field
  const handlePassword = (e) => {
    const passValue = e.target.value;
    if (passValue === null || passValue === "") {
      setPassErr(HardCodedValues.PassValidation);
    } else {
      setPassErr("");
      setPassword(e.target.value);
    }
  };

  // Event handler for handling the form submission (Login button click)
  const handleSubmit = () => {
    if (Email.trim().length === 0) {
      setEmailErr(HardCodedValues.EmailValidation);
    }
    if (Password.trim().length === 0) {
      setPassErr(HardCodedValues.PassValidation);
    }
    if (emailErr !== "" || passErr != "") {
      return;
    }
    const body = {
      email: Email,
      password: Password,
    };

    adminLogin(body)
      .then((res) => {
        localStorage.setItem("accessToken", res?.data?.accessToken?.value);
        localStorage.setItem("refreshToken", res?.data?.refreshToken?.value);
        localStorage.setItem("email", res?.data?.email);
        localStorage.setItem("role", res?.data?.role);
        localStorage.setItem("selectedItem", "dashboard");
        auth.login();
        navigate("/Dashboard/Home", { replace: true });
      })
      .catch((err) => {
        const errCode = err.response.data.errorCode;
        if (errCode === "2032" || errCode === "2000" || errCode === "2031") {
          Toaster(ErrorCodes[errCode], 1, ["error"]);
        } else if (errCode === "2035") {
          Toaster(ErrorCodes[errCode], 1, ["error"]);
        } else if (errCode === "2050") {
          Toaster(ErrorCodes[errCode], 1, ["error"]);
        } else if (errCode === "2051") {
          Toaster(ErrorCodes[errCode], 1, ["error"]);
        } else {
          Toaster("Account not found", 1, ["error"]);
        }
      });
  };

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  return (
    <div
      className={`flex items-center justify-center h-screen bg-cover ${loginCss.loginBackground}`}
    >
      <Card shadow>
        <Typography variant="h4" className="mt-4 ml-4">
          {HardCodedValues.SignIn}
        </Typography>
        <Typography className="mt-1 ml-4 font-normal">
          {HardCodedValues.EnterDetails}
        </Typography>
        <form className="mt-8 mb-2 w-80 ml-4 mr-4 max-w-screen-lg sm:w-96">
          <div className="mb-4 flex to-blue-400 flex-col gap-6">
            {/* Input field for Email */}
            <TextField
              sx={{ backgroundColor: "#eeeeff" }}
              autoComplete="off"
              id="email"
              variant="outlined"
              label={HardCodedValues.Email}
              size="medium"
              onChange={(e) => handleEmail(e)}
            />
            {/* Display the Email error message, if any */}
            {emailErr != null && (
              <p
                style={{
                  color: "red",
                  marginTop: "-15px",
                  marginBottom: "-6px",
                  textAlign: "left",
                  marginLeft: "10px",
                }}
              >
                {emailErr}
              </p>
            )}
            {/* Input field for Password */}
            <TextField
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="off"
              sx={{ backgroundColor: "#eeeeff" }}
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      sx={{ backgroundColor: "#eeeeff" }}
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              onChange={(e) => handlePassword(e)}
              label={HardCodedValues.Password}
            />
            {/* Display the Password error message, if any */}
            {passErr != null && (
              <p
                style={{
                  color: "red",
                  marginTop: "-15px",
                  marginBottom: "-6px",
                  textAlign: "left",
                  marginLeft: "10px",
                }}
              >
                {passErr}
              </p>
            )}
          </div>
          {/* Login button */}
          <Button className="mt-6 mb-4" onClick={handleSubmit} fullWidth>
            {HardCodedValues.Login}
          </Button>
        </form>
      </Card>
      {/* ToastContainer to display toast notifications */}
      <ToastContainer />
    </div>
  );
}
