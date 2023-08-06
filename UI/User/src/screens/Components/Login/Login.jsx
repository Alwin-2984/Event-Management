
// Import required modules and components
import PropTypes from "prop-types"
import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import ToasterGlobal from "../Toasters/ToasterGlobal";
import OtpComponent from "./OtpComponent";
import { yupValidation } from "./yupValidation";
import { initialValuesFunction } from "./initialValuesFunction";
import {
  ChangePasswordApi,
  GoogleAuthApi,
  OtpVerifyApi,
  RegistrationAndLogin,
  forgotPasswordOtpSend,
  verifyForgotPassword,
} from "../../../API/ApiService/ApiServices";
import DynamicForm from "./DynamicForm";
import { ErrorToastUsingErrorCode } from "../Toasters/ErrorToastUsingErrorCode";

// Define the Login component, which accepts 'signUp' and 'isOrganiser' as props
function Login({ setValue, close, signUp, isOrganiser }) {
  const navigate = useNavigate();
  const [emailTocken, setEmailTocken] = useState();
  const [otpComponentSwitch, setOtpComponentSwitch] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [changepasswordSwitch, setChangepasswordSwitch] = useState(false);
  const [apiCallInProgress, setApiCallInProgress] = useState(false);

  // Generate initial form values and validation schema based on 'signUp' and 'isOrganiser' props
  const initialValues = initialValuesFunction(signUp, isOrganiser);
  const validationSchema = yupValidation(
    signUp,
    isOrganiser,
    forgotPassword,
    changepasswordSwitch
  );

  // Function to handle form submission
  const handleSubmit = async (values) => {
    if (apiCallInProgress) {
      return; // Don't proceed if an API call is already in progress
    }

    if (forgotPassword) {
      setApiCallInProgress(true);
      await forgotPasswordOtpSendApi(
        values,
        setEmailTocken,
        setChangepasswordSwitch
      );
      setApiCallInProgress(false);
    } else {
      setApiCallInProgress(true);
      // eslint-disable-next-line no-unused-vars
      const { confirmPassword, ...userData } = values;
      await regostrationAndLoginApi(
        userData,
        signUp,
        isOrganiser,
        setEmailTocken,
        setOtpComponentSwitch,
        navigate,
        close
      );
      setApiCallInProgress(false);
    }
  };

  /**OTO Password confirm Api */
  const handleSubmitConfirm = async (otpData) => {
    if (apiCallInProgress) {
      return; // Don't proceed if an API call is already in progress
    } else {
      setApiCallInProgress(true);
    }
    const otpDataBody = {
      otp: otpData.otp,
      emailToken: emailTocken,
    };

    await OtpPasswordConfirmApi(
      otpDataBody,
      otpData,
      setOtpComponentSwitch,
      setForgotPassword,
      setChangepasswordSwitch
    );
    setApiCallInProgress(false);
  };

  /**  Function to handle OTP form submission*/
  const OtpSubmit = async (value) => {
    if (apiCallInProgress) {
      return; // Don't proceed if an API call is already in progress
    }
    const otpBody = {
      emailToken: emailTocken,
      otp: value.otp,
    };
    setApiCallInProgress(true);

    await SendOtpForForgotPasswordApi(
      isOrganiser,
      otpBody,
      setOtpComponentSwitch,
      setValue
    );
    setApiCallInProgress(false);
  };

  // Function to handle Google OAuth response success
  const responseMessage = async (response) => {
    const body = {
      credential: response.credential,
    };
    await GoogleLoginApi(body, close);
  };

  // Function to handle Google OAuth response error
  const errorMessage = (err) => {
    ErrorToastUsingErrorCode(err);
  };

  return (
    <>
      {otpComponentSwitch || changepasswordSwitch ? (
        <OtpComponent
          forgotPassword={forgotPassword}
          otpSubmit={OtpSubmit}
          signUp={signUp}
          isOrganiser={isOrganiser}
          changepasswordSwitch={changepasswordSwitch}
          handleSubmitConfirm={handleSubmitConfirm} />
      ) : (
        <div className=" bg-gray-100 flex flex-col justify-center sm:py-0 py-0 h-[90vh]">
          <div className="p-10 xs:p-0 max-sm:mx-[2vw] max-md:mx-[7vw] mx-auto md:w-full md:max-w-md">
            <div className="bg-white shadow w-full rounded-lg divide-y divide-gray-200">
              <div className="px-5 py-7">
                <div className="font-bold text-center text-2xl mb-3">
                  <div className="logo">
                    <h3 className="font-semibold text-xl text-gray-600">
                      Event
                      <span className="font-semibold text-xl text-violet-700">
                        Wire
                      </span>
                      {isOrganiser && <>&nbsp;Organiser</>}
                    </h3>
                  </div>
                </div>
                <DynamicForm
                  signUp={signUp}
                  isOrganiser={isOrganiser}
                  forgotPassword={forgotPassword}
                  handleSubmit={handleSubmit}
                  initialValues={initialValues}
                  validationSchema={validationSchema} />
                {!forgotPassword && !signUp && (
                  <div
                    className="flex justify-end text-sm pt-2"
                    onClick={() => setForgotPassword(true)}
                  >
                    forgotPassword
                  </div>
                )}
              </div>
              {!isOrganiser && !forgotPassword && (
                <div className="p-5">
                  <div className="grid justify-center  gap-1">
                    <GoogleLogin
                      onSuccess={responseMessage}
                      onError={errorMessage} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

Login.propTypes = {
  close: PropTypes.any,
  isOrganiser: PropTypes.any,
  setValue: PropTypes.any,
  signUp: PropTypes.any
}

export default Login;

async function GoogleLoginApi(body, close) {
  try {
    const response = await GoogleAuthApi(body);
    localStorage.setItem("Profile", JSON.stringify(response));
    close();
    window.location.reload(); /**Refreshing For extra security  */
  } catch (err) {
    // Handle errors in form submission
    ErrorToastUsingErrorCode(err);
  }
}

async function SendOtpForForgotPasswordApi(
  isOrganiser,
  otpBody,
  setOtpComponentSwitch,
  setValue
) {
  try {
    await OtpVerifyApi(isOrganiser, otpBody);

    // Handle successful OTP verification
    ToasterGlobal("Registration successfull", 407, ["success"]);
    setOtpComponentSwitch(false); // Hide the OTP component after successful verification
    setValue(1);
  } catch (err) {
    // Handle errors in form submission
    ErrorToastUsingErrorCode(err);
  }
}

async function OtpPasswordConfirmApi(
  otpDataBody,
  otpData,
  setOtpComponentSwitch,
  setForgotPassword,
  setChangepasswordSwitch
) {
  try {
    /**OTP Verification */
    const response = await verifyForgotPassword(otpDataBody);
    /**Password Confirmation */
    await ChangePasswordApi(response, otpData);
    ToasterGlobal("Password changed successfully", 407, ["success"]);
    setOtpComponentSwitch(false);
    setForgotPassword(false);
    setChangepasswordSwitch(false);
  } catch (err) {
    // Handle errors in form submission
    ErrorToastUsingErrorCode(err);
  }
}

async function forgotPasswordOtpSendApi(
  values,
  setEmailTocken,
  setChangepasswordSwitch
) {
  try {
    const response = await forgotPasswordOtpSend(values);

    setEmailTocken(response?.data?.emailToken);
    setChangepasswordSwitch(true);
  } catch (err) {
    // Handle errors in form submission
    ErrorToastUsingErrorCode(err);
  }
}

async function regostrationAndLoginApi(
  userData,
  signUp,
  isOrganiser,
  setEmailTocken,
  setOtpComponentSwitch,
  navigate,
  close
) {
  try {
    const response = await RegistrationAndLogin(userData, signUp, isOrganiser);

    const storageKey = isOrganiser ? "OrganizationProfile" : "Profile";
    const navigatePath = isOrganiser ? "/Organiser/app" : "/dashboard";

    // Handle successful form submission
    setEmailTocken(response?.data?.emailToken);
    // Store the response data in local storage
    localStorage.setItem(storageKey, JSON.stringify(response));

    if (signUp) {
      ToasterGlobal("OTP Send Successfully", 407, ["success"]);
      setOtpComponentSwitch(true);
    } else {
      navigate(navigatePath);
      close();
      window.location.reload(); /**Refreshing For extra security  */
    }
  } catch (err) {
    // Handle errors in form submission
    ErrorToastUsingErrorCode(err);
  }
}
