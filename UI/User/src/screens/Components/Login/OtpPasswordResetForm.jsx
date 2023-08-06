/* eslint-disable react/prop-types */


import { Formik, Form} from "formik"; // Import necessary modules
import { FormField } from "./FormField"; // Import necessary modules
import { useState } from "react";
import { PiEyeLight, PiEyeSlashLight } from "react-icons/pi";



// Main form rendering function using Formik
export function OtpPasswordResetForm({
  initialValues,
  validationSchema,
  handleSubmit,
}) {
  return Forms(initialValues, validationSchema, handleSubmit);
}

function Forms(initialValues, validationSchema, handleSubmit) {
  const [show, setShow] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      <Form>
        <FormField
          label="please enter the otp,dont refresh the page"
          name="otp"
          type="number"
        />

        <div className="relative w-full">
          <div className="absolute inset-y-0 right-0 flex items-center px-2">
            {show ? (
              <PiEyeLight onClick={() => setShow(!show)} />
            ) : (
              <PiEyeSlashLight onClick={() => setShow(!show)} />
            )}
          </div>
          <FormField
            label="Password"
            name="password"
            type={show ? "text" : "password"}
          />
        </div>

        <div className="relative w-full">
          <div className="absolute inset-y-0 right-0 flex items-center px-2">
            {showConfirm ? (
              <PiEyeLight onClick={() => setShowConfirm(!showConfirm)} />
            ) : (
              <PiEyeSlashLight onClick={() => setShowConfirm(!showConfirm)} />
            )}
          </div>
          <FormField
            label="Confirm Password"
            name="confirmPassword"
            type={showConfirm ? "text" : "password"}
          />
        </div>

        <button
          type="submit"
          className="transition duration-200 bg-blue-500 hover:bg-blue-600 focus:bg-blue-700 focus:shadow-sm focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 text-white w-full py-2.5 rounded-lg text-sm shadow-sm hover:shadow-md font-semibold text-center inline-block"
        >
          <span className="inline-block mr-2">Change Password</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-4 h-4 inline-block"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </button>
      </Form>
    </Formik>
  );
}
