// Importing necessary dependencies and components
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
import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import FilterListIcon from "@mui/icons-material/FilterList";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

// Helper functions for sorting
// Function to compare two values for descending order

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}
// Function to get the comparator based on the current sorting order and column

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// Function to stabilize the sorting of data
// Map each element with its original index, then sort the mapped array, and return the sorted original elements

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

// Table headings

const headCells = [
  {
    id: "OrganizerName",
    numeric: false,
    disablePadding: true,
    label: "Name",
  },
  {
    id: "Email",
    numeric: true,
    disablePadding: false,
    label: "Email",
  },
  {
    id: "Block Organizer",
    numeric: true,
    disablePadding: false,
    disableSorting: true,
    label: "Block Organizer",
  },
  {
    id: "Delete",
    numeric: true,
    disablePadding: false,
    disableSorting: true,
    label: "Delete",
  },
];
// Function to render the table head with sorting functionality

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell
          style={{ backgroundColor: "rgb(155 209 242)", color: "black",padding:"6px",height:"50px" }}
        />
        {headCells.map((headCell) => (
          <TableCell
            style={{ backgroundColor: "rgb(155 209 242)", color: "black",padding:"6px",height:"50px" }}
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
};
// Main component for Admin Organizer

const AdminOrganizer = () => {
  // State hooks to manage sorting, pagination, search, and other data

  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [activeOrganizerCount] = useState(24); // To print active organizer count
  const [searchValue, setSearchValue] = useState({
    Name: "",
    Status: "",
  });
  const [show, setShow] = useState(false);
  const [status, setStatus] = useState([null]); // For listing status for search

  // Set the status values for search field on page loading
  useEffect(() => {
    setStatus(["Blocked organizer", "Active organizer"]);
  }, []);

  // Function to delete an organizer with confirmation
  const deleteOrganizer = () => {
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
        console.log(response);
      }
    });
  };

  // Function to handle table sorting

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };
  // Function to handle pagination

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Dummy data for displaying in the table

  const data = [
    {
      id: 1,
      OrganizerName: "Snow",
      Email: "Jon",
      Status: "Blocked",
    },
    {
      id: 2,
      OrganizerName: "Lannister",
      Email: "Cersei",
      Status: "Blocked",
    },
    {
      id: 3,
      OrganizerName: "Lannister",
      Email: "Jaime",
      Status: "UnBlocked",
    },
    {
      id: 4,
      OrganizerName: "Stark",
      Email: "Arya",
      Status: "UnBlocked",
    },
    {
      id: 5,
      OrganizerName: "Targaryen",
      Email: "Daenerys",
      Status: "Blocked",
    },
    {
      id: 6,
      OrganizerName: "Melisandre",
      Email: null,
      Status: "UnBlocked",
    },
    {
      id: 7,
      OrganizerName: "Clifford",
      Email: "Ferrara",
      Status: "Blocked",
    },
    {
      id: 8,
      OrganizerName: "Frances",
      Email: "Rossini",
      Status: "UnBlocked",
    },
    {
      id: 9,
      OrganizerName: "Roxie",
      Email: "Harvey",
      Status: "Blocked",
    },
  ];

  // Function to handle the close of the search field

  const handleCloseSearch = () => {
    setShow((prev) => !prev);
    setSearchValue({
      Name: "",
      Status: "",
    });
  };
  // Function to handle search field changes

  const handleSearch = (name, e) => {
    const value = e.target?.value;
    setSearchValue({ ...searchValue, [name]: value });
    setPage(1);
  };
  // Function to clear search data

  const ClearData = () => {
    setSearchValue({
      Name: "",
      Status: "",
    });
    const inputFields = document.getElementsByTagName("input");
    for (const inputField of inputFields) {
      inputField.value = "";
    }
  };
  // Function to handle search form submission

  const handleSearchSubmit = () => {
    console.log(searchValue);
  };
  // Function to handle blocking an organizer

  const handleBlockOrganizer = (id) => {
    console.log("Organizer blocked", id);
    toast.success("Organizer blocked successfully", {
      toastId: 1,
      position: "top-center",
      autoClose: 3000,
    });
  };
  // Function to handle unblocking an organizer

  const handleUnBlockOrganizer = (id) => {
    console.log("unblock organizer", id);
    toast.success("Organizer unblocked successfully", {
      toastId: 1,
      position: "top-center",
      autoClose: 3000,
    });
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
        {/* Top section containing the Active organizer count and Filter button */}
        <Stack
          direction="row"
          alignItems="center"
          mt={-5}
          mb={5}
          justifyContent="space-between"
          spacing={1}
        >
          {/* Displaying the Active organizer count */}
          <Typography
            variant="body1"
            sx={{ color: "rgb(0, 172, 193)", fontFamily: "monospace" }}
          >
            Active organizer count : {activeOrganizerCount}
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
                    name="Name"
                    size="small"
                    label="Name"
                    variant="outlined"
                    onChange={(e) => handleSearch("Name", e)}
                  />
                </Stack>
                <Stack spacing={2} flexGrow={1} sx={{ width: "30%" }}>
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    name="Status"
                    size="small"
                    options={status}
                    value={searchValue.Status}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Status"
                        onBlur={(e) => handleSearch("Status", e)}
                      />
                    )}
                    onSelect={(e) => handleSearch("Status", e)}
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
                    rowCount={data.length}
                  />
                  {/* Table body */}
                  <TableBody>
                    {data.length > 0
                      ? stableSort(data, getComparator(order, orderBy))
                          .slice(
                            (page - 1) * rowsPerPage,
                            (page - 1) * rowsPerPage + rowsPerPage
                          )
                          .map((row, index) => {
                            const labelId = `enhanced-table-checkbox-${index}`;
                            return (
                              <TableRow
                                hover
                                role="checkbox"
                                tabIndex={-1}
                                key={row._id}
                              >
                                <TableCell sx={{ padding: "6px" }}/>
                                <TableCell
                                  component="th"
                                  id={labelId}
                                  scope="row"
                                  sx={{ padding: "6px" }}
                                >
                                  {row.OrganizerName}
                                </TableCell>
                                <TableCell sx={{ padding: "6px" }} align="left">{row.Email}</TableCell>
                                <TableCell sx={{ padding: "6px" }} align="left">
                                  {/* Display either Block or Unblock button based on 'status' */}
                                  {row.Status === "UnBlocked" ? (
                                    <IconButton
                                      title="Block organizer"
                                      color="success"
                                      className="bg-red-500 hover:animate-pulse"
                                      onClick={() => {
                                        handleBlockOrganizer(row.id);
                                      }}
                                    >
                                      <LockOpenIcon className="h-4 w-4" />
                                    </IconButton>
                                  ) : (
                                    <IconButton
                                      title="Unblock organizer"
                                      color="error"
                                      className="bg-red-500 hover:animate-pulse"
                                      onClick={() => {
                                        handleUnBlockOrganizer(row.id);
                                      }}
                                    >
                                      <LockIcon className="h-4 w-4" />
                                    </IconButton>
                                  )}
                                </TableCell>
                                {/* Delete organizer button */}
                                <TableCell sx={{ padding: "6px" }}>
                                  <Stack
                                    direction="row"
                                    spacing={2}
                                    sx={{ mt: 1.2 }}
                                  >
                                    <IconButton
                                      title="Delete"
                                      onClick={() => deleteOrganizer()}
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
          <Stack spacing={2} sx={{ marginTop: "2%", alignItems: "flex-end" }}>
            <Pagination
              siblingCount={0}
              count={Math.ceil(data.length / 10)}
              rowsPerPage={rowsPerPage}
              page={page}
              onChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              color="primary"
            />
          </Stack>
        </Stack>
      </Box>
    </>
  );
};
export default AdminOrganizer;
