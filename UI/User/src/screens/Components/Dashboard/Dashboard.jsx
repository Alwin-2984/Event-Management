/* eslint-disable react/prop-types */
import "./navbar.css";
import Footer from "../Footer/Footer";

const Dashboard = ({ renderedEvents, isOrganizer }) => {
  
  return (
    <div className="overflow-y-scroll overflow-x-hidden max-h-[91vh] scroll-smooth">
      {renderedEvents.map((event) => {
        return (
          <div key={event.id} className="movies-list">
            <h1 className="text-black opacity-90  capitalize text-22 font-semibold text-lg ml-[2%] p-[2%3%1%3%]">
              {event.title}
            </h1>
            <div className="card-container">{event.events}</div>
          </div>
        );
      })}
      <Footer isOrganizer={isOrganizer} />
    </div>
  );
};

export default Dashboard;
