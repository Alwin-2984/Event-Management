import DeleteIcon from "@mui/icons-material/Delete";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import IconButton from "@mui/material/IconButton";
import Pagination from "@mui/material/Pagination";
import Paper from "@mui/material/Paper";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableSortLabel from "@mui/material/TableSortLabel";
import { visuallyHidden } from "@mui/utils";
import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import FilterListIcon from "@mui/icons-material/FilterList";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import CategoryModal from "./CategoryModal";

import {
  listCategoryAPI,
  deleteCategoryAPI,
  getCategoryAPI,
} from "../../../api/ServiceFile/ApiService";

import {
  Box,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Button,
  TextField,
  Typography,
} from "@mui/material";
import { HardCodedValues } from "../../../api/HardCodedValues/HardCodedValues";

// Define table headings
const headCells = [
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: HardCodedValues.CategoryName,
  },
  {
    id: "Edit",
    numeric: true,
    disablePadding: false,
    disableSorting: true,
    label: HardCodedValues.Edit,
  },
  {
    id: "Delete",
    numeric: true,
    disablePadding: false,
    disableSorting: true,
    label: HardCodedValues.Delete,
  },
];
// Function to render the table head with sorting functionality
function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort, setParams } = props;

  // Function to handle sorting when table column headers are clicked
  const createSortHandler = (property) => () => {
    const isAsc = orderBy === property && order === "asc";
    const newOrder = isAsc ? "desc" : "asc";
    const newAPIorder = isAsc ? 1 : 0;
    // Update sorting parameters
    setParams((prevParams) => ({
      ...prevParams,
      sort: property,
      order: newAPIorder,
    }));
    // Request sorting of data
    onRequestSort(newOrder, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell
          style={{
            backgroundColor: "rgb(155 209 242)",
            color: "black",
            padding: "6px",
            height: "50px",
          }}
        />
        {headCells.map((headCell) => (
          <TableCell
            style={{
              backgroundColor: "rgb(155 209 242)",
              color: "black",
              padding: "6px",
              height: "50px",
            }}
            key={headCell.id}
            align="left"
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {/* Table column header with sorting functionality */}
            <TableSortLabel
              disabled={headCell.disableSorting}
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id && (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              )}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
  setParams: PropTypes.func.isRequired,
};

// Define the category component
const CategoryList = () => {
  // State variables used in the component
  const [order, setOrder] = React.useState("asc"); // Variable to store asc or desc
  const [orderBy, setOrderBy] = React.useState(""); // Variable to store column heading name
  const [searchValue, setSearchValue] = useState({ search: "" }); // Variable to store searched values temporarily
  const [data, setData] = useState([]); // variable to store data for list categories from api
  const [details, setDetails] = useState(null); // variable to store response from list category api
  const [params, setParams] = useState({
    page: 1,
    search: "",
    size: 10,
    sort: "updatedAt",
    order: 1,
  }); // parameters for list api
  const [editCategoryData, setEditCategoryData] = useState(null);
  const handleEditOpen = async (categoryId) => {
    const categoryToEdit = await getCategoryAPI(categoryId);
    setEditCategoryData(categoryToEdit);
    setOpen(true); // Open the edit modal
  };

  const [show, setShow] = useState(false); // for open and closing of search div
  // UseEffect to fetch the category list when the parameters change
  useEffect(() => {
    listCategories();
  }, [params]);

  // Function to fetch the list of categories
  const listCategories = async () => {
    await listCategoryAPI(params)
      .then((res) => {
        setDetails(res?.data);
        setData(res?.data?.result);
      })
      .catch((err) => {
        const errCode = err?.response?.data?.errorCode;
        if (errCode === "7001") {
          toast.error("Page must be a natural number", {
            toastId: 1,
            position: "top-center",
            autoClose: 3000,
          });
        } else if (errCode === "7002") {
          toast.error("Size must be a natural number", {
            toastId: 1,
            position: "top-center",
            autoClose: 3000,
          });
        } else if (errCode === "7005") {
          toast.error("Sort Direction must be 'ASC' or 'DESC", {
            toastId: 1,
            position: "top-center",
            autoClose: 3000,
          });
        } else {
          toast.error("Something went wrong!", {
            toastId: 1,
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        }
      });
  };

  // Function to delete a category
  const handleDeleteCategory = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((response) => {
      if (response.isConfirmed) {
        deleteCategoryAPI(id).then(() => {
          ClearData();
          toast.success("Category deleted successfully", {
            toastId: 2,
            position: "top-center",
            autoClose: 3000,
          });
        });
      }
    });
  };

  // Function to handle sorting of the table
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  // Function to handle pagination page change
  const handleChangePage = (event, newPage) => {
    setParams((prevParams) => ({ ...prevParams, page: newPage }));
  };

  // Function to clear search fields and close the search bar
  const handleCloseSearch = () => {
    setShow((prev) => !prev);
    ClearData();
  };

  // Function to handle search input
  const handleSearch = (name, e) => {
    const value = e.target?.value;
    setSearchValue({ ...searchValue, [name]: value });
  };

  // Function to clear search fields
  const ClearData = () => {
    const inputFields = document.getElementsByTagName("input");

    for (const inputField of inputFields) {
      inputField.value = "";
    }
    setParams((prevParams) => ({
      ...prevParams,
      page: 1,
      search: "",
    }));
  };

  // Function to handle search form submission
  const handleSearchSubmit = () => {
    setParams((prevParams) => ({
      ...prevParams,
      search: searchValue.search,
    }));
  };

  // JSX code for rendering the category component
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditCategoryData(null);
  };

  return (
    <>
      {/* The main container */}
      <Box
        sx={{
          width: "100%",
          marginBottom: "70px",
          marginTop: "20px",
          marginLeft: "-22px",
        }}
      >
        {/* Top section containing the add category and filter button */}
        <Stack
          direction="row"
          alignItems="center"
          mt={-5}
          mb={5}
          justifyContent="space-between"
          spacing={1}
        >
          <Box flexGrow={1} />

          {/* Add button */}
          <div>
            <IconButton
              title="Add"
              onClick={handleOpen}
              color="primary"
              className="bg-red-500 hover:animate-pulse"
            >
              <AddIcon />
            </IconButton>

            {/* Modal */}
            <CategoryModal
              open={open}
              handleClose={handleClose}
              onSuccess={listCategories}
            />
          </div>

          {/* Filter button */}
          <IconButton
            title="Filter"
            onClick={(prev) => handleCloseSearch()}
            color="primary"
            className="bg-red-500 hover:animate-pulse"
          >
            <FilterListIcon />
          </IconButton>
        </Stack>

        {/* The filter section */}
        <Stack spacing={1}>
          {/* Show filter options when 'show' is true */}
          {show && (
            <div className="w-full bg-white pl-5 pr-5 pt-5 shadow-custom">
              <Typography
                sx={{
                  flex: "1 1 100%",
                  backgroundColor: "rgb(155 209 242)",
                  height: "55px",
                  textAlign: "left",
                  lineHeight: "1.5rem",
                  paddingTop: "15px",
                  paddingLeft: "34px",
                  fontSize: "15px",
                  fontWeight: "800",
                  fontFamily: "sans-serif",
                }}
                id="tableTitle"
                component="div"
              >
                Filter
              </Typography>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                sx={{
                  marginBottom: "30px",
                  marginTop: "20px",
                  width: "100",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Stack
                  spacing={1}
                  flexGrow={1}
                  sx={{ width: { xs: "100%", sm: "30%", lg: "1%" } }}
                >
                  <TextField
                    id="outlined-name"
                    name="Search"
                    size="small"
                    label="Search"
                    variant="outlined"
                    onChange={(e) => handleSearch("search", e)}
                  />
                </Stack>

                {/*Submit button*/}
                <Stack
                  direction="row"
                  spacing={2}
                  flexGrow={1}
                  sx={{ width: "20%", alignItems: "center" }}
                >
                  <Button
                    sx={{ width: "20%", height: 39 }}
                    type="submit"
                    variant="contained"
                    size="small"
                    style={{ backgroundColor: "#144399" }}
                    onClick={handleSearchSubmit}
                  >
                    Submit
                  </Button>
                  <IconButton title="Clear">
                    <RestartAltIcon
                      color="error"
                      cursor="pointer"
                      onClick={ClearData}
                    />
                  </IconButton>
                </Stack>
              </Stack>
            </div>
          )}

          {/* The table section */}
          <div className="w-full mb pl-4 pr-4 pt-6 bg-white shadow-custom">
            <Paper sx={{ width: "100%", mb: 2 }}>
              <TableContainer>
                <Table
                  sx={{ minWidth: 750 }}
                  aria-labelledby="tableTitle"
                  size="medium"
                >
                  {/* Table header */}
                  <EnhancedTableHead
                    order={order}
                    orderBy={orderBy}
                    onRequestSort={handleRequestSort}
                    rowCount={data?.length}
                    setParams={setParams}
                  />
                  {/* Table body */}

                  <TableBody>
                    {data && data?.length > 0
                      ? data.map((row, index) => {
                          const labelId = `enhanced-table-checkbox-${index}`;
                          return (
                            <TableRow
                              hover
                              role="checkbox"
                              tabIndex={-1}
                              key={row.id}
                            >
                              <TableCell sx={{ padding: "6px" }} />
                              <TableCell
                                sx={{
                                  padding: "6px",
                                  overflow: "hidden",
                                  whiteSpace: "nowrap",
                                  textOverflow: "ellipsis",
                                  maxWidth: 150,
                                }}
                                title={row.name}
                                component="th"
                                id={labelId}
                                scope="row"
                                padding="none"
                              >
                                {row.name}
                              </TableCell>
                              {/* Edit category button */}
                              <TableCell sx={{ padding: "6px" }}>
                                <Stack
                                  direction="row"
                                  spacing={2}
                                  sx={{ mt: 1.2 }}
                                >
                                  <div>
                                    <IconButton
                                      title={HardCodedValues.Edit}
                                      onClick={() => {
                                        handleEditOpen(row.id);
                                      }}
                                      color="error"
                                      className="bg-red-500 hover:animate-pulse"
                                    >
                                      <EditIcon />
                                    </IconButton>
                                  </div>
                                </Stack>
                              </TableCell>

                              {/* Delete category button */}
                              <TableCell sx={{ padding: "6px" }}>
                                <Stack
                                  direction="row"
                                  spacing={2}
                                  sx={{ mt: 1.2 }}
                                >
                                  <IconButton
                                    title={HardCodedValues.Delete}
                                    onClick={() => handleDeleteCategory(row.id)}
                                    color="error"
                                    className="bg-red-500 hover:animate-pulse"
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </Stack>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      : ""}
                  </TableBody>
                </Table>
                <CategoryModal
                  open={open}
                  handleClose={handleClose}
                  editData={editCategoryData}
                  onSuccess={listCategories}
                />
                {/* Display "No data found" if no data or an empty array */}
                {(data?.length === 0 || !data) && (
                  <Typography variant="subtitle1" sx={{ textAlign: "center" }}>
                    No data found
                  </Typography>
                )}
              </TableContainer>
            </Paper>
          </div>
          {/* Pagination section */}

          <Stack spacing={2} sx={{ alignItems: "flex-end", marginTop: "2%" }}>
            <Pagination
              siblingCount={0}
              count={details?.displayEnd}
              variant="text"
              rowsPerPage={details?.pageSize}
              page={params.page}
              onChange={handleChangePage}
              color="primary"
              showFirstButton="true"
              showLastButton="true"
            />
          </Stack>
        </Stack>
      </Box>
    </>
  );
};
export default CategoryList;
