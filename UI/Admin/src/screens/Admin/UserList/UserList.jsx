// Importing required components and modules
import DeleteIcon from "@mui/icons-material/Delete";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import Autocomplete from "@mui/material/Autocomplete";
import IconButton from "@mui/material/IconButton";
import Pagination from "@mui/material/Pagination";
import Paper from "@mui/material/Paper";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableSortLabel from "@mui/material/TableSortLabel";
import { visuallyHidden } from "@mui/utils";
import moment from "moment";
import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import FilterListIcon from "@mui/icons-material/FilterList";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { listUsersAPI, DeleteUsers } from "../../../api/ServiceFile/ApiService";

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

// Define table headings

const headCells = [
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "Name",
  },
  {
    id: "Email",
    numeric: true,
    disableSorting: true,
    disablePadding: false,
    label: "Email",
  },
  {
    id: "DOB",
    numeric: true,
    disablePadding: false,
    disableSorting: true,
    label: "DOB",
  },
  {
    id: "Gender",
    numeric: true,
    disableSorting: true,
    disablePadding: false,
    label: "Gender",
  },
  {
    id: "Block User",
    numeric: true,
    disablePadding: false,
    disableSorting: true,
    label: "Block User",
  },
  {
    id: "Delete",
    numeric: true,
    disablePadding: false,
    disableSorting: true,
    label: "Delete",
  },
];
// Function to create the enhanced table head

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort, setParams } = props;
  const createSortHandler = (property) => () => {
    const isAsc = orderBy === property && order === "asc";
    const newOrder = isAsc ? "desc" : "asc";
    const newAPIorder = isAsc ? 1 : 0;
    setParams((prevParams) => ({
      ...prevParams,
      sort: property,
      order: newAPIorder,
    }));

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

// Define the User component

const UserList = () => {
  // State variables used in the component

  const [order, setOrder] = React.useState("asc"); // Variable to store asc or desc
  const [orderBy, setOrderBy] = React.useState(""); // Variable to store column heading name
  const [searchValue, setSearchValue] = useState({
    search: "",
    status: 0,
  }); // Variable to store searched values temporarily
  const [data, setData] = useState([]); // variable to store data for list users from api
  const [details, setDetails] = useState(null); // variable to store response from list user api
  const [status, setStatus] = useState([null]); // list status for search
  const [activeUserCount] = useState(18); // to print active user count
  const [params, setParams] = useState({
    page: 1,
    search: "",
    size: 10,
    sort: "updatedAt",
    order: 1,
    status: 0,
  }); // parameters for list api
  const [searchValues, setSearchValues] = useState(null); // for temporarily saving search values
  const [show, setShow] = useState(false); // for open and closing of search div

  // UseEffect to set status on page loading for listing it in the search field

  useEffect(() => {
    setStatus(["Select all", "Blocked user", "Active user"]);
  }, []);

  // UseEffect to fetch the user list when the parameters change

  useEffect(() => {
    listUsers();
  }, [params]);

  // Function to fetch the list of users

  const listUsers = async () => {
    await listUsersAPI(params)
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

  // Function to delete a user
  const deleteUser = (id) => {
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
        DeleteUsers(id, 2).then(() => {
          ClearData();
          listUsers();
          toast.success("User deleted successfully", {
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

  // Function to handle search input and filtering

  const handleSearch = (name, e) => {
    const value = e.target?.value;
    if (name === "status") {
      setSearchValues(e.target.value);

      let statusValue;
      switch (value) {
        case "Select all":
          statusValue = 0;
          break;
        case "Blocked user":
          statusValue = 2;
          break;
        case "Active user":
          statusValue = 1;
          break;
        default:
          statusValue = 0;
          break;
      }
      setSearchValue({ ...searchValue, [name]: statusValue });
    } else {
      setSearchValue({ ...searchValue, [name]: value });
    }
  };

  // Function to clear search fields and reset filters

  const ClearData = () => {
    setSearchValue({
      search: "",
      status: 0,
    });
    setSearchValues(null);
    const inputFields = document.getElementsByTagName("input");

    for (const inputField of inputFields) {
      inputField.value = "";
    }
    setParams((prevParams) => ({
      ...prevParams,
      page: 1,
      search: "",
      status: 0,
    }));
  };

  // Function to handle search form submission

  const handleSearchSubmit = () => {
    setParams((prevParams) => ({
      ...prevParams,
      search: searchValue.search,
      status: searchValue.status,
    }));
  };

  // Function to handle blocking a user

  const handleBlockUser = (id) => {
    DeleteUsers(id, 1).then(() => {
      ClearData();
      listUsers();
      toast.success("User blocked successfully", {
        toastId: 3,
        position: "top-center",
        autoClose: 3000,
      });
    });
  };

  // Function to handle unblocking a user

  const handleUnBlockUser = (id) => {
    DeleteUsers(id, 0).then(() => {
      ClearData();
      listUsers();
      toast.success("User unblocked successfully", {
        toastId: 4,
        position: "top-center",
        autoClose: 3000,
      });
    });
  };

  // Mapping for gender values

  const gender = {
    0: "Male",
    1: "Female",
    2: "Other",
  };

  // JSX code for rendering the User component

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
        {/* Top section containing the Active User count and Filter button */}
        <Stack
          direction="row"
          alignItems="center"
          mt={-5}
          mb={5}
          justifyContent="space-between"
          spacing={1}
        >
          {/* Displaying the Active User count */}
          <Typography
            variant="body1"
            sx={{ color: "rgb(0, 172, 193)", fontFamily: "monospace" }}
          >
            Active user count : {activeUserCount}
          </Typography>
          {/* Filter button */}
          <IconButton
            title="Filter"
            onClick={(prev) => handleCloseSearch(prev)}
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
                direction="row"
                spacing={2}
                sx={{
                  marginBottom: "30px",
                  marginTop: "20px",
                  width: "100",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Stack spacing={2} flexGrow={1} sx={{ width: "30%" }}>
                  <TextField
                    id="outlined-name"
                    name="Search"
                    size="small"
                    label="Search"
                    variant="outlined"
                    onChange={(e) => handleSearch("search", e)}
                  />
                </Stack>
                <Stack spacing={2} flexGrow={1} sx={{ width: "30%" }}>
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    name="Status"
                    size="small"
                    options={status}
                    value={searchValues}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Status"
                        onBlur={(e) => handleSearch("status", e)}
                      />
                    )}
                    onSelect={(e) => handleSearch("status", e)}
                  />
                </Stack>
                <Stack
                  direction="row"
                  spacing={2}
                  flexGrow={1}
                  sx={{ width: "20%" }}
                >
                  <Button
                    sx={{ width: "40%", height: 39 }}
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
                                sx={{ padding: "6px" }}
                                component="th"
                                id={labelId}
                                scope="row"
                                padding="none"
                              >
                                {row.name}
                              </TableCell>
                              <TableCell sx={{ padding: "6px" }} align="left">
                                {row.email}
                              </TableCell>
                              <TableCell sx={{ padding: "6px" }} align="left">
                                {moment(row.dob).format("DD/MM/YYYY")}
                              </TableCell>
                              <TableCell sx={{ padding: "6px" }} align="left">
                                {gender[row?.gender]}
                              </TableCell>
                              <TableCell sx={{ padding: "6px" }} align="left">
                                {/* Display either Block or Unblock button based on 'status' */}

                                {row.status === 0 ? (
                                  <IconButton
                                    title="Block user"
                                    color="success"
                                    className="bg-red-500 hover:animate-pulse"
                                    onClick={() => {
                                      handleBlockUser(row.id);
                                    }}
                                  >
                                    <LockOpenIcon className="h-4 w-4" />
                                  </IconButton>
                                ) : (
                                  <IconButton
                                    title="Unblock user"
                                    color="error"
                                    className="bg-red-500 hover:animate-pulse"
                                    onClick={() => {
                                      handleUnBlockUser(row.id);
                                    }}
                                  >
                                    <LockIcon className="h-4 w-4" />
                                  </IconButton>
                                )}
                              </TableCell>
                              {/* Delete user button */}

                              <TableCell sx={{ padding: "6px" }}>
                                <Stack
                                  direction="row"
                                  spacing={2}
                                  sx={{ mt: 1.2 }}
                                >
                                  <IconButton
                                    title="Delete"
                                    onClick={() => deleteUser(row.id)}
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
export default UserList;
