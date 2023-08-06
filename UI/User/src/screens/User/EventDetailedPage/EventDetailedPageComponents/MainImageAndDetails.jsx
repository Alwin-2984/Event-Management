import PropTypes from "prop-types"
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
import { sponsors } from "./sponsors";
import { Speakers } from "./Speakers";

export default function MainImageAndDetails({renderedSponsers, renderedEvents}) {
  return (
    <div>
      <img
        className="w-full   object-contain md:object-scale-down object-left-top"
        src="https://picsum.photos/1920/1080"
        alt=""
        loading="lazy"
      />
      <div className="flex flex-row justify-between h-14 items-center max-sm:text-sm">
        <div className="flex items-center gap-3">
          <BsCalendar2Week className="text-2xl max-sm:text-base" /> January
          21,2021 - January 23,2021
        </div>

        <div className="flex items-center gap-2 text-red-400 font-extrabold text-2xl max-sm:text-sm">
          <MdEventSeat className="text-2xl" />
          500
        </div>

        <div className="flex items-center gap-3 max-sm:text-sm">
          <MdLocationOn className="text-2xl " /> Broadw, New York
        </div>
      </div>
      <div className="flex flex-row justify-between h-14 items-center max-sm:text-sm">
        <div className="max-sm:text-xs">
          <MdCategory className="text-3xl" />
          Category
        </div>
        <div className="max-sm:text-xs">
          <HiOutlineSpeakerphone className="text-3xl" />
          10 Speakers
        </div>
        <div className="relative max-sm:text-xs">
          <MdCircle className="text-3xl" />
          <div className="absolute text-white top-1 left-1  max-sm:text-base">
            18
          </div>
          Age Limit
        </div>
        <div className="max-sm:text-xs">
          <LiaPersonBoothSolid className="text-3xl" />
          20 Booths
        </div>
        <div className="flex flex-col items-center">
          <StarRating />
          <div>{"(5000)"}</div>
        </div>
      </div>
      <div className="w-full">
        <div className="text-gray-600 font-semibold text-2xl font-sans mt-4">
          The standard Lorem Ipsum passage, used since the 1500s
        </div>
        <div className="text-gray-800 leading-7 font-semibold text-base font-sans mt-4">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum Lorem Ipsum is
          simply dummy text of the printing and typesetting industry. Lorem
          Ipsum has been the industrys standard dummy text ever since the 1500s,
          when an unknown printer took a galley of type and scrambled it to make
          a type specimen book. It has survived not only five centuries, but
          also the leap into electronic typesetting, remaining essentially
          unchanged. It was popularised in the 1960s with the release of
          Letraset sheets containing Lorem Ipsum passages, and more recently
          with desktop publishing software like Aldus PageMaker including
          versions of Lorem Ipsum
        </div>
      </div>
      <div>
        <br />
        <br />
        <hr />
        <hr />
      </div>
      <div className="w-full">{sponsors(renderedSponsers)}</div>
      <br />
      <br />
      <hr />
      <hr />
      <div className="w-full">{Speakers(renderedEvents)}</div>
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
  renderedEvents: PropTypes.any,
  renderedSponsers: PropTypes.any
}
