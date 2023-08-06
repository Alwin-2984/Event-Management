import * as Yup from "yup";

// Define individual Yup schemas for different fields.
const otpSchema = Yup.string()
  .length(6, "OTP must be exactly 6 characters")
  .required("OTP is required");
const nameSchema = Yup.string()
  .min(3, "Username must be at least 3 characters long")
  .max(20, "Username cannot exceed 20 characters")
  .matches(/^[a-zA-Z]+(?: [a-zA-Z]+)*$/, "Invalid characters in the username")
  .required("Username is required");

const emailSchema = Yup.string()
  .max(255, "Email cannot exceed 255 characters")
  .email("Invalid email format")
  .matches(/^\S*$/, "Email cannot contain spaces")
  .required("Email is required");

const passwordSchema = Yup.string()
  .min(8, "Enter at least 8 characters long")
  .max(24, "Cannot exceed 24 characters")
  .matches(
    /^(?=.*[a-z])/,
    "Enter at least one lowercase letter"
  )
  .matches(
    /^(?=.*[A-Z])/,
    "Enter at least one uppercase letter"
  )
  .matches(/^(?=.*\d)/, "Enter at least one digit")
  .matches(
    /^(?=.*[!@#$%^&*()+\-=._])/,
    "Enter at least one special character"
  )
  .required("Password is required");

/**
 * Generate a Yup validation schema based on different scenarios.
 * @param {boolean} signUp - Determines whether the user is signing up.
 * @param {boolean} isOrganiser - Determines whether the user is an organizer.
 * @param {boolean} forgotPassword - Determines whether the user is recovering password.
 * @param {boolean} changepasswordSwitch - Determines whether the user is changing password.
 * @returns {Yup.Schema} - Generated Yup validation schema.
 */
export function yupValidation(
  signUp,
  isOrganiser,
  forgotPassword,
  changepasswordSwitch
) {
  let schema = {};

  if (signUp) {
    // Define validation schema for sign up.
    schema = {
      name: nameSchema,
      email: emailSchema,
      password: passwordSchema,
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Confirm Password is required"),
    };

    if (!isOrganiser) {
      // Schema for date of birth validation.
      schema.gender = Yup.string().required("Gender is required");
      schema.dob = Yup.date()
        .min(new Date(1900, 0, 1), "Date of birth cannot be before 1900")
        .max(new Date(), "Date of birth cannot be in the future")
        .required("Enter a valid date");
    }
  } else if (forgotPassword) {
    if (changepasswordSwitch) {
      // Define validation schema for changing password after OTP verification.
      schema = {
        otp: otpSchema,
        password: passwordSchema,
        confirmPassword: Yup.string()
          .oneOf([Yup.ref("password"), null], "Passwords must match")
          .required("Confirm Password is required"),
      };
    } else {
      // Define validation schema for requesting a password reset.
      schema = {
        email: emailSchema,
      };
    }
  } else {
    // Define validation schema for regular login.
    schema = {
      email: emailSchema,
      password: passwordSchema,
    };
  }

  return Yup.object(schema);
}
