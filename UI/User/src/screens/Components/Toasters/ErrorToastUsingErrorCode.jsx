import ToasterGlobal from "./ToasterGlobal"; // Import the ToasterGlobal function for displaying toast notifications.
import errorCodes from "../../../API/ErrorCodes/ErrorCode"; // Import the errorCodes object that maps error codes to error messages.

/**
 * Display an error toast using an error code.
 * @param {Error} err - The error object containing response data.
 */
export function   ErrorToastUsingErrorCode(err) {
  // Get the error message based on the error code from errorCodes object,
  // or use the error message from the response data, or a default message.
  const errorMessage =
    errorCodes[err.response.data.errorCode] ||
    err.response.data.errorMessage ||
    "Unknown error occurred";

  // Display a toast notification with the error message and appropriate styling.
  // The second argument is toastId.
  // The third argument (["error"]) is the style of the toaster
  ToasterGlobal(errorMessage, 405, ["error"]);
}
