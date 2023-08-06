import { toast } from "react-toastify"; 

/**
 * Display a global toast notification.
 * @param {string} message - The message to be displayed in the toast.
 * @param {number|string} id - The unique identifier for the toast.
 * @param {string} type - The type or style of the toast (e.g., "success", "error").
 */
export default function ToasterGlobal(message, id, type) {
  toast[type](message, {
    position: "top-right",
    theme: "light",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    toastId: id, // Provide a unique identifier for the toast to prevent duplication of toasters
  });
}