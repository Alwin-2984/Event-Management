import PropTypes from "prop-types"
import Rating from "@mui/material/Rating";
import { useState } from "react";

const StarRating = ({rating}) => {
  const [value, setValue] = useState(rating);
  console.log("🚀 ~ file: StarRating.jsx:7 ~ StarRating ~ rating:", rating)
  
  return (
    <>
      <Rating
        size="small"
        name="simple-controlled"
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
      />
    </>
  );
};

StarRating.propTypes = {
  rating: PropTypes.any
}

export default StarRating;
