import Dashboard from "../../Components/Dashboard/Dashboard";
import { GlobalList } from "../../Components/GlobalList";

const OrganiserDashboard = () => {
  const eventList = [
    {
      EventName: "Music Festival",
      EventImage: "https://picsum.photos/2000/300",
      EventCategory: "Music",
      LikeStatus: 1,
    },
    {
      EventName: "Comedy Show",
      EventImage: "https://picsum.photos/2000/300",
      EventCategory: "Comedy",
      LikeStatus: 0,
    },
    {
      EventName: "Art Exhibit",
      EventImage: "https://picsum.photos/2000/300",
      EventCategory: "Art",
      LikeStatus: 0,
    },
    {
      EventName: "Food Festival",
      EventImage: "https://picsum.photos/2000/300",
      EventCategory: "Food",
      LikeStatus: 0,
    },
    {
      EventName: "Sports Tournament",
      EventImage: "https://picsum.photos/2000/300",
      EventCategory: "Sports",
      LikeStatus: 1,
    },
    {
      EventName: "Music Festival",
      EventImage: "https://picsum.photos/2000/300",
      EventCategory: "Music",
      LikeStatus: 1,
    },
    {
      EventName: "Comedy Show",
      EventImage: "https://picsum.photos/2000/300",
      EventCategory: "Comedy",
      LikeStatus: 0,
    },
    {
      EventName: "Art Exhibit",
      EventImage: "https://picsum.photos/2000/300",
      EventCategory: "Art",
      LikeStatus: 1,
    },
    {
      EventName: "Food Festival",
      EventImage: "https://picsum.photos/1999/301",
      EventCategory: "Food",
      LikeStatus: 0,
    },
    {
      EventName: "Sports Tournament",
      EventImage: "https://picsum.photos/2000/301",
      EventCategory: "Sports",
      LikeStatus: 0,
    },
  ];
  const renderedEvents = [
    {
      title: "Currently hosting Events",
      /** Function returns list for provided data GlobalList(listData, conditionFor identify if this function using in Home page  , conditionFor identify if this function using in Speaker) */
      events: GlobalList(eventList, false, true),
    },
  ];
  return <Dashboard renderedEvents={renderedEvents} isOrganizer={true} />;
};

export default OrganiserDashboard;
