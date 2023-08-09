import PropTypes from "prop-types";
import { BsCalendar2Week } from "react-icons/bs";
import {
  MdLocationOn,
  MdEventSeat,
  MdCategory,
  MdCircle,
} from "react-icons/md";
import { HiOutlineSpeakerphone } from "react-icons/hi";
import { LiaPersonBoothSolid } from "react-icons/lia";
import StarRating from "../../../Components/StarRating";
import Sponsors from "./Sponsors";
import Speakers from "./Speakers";

export default function MainImageAndDetails({
  SpeakerListData,
  renderedSponsers,
  renderedEvents,
}) {
  return (
    <div className="w-full">
      <img
        className="w-full   object-contain md:object-scale-down object-left-top"
        src={SpeakerListData.EventImage}
        alt="Event Main Image"
        loading="lazy"
      />
      <div className="flex flex-row justify-between h-14 items-center max-sm:text-sm">
        <div className="flex items-center gap-3 max-sm:max-w-[148px]">
          <BsCalendar2Week className="text-2xl " />{" "}
          {`${SpeakerListData.StartDate} -
                  ${SpeakerListData.EndDate}`}
        </div>

        <div className="flex items-center gap-2 text-red-400 font-extrabold text-2xl max-sm:text-sm">
          <MdEventSeat className="text-2xl" />
          {SpeakerListData.SeatCount}
        </div>

        <div className="flex items-center gap-3 max-sm:text-sm">
          <MdLocationOn className="text-2xl " /> {SpeakerListData.Location}
        </div>
      </div>
      <hr />
      <br />
      <div className="flex flex-row justify-between h-14 items-center max-sm:text-sm">
        <div className="max-sm:text-xs">
          <MdCategory className="text-3xl" />

          {SpeakerListData.EventCategory}
        </div>
        <div className="max-sm:text-xs">
          <HiOutlineSpeakerphone className="text-3xl" />
          {SpeakerListData.Speakers.length} Speakers
        </div>
        <div className="relative max-sm:text-xs">
          <MdCircle className="text-3xl" />
          <div className="absolute text-white top-1 left-1  max-sm:text-base">
            {SpeakerListData.AgeLimit}
          </div>
          Age Limit
        </div>
        <div className="max-sm:text-xs">
          <LiaPersonBoothSolid className="text-3xl" />
          {SpeakerListData.Booths.length} Booths
        </div>
        <div className="flex flex-col items-center">
          <StarRating rating={SpeakerListData.starRating} />
          <div>{`(${SpeakerListData.RatingCount})`}</div>
        </div>
      </div>
      <div className="w-full">
        <div className="text-gray-600 font-semibold text-2xl font-sans mt-4">
          {SpeakerListData.EventHeading}
        </div>
        <div className="text-gray-800 leading-7 font-semibold text-base font-sans mt-4">
          {SpeakerListData.EventDescrition}
        </div>
      </div>
      <div>
        <br />
        <br />
        <hr />
        <hr />
      </div>
      <div className="w-full">
        {" "}
        <Sponsors renderedSponsers={renderedSponsers} isTheme2 />
      </div>
      <br />
      <br />
      <hr />
      <hr />
      <div className="w-full">
        <Speakers renderedEvents={renderedEvents} isTheme2 />
      </div>
      <div className="md:hidden">
        <br />
        <br />
        <hr />
        <hr />
      </div>
    </div>
  );
}

MainImageAndDetails.propTypes = {
  SpeakerListData: PropTypes.any,
  renderedEvents: PropTypes.any,
  renderedSponsers: PropTypes.any,
};
