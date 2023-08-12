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
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import Toaster from "../../Components/Toaster";

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
    id: "organizerName",
    numeric: true,
    disableSorting: true,
    disablePadding: false,
    label: "Organizer Name",
  },
  {
    id: "startDate",
    numeric: true,
    disablePadding: false,
    disableSorting: true,
    label: "Start Date",
  },
  {
    id: "endDate",
    numeric: true,
    disableSorting: true,
    disablePadding: false,
    label: "End Date",
  },
  {
    id: "approveEvent",
    numeric: true,
    disablePadding: false,
    disableSorting: true,
    label: "Approve events",
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

// Define the EventList component
const EventList = () => {
  // State variables used in the component

  const [order, setOrder] = React.useState("asc"); // Variable to store asc or desc
  const [orderBy, setOrderBy] = React.useState(""); // Variable to store column heading name
  const [searchValue, setSearchValue] = useState({
    search: "",
    venue: "",
  }); // Variable to store searched values temporarily
  const [venue, setVenue] = useState([null]); // list venue for search
  const [params, setParams] = useState({
    page: 1,
    search: "",
    size: 10,
    sort: "updatedAt",
    order: 1,
    venue: "",
  }); // parameters for list api
  const [searchValues, setSearchValues] = useState(null); // for temporarily saving search values
  const [show, setShow] = useState(false); // for open and closing of search div

  // UseEffect to set venue on page loading for listing it in the search field

  useEffect(() => {
    setVenue(["Kochi", "Ernamkulam", "Malappuram"]);
  }, []);

  // Dummy data for display in table

  const data = [
    {
      id: 1,
      name: "concert",
      organizerName: "Snow",
      startDate: "09/06/1999",
      endDate: "09/06/1999",
      status: 1,
    },
    {
      id: 1,
      name: "Movie",
      organizerName: "start",
      startDate: "09/06/1999",
      endDate: "09/06/1999",
      status: 1,
    },
    {
      id: 1,
      name: "Drama",
      organizerName: "candy",
      startDate: "09/06/1999",
      endDate: "09/06/1999",
      status: 1,
    },
    {
      id: 1,
      name: "Study program",
      organizerName: "fire",
      startDate: "09/06/1999",
      endDate: "09/06/1999",
      status: 1,
    },
    {
      id: 1,
      name: "concert",
      organizerName: "Snow",
      startDate: "09/06/1999",
      endDate: "09/06/1999",
      status: 1,
    },
    {
      id: 1,
      name: "Movie",
      organizerName: "start",
      startDate: "09/06/1999",
      endDate: "09/06/1999",
      status: 1,
    },
    {
      id: 1,
      name: "Drama",
      organizerName: "candy",
      startDate: "09/06/1999",
      endDate: "09/06/1999",
      status: 1,
    },
    {
      id: 1,
      name: "Study program",
      organizerName: "fire",
      startDate: "09/06/1999",
      endDate: "09/06/1999",
      status: 1,
    },
    {
      id: 1,
      name: "concert",
      organizerName: "Snow",
      startDate: "09/06/1999",
      endDate: "09/06/1999",
      status: 1,
    },
    {
      id: 1,
      name: "Movie",
      organizerName: "start",
      startDate: "09/06/1999",
      endDate: "09/06/1999",
      status: 1,
    },
    {
      id: 1,
      name: "Drama",
      organizerName: "candy",
      startDate: "09/06/1999",
      endDate: "09/06/1999",
      status: 1,
    },
    {
      id: 1,
      name: "Study program",
      organizerName: "fire",
      startDate: "09/06/1999",
      endDate: "09/06/1999",
      status: 1,
    },
  ];

  // Function to delete a event
  const deleteEvent = () => {
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
        ClearData();
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
    setSearchValue({ ...searchValue, [name]: value });
  };

  // Function to clear search fields and reset filters

  const ClearData = () => {
    setSearchValue({
      search: "",
      venue: "",
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
      venue: "",
    }));
  };

  // Function to handle search form submission

  const handleSearchSubmit = () => {
    setParams((prevParams) => ({
      ...prevParams,
      search: searchValue.search,
      venue: searchValue.venue,
    }));
  };

  // Function to approve event

  const handleApproveEvent = () => {
    Swal.fire({
      title: "Are you sure you want to approve this event?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Approve",
    }).then((response) => {
      if (response.isConfirmed) {
        ClearData();
        Toaster("Event was approved successfully", 1, ["success"]);
      }
    });
  };

  // Function to reject event

  const handleRejectEvent = () => {
    Swal.fire({
      title: "Are you sure you want to reject this event?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Reject",
    }).then((response) => {
      if (response.isConfirmed) {
        ClearData();
        Toaster("Event was rejected successfully", 1, ["success"]);
      }
    });
  };

  // JSX code for rendering the EventList component

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
        {/* Top section containing the Filter button */}
        <Stack
          direction="row"
          alignItems="center"
          mt={-5}
          mb={5}
          justifyContent="end"
          spacing={1}
        >
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
                  spacing={2}
                  flexGrow={1}
                  sx={{ width: { xs: "100%", sm: "30%" } }}
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
                <Stack
                  spacing={2}
                  flexGrow={1}
                  sx={{ width: { xs: "100%", sm: "30%" } }}
                >
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    name="venue"
                    size="small"
                    options={venue}
                    value={searchValues}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="venue"
                        onBlur={(e) => handleSearch("venue", e)}
                      />
                    )}
                    onSelect={(e) => handleSearch("venue", e)}
                  />
                </Stack>
                <Stack
                  direction="row"
                  spacing={2}
                  flexGrow={1}
                  sx={{ width: "20%", alignItems: "center" }}
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
                              <TableCell
                                sx={{
                                  padding: "6px",
                                  overflow: "hidden",
                                  whiteSpace: "nowrap",
                                  textOverflow: "ellipsis",
                                  maxWidth: 150,
                                }}
                                align="left"
                                title={row.organizerName}
                              >
                                {row.organizerName}
                              </TableCell>
                              <TableCell sx={{ padding: "6px" }} align="left">
                                {moment(row.startDate).format("DD/MM/YYYY")}
                              </TableCell>
                              <TableCell sx={{ padding: "6px" }} align="left">
                                {moment(row.endDate).format("DD/MM/YYYY")}
                              </TableCell>
                              <TableCell sx={{ padding: "6px" }} align="left">
                                {/* Display event approve and reject button */}

                                <IconButton
                                  title="Approve event"
                                  color="success"
                                  className="bg-red-500 hover:animate-pulse"
                                  onClick={() => {
                                    handleApproveEvent();
                                  }}
                                >
                                  <EventAvailableIcon className="h-4 w-4" />
                                </IconButton>
                                <IconButton
                                  title="Reject event"
                                  color="error"
                                  className="bg-red-500 hover:animate-pulse"
                                  onClick={() => {
                                    handleRejectEvent();
                                  }}
                                >
                                  <EventBusyIcon className="h-4 w-4" />
                                </IconButton>
                              </TableCell>
                              {/* Delete event button */}

                              <TableCell sx={{ padding: "6px" }}>
                                <Stack
                                  direction="row"
                                  spacing={2}
                                  sx={{ mt: 1.2 }}
                                >
                                  <IconButton
                                    title="Delete"
                                    onClick={() => deleteEvent()}
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
              count={10}
              variant="text"
              rowsPerPage={10}
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
export default EventList;
