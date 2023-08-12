import React, { useState, useEffect } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Formik, Field, ErrorMessage } from "formik"; // Import Field and ErrorMessage
import * as Yup from "yup";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import {
  addCategoryAPI,
  updateCategoryAPI,
} from "../../../api/ServiceFile/ApiService";
import { toast } from "react-toastify";
import ErrorCodes from "../../../api/ErrorCodes/ErrorCodes";
import Toaster from "../../Components/Toaster";
import { HardCodedValues } from "../../../api/HardCodedValues/HardCodedValues";

//Validation schema for category
const validationSchema = Yup.object().shape({
  categoryName: Yup.string()
    .matches(
      /^[A-Za-z]+(?:\s[A-Za-z]+)*$/,
      "Single whitespace and alphabets are only allowed"
    )
    .min(3, "Minimum length is 3 characters.")
    .max(50, "Maximum length is 50 characters.")
    .required("Category name is required."),
});

const CategoryModal = ({ open, handleClose, editData, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [category, setCategory] = useState({ categoryName: "" });
  useEffect(() => {
    if (editData) {
      setCategory({ categoryName: editData.data.name });
    } else {
      setCategory({ categoryName: "" });
    }
  }, [editData]); // Set categoryname in form

  // Handle submit for both add and edit
  const handleCategorySubmit = async (values) => {
    try {
      setIsLoading(true);
      if (editData) {
        await updateCategoryAPI(editData.data.id, {
          name: values.categoryName,
        });
        onSuccess();
        toast.success("Category updated successfully", {
          toastId: 2,
          position: "top-center",
          autoClose: 3000,
        });
      } else {
        await addCategoryAPI({ name: values.categoryName });
        onSuccess();
        toast.success("Category added successfully", {
          toastId: 2,
          position: "top-center",
          autoClose: 3000,
        });
      }
      setCategory({ categoryName: "" });

      handleClose();
      setIsLoading(false);
    } catch (err) {
      const errCode = err?.response?.data?.errorCode;
      if (errCode === "2009") {
        setServerError(ErrorCodes[errCode]);
      } else {
        Toaster(HardCodedValues.UnknownErrVal, 1, ["error"]);
      }
      setIsLoading(false);
    }
  };

  // Handling closing modal with reseting values
  const handleCloseWithReset = () => {
    setServerError(null); // Reset serverError
    setCategory({ categoryName: "" }); // Reset category
    handleClose(); // Close the modal
  };

  // Handling category name change
  const handleCategoryNameChange = (e) => {
    const { value } = e.target;
    setCategory({ categoryName: value });
    setServerError(null); // Clear serverError when category name changes
  };
  return (
    <Modal open={open} onClose={handleCloseWithReset}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          minWidth: 400,
        }}
      >
        <Typography variant="h6" component="h2">
          {/* Set Text according to satate*/}
          {editData
            ? HardCodedValues.EditCategory
            : HardCodedValues.AddCategory}
        </Typography>

        <Formik
          enableReinitialize={true}
          initialValues={category}
          validationSchema={validationSchema}
          onSubmit={handleCategorySubmit}
          validateOnChange
        >
          {({
            handleSubmit,
            getFieldProps,
            setFieldValue,
            touched,
            errors,
          }) => (
            <form onSubmit={handleSubmit}>
              <Field
                as={TextField}
                fullWidth
                onChange={handleCategoryNameChange}
                label={HardCodedValues.CategoryName}
                name="categoryName"
                error={touched.categoryName && Boolean(errors.categoryName)}
                helperText={
                  <>
                    <ErrorMessage name="categoryName" />
                    {serverError && (
                      <span style={{ color: "red", marginLeft: "8px" }}>
                        {serverError}
                      </span>
                    )}
                  </>
                }
              />

              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ mr: 2 }}
                  disabled={isLoading}
                >
                  {HardCodedValues.Submit}
                </Button>
                <Button onClick={handleCloseWithReset} variant="outlined">
                  {HardCodedValues.Close}
                </Button>
              </Box>
            </form>
          )}
        </Formik>
      </Box>
    </Modal>
  );
};

export default CategoryModal;
