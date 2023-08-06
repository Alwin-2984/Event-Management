import PropTypes from "prop-types";
import { Field, ErrorMessage } from "formik";
import DatePicker from "react-date-picker";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
/**
 * Custom component for rendering form fields with labels and error messages.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.label - The label for the form field.
 * @param {string} props.name - The name attribute for the form field.
 * @param {string} props.type - The type attribute for the form field.
 * @returns {JSX.Element} - Rendered form field component.
 */
// eslint-disable-next-line react/prop-types
export const FormField = ({ values, setFieldValue, label, name, type }) => {
  return (
    <div className="min-h-[100px]">
      <label className="font-semibold text-sm text-gray-600 pb-1 block">
        {label}
      </label>

      {type === "date" ? (
        <DatePicker
          name={name}
          value={values.dob}
          onChange={(date) => {
            setFieldValue("dob", date);
            console.log(values, "valuesvalues");
          }}
          minDate={new Date(1900, 0, 1)}
          maxDate={new Date()}
          openCalendarOnFocus
          className="border rounded-lg px-3 py-2 mt-1 mb-2 text-sm w-full"
        />
      ) : (
        <Field
          name={name}
          type={type}
          className="border rounded-lg px-3 py-2 mt-1 mb-2 text-sm w-full"
        />
      )}
      <ErrorMessage
        name={name}
        component="div"
        className="text-red-500 text-sm"
      />
    </div>
  );
};

FormField.propTypes = {
  label: PropTypes.any,
  name: PropTypes.any,
  setFieldValue: PropTypes.func,
  type: PropTypes.string,
  values: PropTypes.shape({
    dob: PropTypes.any,
  }),
};
