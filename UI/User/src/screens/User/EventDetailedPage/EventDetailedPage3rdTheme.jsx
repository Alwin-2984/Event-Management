import PropTypes from "prop-types";
import { BsCalendar2Week, BsFillSquareFill } from "react-icons/bs";
import { MdEventSeat, MdLocationOn } from "react-icons/md";
import { FcAdvertising } from "react-icons/fc";

import StarRating from "../../Components/StarRating";
import { GlobalList } from "../../Components/GlobalList";
import Sponsors from "./EventDetailedPageComponents/Sponsors";
import Booths from "./EventDetailedPageComponents/Booths";
import Speakers from "./EventDetailedPageComponents/Speakers";
import CountDown from "./EventDetailedPageComponents/CountDown";
import Footer from "../../Components/Footer/Footer";

const EventDetailedPage3rdTheme = ({ DummyData }) => {
  const SpeakerListData = DummyData;

  /**
   * renders Speaker list
   */
  const renderedEvents = [
    /** Function returns list for provided data GlobalList(listData, conditionFor identify if this function using in Speaker  ) */
    {
      Description: SpeakerListData.SpeakerDescription,
      title: "Who's Speaking",
      events: GlobalList(SpeakerListData.Speakers, true),
    },
  ];
  /**
   * renders Sponser list
   */
  const renderedSponsers = [
    /** Function returns list for provided data GlobalList(listData, conditionFor for using in Home page  , conditionFor for using in Speaker,conditionFor for using in Sponser) */
    {
      Description: SpeakerListData.SponsorDescription,
      title: "This Event Sponsor",
      events: GlobalList(SpeakerListData.Sponsors, false, false, true),
    },
  ];

  const renderedBooth = [
    /** Function returns list for provided data GlobalList(listData, conditionFor for using in Home page  , conditionFor for using in Speaker,conditionFor for using in Sponser ,conditionFor for use Booth) */
    {
      title: "Available Booths",
      events: GlobalList(SpeakerListData.Booths, false, false, false, true),
    },
  ];

  return (
    <div className="max-h-[calc(100vh-90px)] overflow-y-scroll overflow-x-hidden bg-cover bg-no-repeat bg-center">
      <div className="flex flex-col items-center h-full pb-20">
        {/* <Canvas bg={bg}/> */}
        <div className="w- flex w-[78%] max-2xl:w-11/12 flex-row justify-between  mt-8  items-end max-sm:mb-7">
          <div className="text-gray-600 font-extrabold text-5xl font-sans max-md:text-3xl max-sm:text-2xl">
            {SpeakerListData.EventName}
          </div>
          <div className=" text-red-400 font-extrabold text-3xl font-sans max-md:text-3xl max-sm:text-2xl">
            <CountDown StartDate={SpeakerListData.StartDate} />
          </div>
        </div>

        <div className="flex flex-row max-md:flex-col  w-[78%] max-2xl:w-11/12  pt-10 max-md:pt-5 gap-5">
          <div className="flex justify-center w-2/3 max-md:w-full ">
            <div className=" w-full">
              <img
                className="w-full   object-contain md:object-scale-down object-left-top"
                src={SpeakerListData.EventImage}
                alt="Event Main Image"
              />
              <div className="flex flex-row justify-between h-14 items-center max-sm:text-sm">
                <div className="flex items-center gap-3 max-sm:max-w-[148px]">
                  <BsCalendar2Week className="text-2xl " />
                  {`${SpeakerListData.StartDate} -
                  ${SpeakerListData.EndDate}`}
                </div>

                <div className="flex items-center gap-2 text-red-400 font-extrabold text-2xl max-sm:text-sm">
                  <MdEventSeat className="text-2xl" />
                  {SpeakerListData.SeatCount}
                </div>

                <div className="flex items-center gap-3 max-sm:text-sm">
                  <MdLocationOn className="text-2xl " />
                  {SpeakerListData.Location}
                </div>
              </div>
              <hr />
              <div className="flex flex-row mt-3 justify-between h-14 items-center max-sm:text-sm ">
                <div className="max-sm:text-xs flex flex-col items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    width="24"
                    height="24"
                    xmlSpace="preserve"
                    version="1.1"
                    viewBox="0 0 24 24"
                  >
                    <image
                      width="24"
                      height="24"
                      xlinkHref="data:image/png;base64,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"
                    />
                  </svg>
                  {SpeakerListData.EventCategory}
                </div>
                <div className="max-sm:text-xs flex flex-col items-center">
                  <FcAdvertising className="text-3xl" />
                  {SpeakerListData.Speakers.length} Speakers
                </div>
                <div className="relative max-sm:text-xs flex flex-col items-center">
                  <BsFillSquareFill className="text-2xl text-red-600" />
                  <div className="absolute text-white top-0   max-sm:text-base">
                    {SpeakerListData.AgeLimit}
                  </div>
                  Age Limit
                </div>
                <div className="max-sm:text-xs flex flex-col items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    width="20"
                    height="20"
                    xmlSpace="preserve"
                    version="1.1"
                    viewBox="0 0 22 22"
                  >
                    <image
                      width="22"
                      height="22"
                      xlinkHref="data:image/png;base64,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"
                    />
                  </svg>
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
              <br />
              <hr />
              <br />
              <div className="w-full">
                
                <Sponsors renderedSponsers={renderedSponsers} isTheme3 />
              </div>
            </div>
          </div>
          <div className="flex flex-col w-1/3 max-md:w-full mb-5 ">
            <div className="w-full">
              <Speakers renderedEvents={renderedEvents} isTheme3 />
            </div>
            <br />
            <hr />
            <Booths renderedBooth={renderedBooth} isTheme3 />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

EventDetailedPage3rdTheme.propTypes = {
  DummyData: PropTypes.any,
};

export default EventDetailedPage3rdTheme;
