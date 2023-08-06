/* eslint-disable react/prop-types */

import { Formik, Form, Field, ErrorMessage } from "formik"; // Import necessary modules
import { useState } from "react";
import { PiEyeLight, PiEyeSlashLight } from "react-icons/pi";
import { FormField } from "../../Components/Login/FormField";

// Custom component for rendering select fields with labels and error messages
const SelectField = ({ label, name, options, ...rest }) => (
  <div className="min-h-[100px]">
    <label className="font-semibold text-sm text-gray-600 pb-1 block select-none">
      {label}
    </label>
    <Field
      name={name}
      as="select"
      className="border rounded-lg px-3 py-2 mt-1 mb-2 text-sm w-full"
      {...rest}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </Field>
    <ErrorMessage
      name={name}
      component="div"
      className="text-red-500 text-sm"
    />
  </div>
);

// Main form rendering function using Formik
export function RegistrationForm({
  initialValues,
  validationSchema,
  handleSubmit,
}) {
  const [show, setShow] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}

    >
        {({ setFieldValue ,values}) => (
      <Form>
        <FormField  label="Name" name="name" type="text" />
        <SelectField
          label="Gender"
          name="gender"
          options={[
            { value: "", label: "select" },
            { value: "0", label: "Male" },
            { value: "1", label: "Female" },
            { value: "2", label: "Other" },
          ]}
        />
        <FormField values={values} setFieldValue={setFieldValue} label="dob" name="dob" type="date" />

        <FormField label="E-mail" name="email" type="email" />

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
          <span className="inline-block mr-2">Register</span>
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
      </Form>)}
    </Formik>
  );
}
