import PropTypes from "prop-types";
export default function Speakers({
  renderedEvents,
  isTheme1,
  isTheme2,
  isTheme3,
  isTheme4,
}) {
  const theme1CSS = "overflow-y-auto max-h-[60vh]";
  const theme2CSS = "overflow-y-auto max-h-[60vh]";
  const theme3CSS = "overflow-y-auto max-h-[60vh]";
  const theme4CSS = "overflow-y-auto max-h-[60vh]";

  let currentCSS = "";

  if (isTheme1) {
    currentCSS += theme1CSS;
  } else if (isTheme2) {
    currentCSS += theme2CSS;
  } else if (isTheme3) {
    currentCSS += theme3CSS;
  } else if (isTheme4) {
    currentCSS += theme4CSS;
  }

  return (
    <div className="mb-5">
      {renderedEvents.map((event) => {
        console.log(
          "🚀 ~ file: Speakers.jsx:6 ~ {renderedEvents.map ~ event.events:",
          event.events.length
        );

        return (
          <div key={event.id} className="w-full h-full relative">
            <h1 className="text-black opacity-90  capitalize text-22 font-semibold text-lg ml-[2%] p-[1%3%1%3%]">
              {event.title}
            </h1>
            <div
              className={`relative w-full flex items-center flex-wrap justify-center gap-x-5 gap-y-10 ${
                event.events.length >= 18 && currentCSS
              }`}
            >
              {event.events}
            </div>
          </div>
        );
      })}
    </div>
  );
}

Speakers.propTypes = {
  isTheme1: PropTypes.string,
  isTheme2: PropTypes.any,
  isTheme3: PropTypes.any,
  isTheme4: PropTypes.any,
  renderedEvents: PropTypes.shape({
    map: PropTypes.func,
  }),
};
{
  /* <div className="mb-5">
{renderedEvents.map((event) => {
  console.log(
    "🚀 ~ file: Speakers.jsx:6 ~ {renderedEvents.map ~ event.events:",
    event.events.length
  );

  return (
    <div key={event.id} className="w-full h-full relative">
      <h1 className="text-black opacity-90  capitalize text-22 font-semibold text-lg ml-[2%] p-[1%3%1%3%]">
        {event.title}
      </h1>
      <div
        className={`relative w-full flex items-center flex-wrap justify-center gap-x-5 gap-y-10 ${
          (isTheme1 || (isTheme3 && event.events.length >= 8)) &&
          currentCSS
        }`}
      >
        {event.events}
      </div>
    </div>
  );
})}
</div> */
}
