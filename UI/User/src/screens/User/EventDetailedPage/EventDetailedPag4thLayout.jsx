import Footer from "../../Components/Footer/Footer";
import { GlobalList } from "../../Components/GlobalList";
import { DummyData } from "../DummyData.jsx/DummyData";
import Booths from "./EventDetailedPageComponents/Booths";
import CountDown from "./EventDetailedPageComponents/CountDown";

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
import { sponsors } from "./EventDetailedPageComponents/sponsors";
import { Speakers } from "./EventDetailedPageComponents/Speakers";

const EventDetailedPag4thLayout = () => {
  const CanvasImageVar =
    "https://media2.giphy.com/media/3og0IFELH2AXdKM0es/giphy.gif?cid=790b7611dvici5zym8dcq5subwn4ecznqqge9gqn6ey41f4w&ep=v1_gifs_search&rid=giphy.gif&ct=g";

  const bg = {
    backgroundImage: `linear-gradient(rgba(45,55,60,.9) 100%,rgba(45,55,60,.9) 0), url(${CanvasImageVar})`,
  };

  const SpeakerListData = DummyData;
  /**
   * renders Speaker list
   */
  const renderedEvents = [
    /** Function returns list for provided data GlobalList(listData, conditionFor identify if this function using in Speaker  ) */
    {
      title: "Who's Speaking",
      events: GlobalList(SpeakerListData, true),
    },
  ];
  /**
   * renders Sponser list
   */
  const renderedSponsers = [
    /** Function returns list for provided data GlobalList(listData, conditionFor for using in Home page  , conditionFor for using in Speaker,conditionFor for using in Sponser) */
    {
      title: "This Event Sponsor",
      events: GlobalList(SpeakerListData, false, false, true),
    },
  ];

  const renderedBooth = [
    /** Function returns list for provided data GlobalList(listData, conditionFor for using in Home page  , conditionFor for using in Speaker,conditionFor for using in Sponser ,conditionFor for use Booth) */
    {
      title: "Available Booths",
      events: GlobalList(SpeakerListData, false, false, false, true),
    },
  ];

  return (
    <div className="max-h-[calc(100vh-90px)] overflow-y-scroll overflow-x-hidden">
      <div className="flex flex-col items-center h-full  pb-20">
        <div
          style={bg}
          className="bg-cover bg-no-repeat flex-col	relative text-white flex justify-end items-center w-full h-[91vh] bg-center   "
        >
          <div className="w-11/12 mb-9">
            <div>
              <img
                className="w-4/12 max-md:w-6/12 max-sm:w-7/12   object-contain md:object-scale-down object-left-top"
                src="https://picsum.photos/1920/1080"
                alt=""
                loading="lazy"
              />
              <div className="flex 11/12   max-2xl:w-11/12">
                <div className="w-full flex flex-row justify-between  items-end max-sm:mb-7">
                  <div>
                    <div className="text-white font-extrabold text-5xl font-sans max-md:text-3xl max-sm:text-2xl">
                      Tomorrowland 2023
                    </div>
                  </div>
                  <div className=" text-red-400 font-extrabold text-3xl font-sans max-md:text-3xl max-sm:text-2xl">
                    <CountDown />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-row justify-between h-14 items-center max-sm:text-sm">
              <div className="flex items-center gap-3 max-sm:max-w-[148px]">
                <BsCalendar2Week className="text-2xl " /> January 21,2021 -
                January 23,2021
              </div>

              <div className="flex items-center gap-2 text-red-400 font-extrabold text-2xl max-sm:text-sm">
                <MdEventSeat className="text-2xl" />
                500
              </div>

              <div className="flex items-center gap-3 max-sm:text-sm">
                <MdLocationOn className="text-2xl " /> Broadw, New York
              </div>
            </div>
            <hr />
            <br />
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
                <div className="absolute text-black top-1 left-1  max-sm:text-base">
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
          </div>
        </div>
        <div className="max-md:hidden w-[78%] max-2xl:w-11/12 text-8xl font-black font-sans text-white font-outline-2 hover:font-outline-4 opacity-50">
          EVENT DETAILS
        </div>

        <div className="flex flex-row max-md:flex-col  w-[78%] max-2xl:w-11/12  pt-6 max-md:pt-5 gap-5">
          <div className="flex justify-center w-2/3 max-md:w-full flex-col">
            <div className="w-full">
              <div className="text-gray-600 font-semibold text-2xl font-sans mt-4">
                The standard Lorem Ipsum passage, used since the 1500s
              </div>
              <div className="text-gray-800 leading-7 font-semibold text-base font-sans mt-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industrys standard dummy text
                ever since the 1500s, when an unknown printer took a galley of
                type and scrambled it to make a type specimen book. It has
                survived not only five centuries, but also the leap into
                electronic typesetting, remaining essentially unchanged. It was
                popularised in the 1960s with the release of Letraset sheets
                containing Lorem Ipsum passages, and more recently with desktop
                publishing software like Aldus PageMaker including versions of
                Lorem Ipsum
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

          <div className="flex  w-1/3 max-md:w-full">
            <Booths renderedBooth={renderedBooth} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EventDetailedPag4thLayout;
