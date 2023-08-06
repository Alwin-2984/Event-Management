/* eslint-disable react/prop-types */

import { OtpPasswordResetForm } from "./OtpPasswordResetForm";
import { RegistrationOtpConfirmationForm } from "./RegistrationOtpConfirmationForm";
import { yupValidation } from "./yupValidation";

const OtpComponent = ({
  otpSubmit,
  changepasswordSwitch,
  signUp,
  isOrganiser,
  forgotPassword,
  handleSubmitConfirm,
}) => {
  const validationSchema = yupValidation(
    signUp,
    isOrganiser,
    forgotPassword,
    changepasswordSwitch
  );

  const handleSubmit = (values) => {
    // eslint-disable-next-line no-unused-vars
    const { confirmPassword, ...otpData } = values;

    handleSubmitConfirm(otpData);
  };

  return (
    <div className=" bg-gray-100 flex flex-col justify-center sm:py-12 h-[100%]">
      <div className="p-10 xs:p-0 mx-auto md:w-full md:max-w-md">
        <div className="bg-white shadow w-full rounded-lg divide-y divide-gray-200">
          <div className="px-5 py-7">
            <div className="font-bold text-center text-2xl mb-3">
              <div className="logo">
                <h3 className="font-semibold text-xl text-gray-600">
                  Event
                  <span className="font-semibold text-xl text-violet-700">
                    Wire
                  </span>
                </h3>
              </div>
              <div className="min-h-[100px]">
                {!changepasswordSwitch && !forgotPassword ? (
                  <RegistrationOtpConfirmationForm
                    initialValues={{
                      otp: "",
                    }}
                    handleSubmit={otpSubmit}
                  />
                ) : (
                  <OtpPasswordResetForm
                    initialValues={{
                      password: "",
                      otp: "",
                      confirmPassword: "",
                    }}
                    validationSchema={validationSchema}
                    handleSubmit={handleSubmit}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtpComponent;
