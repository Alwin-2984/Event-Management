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
import { sponsors } from "./EventDetailedPageComponents/sponsors";
import Booths from "./EventDetailedPageComponents/Booths";
import { Speakers } from "./EventDetailedPageComponents/Speakers";
import CountDown from "./EventDetailedPageComponents/CountDown";
import { DummyData } from "../DummyData.jsx/DummyData";
import Footer from "../../Components/Footer/Footer";

const EventDetailedPage1thTheme = () => {
  // const CanvasImageVar = "/bg.png";

  // const bg = {
  //   backgroundImage: `url(${CanvasImageVar})`,
  // };

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
    <div className="max-h-[calc(100vh-90px)] overflow-y-scroll overflow-x-hidden bg-cover bg-no-repeat bg-center">
      <div className="flex flex-col items-center h-full pb-20">
        {/* <Canvas bg={bg}/> */}
        <div className="w- flex w-10/12 max-2xl:w-11/12 flex-row justify-center  mt-8  items-end max-sm:mb-7">
          <div className="flex justify-between w-10/12 max-md:w-full">
            {" "}
            <div className="text-gray-600 font-extrabold text-5xl font-sans max-md:text-3xl max-sm:text-2xl">
              ROYAL KAPPIKUDI EVENT 
            </div>
            <div className=" text-red-400 font-extrabold text-3xl font-sans max-md:text-3xl max-sm:text-2xl">
              <CountDown />
            </div>
          </div>
        </div>

        <div className="flex justify-center  w-10/12 max-2xl:w-11/12  pt-10 max-md:pt-5 gap-5">
          <div className="flex justify-center w-10/12 max-md:w-full ">
            <div className="">
              <img
                className="w-full   object-contain md:object-scale-down object-left-top"
                src="https://picsum.photos/1920/1080"
                alt=""
              />
              <div className="flex flex-row justify-between h-14 items-center max-sm:text-sm mt-3">
                <div className="max-sm:text-xs">
                  <MdCategory className="text-3xl" />
                  Music
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
              <div><br /><hr /></div>
              <div className="flex flex-row justify-between h-14 items-center max-sm:text-sm">
                <div className="flex items-center gap-3 max-sm:max-w-[148px]">
                  <BsCalendar2Week className="text-2xl " />{" "}
                  January 21,2021 - January 23,2021
                </div>

                <div className="flex items-center gap-2 text-red-400 font-extrabold text-2xl max-sm:text-sm">
                  <MdEventSeat className="text-2xl" />
                  500
                </div>

                <div className="flex items-center gap-3 max-sm:text-sm">
                  <MdLocationOn className="text-2xl " /> Broadw, New York
                </div>
              </div>

              <div className="w-full">
                <div className="text-gray-600 font-semibold text-2xl font-sans mt-4">
                  The standard Lorem Ipsum passage, used since the 1500s
                </div>
                <div className="text-gray-800 leading-7 font-semibold text-base font-sans mt-4">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                  irure dolor in reprehenderit in voluptate velit esse cillum
                  dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                  cupidatat non proident, sunt in culpa qui officia deserunt
                  mollit anim id est laborum Lorem Ipsum is simply dummy text of
                  the printing and typesetting industry. Lorem Ipsum has been
                  the industrys standard dummy text ever since the 1500s, when
                  an unknown printer took a galley of type and scrambled it to
                  make a type specimen book. It has survived not only five
                  centuries, but also the leap into electronic typesetting,
                  remaining essentially unchanged. It was popularised in the
                  1960s with the release of Letraset sheets containing Lorem
                  Ipsum passages, and more recently with desktop publishing
                  software like Aldus PageMaker including versions of Lorem
                  Ipsum
                </div>
              </div>
              <div>
                <br />
                <br />
                <hr />
                <hr />
              </div>
              <div className="w-full">{sponsors(renderedSponsers)}</div>
              <div>
                <br />
                <br />
                <hr />
                <hr />
              </div>
              <div className="w-full">{Speakers(renderedEvents)}</div>
              <div>
                <br />
                <br />
                <hr />
                <hr />
              </div>
              <div className="w-full">
                <Booths renderedBooth={renderedBooth} />
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

export default EventDetailedPage1thTheme;
