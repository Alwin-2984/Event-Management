/* eslint-disable react/prop-types */

import { Formik, Form} from "formik"; // Import necessary modules
import { FormField } from "./FormField";


// Main form rendering function using Formik
/**
 * Renders a form using Formik with email and password fields.
 * @param {Object} props - Component properties.
 * @param {Object} props.initialValues - Initial values for the form fields.
 * @param {Object} props.validationSchema - Validation schema for the form fields.
 * @param {function} props.handleSubmit - The form submission handler.
 * @returns {JSX.Element} - Rendered form component.
 */
export function ForgotPasswordOtpSendForm({initialValues, validationSchema, handleSubmit}) {
  return   (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      <Form>
        <FormField label="E-mail" name="email" type="email" />

        <button
          type="submit"
          className="transition duration-200 bg-blue-500 hover:bg-blue-600 focus:bg-blue-700 focus:shadow-sm focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 text-white w-full py-2.5 rounded-lg text-sm shadow-sm hover:shadow-md font-semibold text-center inline-block"
        >
          <span className="inline-block mr-2">Send Otp</span>
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


