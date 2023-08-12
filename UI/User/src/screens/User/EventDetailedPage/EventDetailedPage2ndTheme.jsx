import PropTypes from "prop-types"
import Footer from "../../Components/Footer/Footer";
import { GlobalList } from "../../Components/GlobalList";
import Booths from "./EventDetailedPageComponents/Booths";
import Canvas from "./EventDetailedPageComponents/Canvas";
import MainImageAndDetails from "./EventDetailedPageComponents/MainImageAndDetails";

const EventDetailedPage2ndTheme = ({DummyData}) => {
  // const CanvasImageVar =
  //   "https://media2.giphy.com/media/3og0IFELH2AXdKM0es/giphy.gif?cid=790b7611dvici5zym8dcq5subwn4ecznqqge9gqn6ey41f4w&ep=v1_gifs_search&rid=giphy.gif&ct=g";
  const SpeakerListData = DummyData;

  const bg = {
    backgroundImage: `linear-gradient(rgba(45,55,60,.9) 100%,rgba(45,55,60,.9) 0), url(${SpeakerListData.EventSubImage})`,
  };

  /**
   * renders  list
   */
  const renderedEvents = [
    /** Function returns list for provided data GlobalList(listData, conditionFor identify if this function using in Speaker  ) */
    {
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
    <div className="max-h-[calc(100vh-90px)] overflow-y-scroll overflow-x-hidden">
      <div className="flex flex-col items-center h-full  pb-20">
        <Canvas SpeakerListData={SpeakerListData} bg={bg} />
        <div className="max-md:hidden w-[78%] max-2xl:w-11/12 text-8xl font-black font-sans text-white font-outline-2 hover:font-outline-4 opacity-50">
          EVENT DETAILS 
        </div>

        <div className="flex flex-row max-md:flex-col  w-[78%] max-2xl:w-11/12  pt-6 max-md:pt-5 gap-5">
          <div className="flex justify-center w-2/3 max-md:w-full ">
            <MainImageAndDetails
              renderedSponsers={renderedSponsers}
              renderedEvents={renderedEvents}
              SpeakerListData={SpeakerListData}
            />
          </div>

          <div className="flex  w-1/3 max-md:w-full">
            <Booths renderedBooth={renderedBooth} isTheme2/>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

EventDetailedPage2ndTheme.propTypes = {
  DummyData: PropTypes.any
}

export default EventDetailedPage2ndTheme;
