import PropTypes from "prop-types";
import { useState } from "react";
import EventDetailedPag4thLayout from "./EventDetailedPag4thLayout";
import EventDetailedPage1thTheme from "./EventDetailedPage1thTheme";
import EventDetailedPage2ndTheme from "./EventDetailedPage2ndTheme";
import EventDetailedPage3rdTheme from "./EventDetailedPage3rdTheme";
import {  
  // DummyDataForDetailedEvent,
   DummyDataForDetailedEvent2,
    // DummyDataForDetailedEvent3 
  } from "../DummyData.jsx/DummyData";

const SelectField = ({ options, handleLayout }) => (
  <div className="min-h-[100px] bg-transparent">
    <select onClick={handleLayout}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

SelectField.propTypes = {
  handleLayout: PropTypes.any,
  options: PropTypes.shape({
    map: PropTypes.func,
  }),
};

const EventDetailPage = () => {
  const [statusData, setStatusData] = useState({ status: "theme1" });

  const handleLayout = (event) => {
    setStatusData({ status: event.target.value });
  };



  return (
    <>
      {/* to tst layout switch */}
      <div className="relative">
        <div className="absolute top-0 left-0 ">
          <SelectField
            handleLayout={handleLayout}
            options={[
              { value: "theme1", label: "layout1" },
              { value: "theme2", label: "layout2" },
              { value: "theme3", label: "layout3" },
              { value: "theme4", label: "layout4" },
            ]}
          />
        </div>
      </div>

      {statusData.status === "theme1" && <EventDetailedPage1thTheme DummyData={DummyDataForDetailedEvent2}/>}
      {statusData.status === "theme2" && <EventDetailedPage2ndTheme DummyData={DummyDataForDetailedEvent2} />}
      {statusData.status === "theme3" && <EventDetailedPage3rdTheme DummyData={DummyDataForDetailedEvent2} />}
      {statusData.status === "theme4" && <EventDetailedPag4thLayout DummyData={DummyDataForDetailedEvent2} />}
    </>
  );
};

export default EventDetailPage;
