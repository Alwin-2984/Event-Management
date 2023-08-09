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
import StarRating from "../../Components/StarRating";
import { GlobalList } from "../../Components/GlobalList";
import Sponsors from "./EventDetailedPageComponents/Sponsors";
import Booths from "./EventDetailedPageComponents/Booths";
import Speakers from "./EventDetailedPageComponents/Speakers";
import CountDown from "./EventDetailedPageComponents/CountDown";
import Footer from "../../Components/Footer/Footer";

const EventDetailedPage1thTheme = ({ DummyData }) => {
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
        <div className="w- flex w-10/12 max-2xl:w-11/12 flex-row justify-center  mt-8  items-end max-sm:mb-7">
          <div className="flex justify-between w-10/12 max-md:w-full">
            
            <div className="text-gray-600 font-extrabold text-5xl font-sans max-md:text-3xl max-sm:text-2xl">
              {SpeakerListData.EventName}
            </div>
            <div className=" text-red-400 font-extrabold text-3xl font-sans max-md:text-3xl max-sm:text-2xl">
              <CountDown StartDate={SpeakerListData.StartDate} />
            </div>
          </div>
        </div>

        <div className="flex justify-center  w-10/12 max-2xl:w-11/12  pt-10 max-md:pt-5 gap-5">
          <div className="flex justify-center w-10/12 max-md:w-full ">
            <div className="w-full">
              <img
                className="w-full   object-contain md:object-scale-down object-left-top"
                src={SpeakerListData.EventImage}
                alt="Event Main Image"
              />
              <div className="flex flex-row justify-between h-14 items-center max-sm:text-sm mt-3">
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
              <div>
                <br />
                <hr />
              </div>
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
                <Sponsors renderedSponsers={renderedSponsers} isTheme1 />
              </div>
              <div>
                <br />
                <br />
                <hr />
                <hr />
              </div>
              <div className="w-full">
                <Speakers renderedEvents={renderedEvents} isTheme1 />
              </div>
              <div>
                <br />
                <br />
                <hr />
                <hr />
              </div>
              <div className="w-full">
                <Booths renderedBooth={renderedBooth} isTheme1 />
              </div>
            </div>
          </div>
          {/* <div className="flex  w-1/3 max-md:w-full"></div> */}
        </div>
      </div>
      <Footer />
    </div>
  );
};

EventDetailedPage1thTheme.propTypes = {
  DummyData: PropTypes.any,
};

export default EventDetailedPage1thTheme;
