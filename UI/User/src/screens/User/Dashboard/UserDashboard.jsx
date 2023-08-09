import { GlobalList } from "../../Components/GlobalList";
import Dashboard from "../../Components/Dashboard/Dashboard";
import { DummyData, eventList2 } from "../DummyData.jsx/DummyData";

const UserDashboard = () => {
  const eventList = DummyData;

  const renderedEvents = [
    {
      title: "Favorite Events",
      events: GlobalList(eventList, false, true),
    },
    /**Function returns list for provided data GlobalList(listData, conditionFor identify if this function using in Home page  , conditionFor identify if this function using in Speaker) */
    { title: "Popular Events", events: GlobalList(eventList2, false, true) },
  ];
  return <Dashboard renderedEvents={renderedEvents} />;
};

export default UserDashboard;
