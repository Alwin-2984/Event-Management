import Footer from "../../Components/Footer/Footer";
import { GlobalList } from "../../Components/GlobalList";
import { DummyData } from "../DummyData.jsx/DummyData";
import Booths from "./EventDetailedPageComponents/Booths";
import Canvas from "./EventDetailedPageComponents/Canvas";
import MainImageAndDetails from "./EventDetailedPageComponents/MainImageAndDetails";

const EventDetailedPage2ndTheme = () => {
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
      <div className="flex flex-col items-center h-full pb-20">
        <Canvas bg={bg} />
        <div className="max-md:hidden w-[78%] max-2xl:w-11/12 text-8xl font-black font-sans text-white font-outline-2 hover:font-outline-4 opacity-50">
          EVENT DETAILS
        </div>

        <div className="flex flex-row max-md:flex-col  w-[78%] max-2xl:w-11/12  pt-10 max-md:pt-5 gap-5">
          <div className="flex justify-center w-2/3 max-md:w-full ">
            <MainImageAndDetails
              renderedSponsers={renderedSponsers}
              renderedEvents={renderedEvents}
            />
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

export default EventDetailedPage2ndTheme;
