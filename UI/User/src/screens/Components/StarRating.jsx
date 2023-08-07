import Rating from "@mui/material/Rating";
import { useState } from "react";

const StarRating = () => {
  const [value, setValue] = useState(4);
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

export default StarRating;
