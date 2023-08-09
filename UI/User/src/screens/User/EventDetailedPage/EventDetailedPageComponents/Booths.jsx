import PropTypes from "prop-types";
export default function Booths({
  renderedBooth,
  isTheme1,
  isTheme2,
  isTheme3,
  isTheme4,
}) {
  console.log("🚀 ~ file: Booths.jsx:9 ~ renderedBooth:", renderedBooth)
  const theme1CSS = "overflow-y-auto max-h-[60vh]";
  const theme2CSS = "overflow-y-auto max-h-[85vh] max-md:max-h-[60vh]  ";
  const theme3CSS = "overflow-y-auto max-h-[85vh]";
  const theme4CSS = "overflow-y-auto max-h-[85vh] max-md:max-h-[60vh]";

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
  const getevent = (e) => {
    if (e.target.scrollTop == e.target.scrollHeight - e.target.clientHeight) {
      alert("Infinate Scroll  function is working");
    }
  };
  return (
    <div className={`mb-5${isTheme3 && " sticky top-0"}`}>
      {renderedBooth.map((event) => {
        return (
          <div key={event.id} className="w-full h-full relative">
            <h1 className="text-black opacity-90  capitalize text-22 font-semibold text-lg ml-[2%] p-[1%3%1%3%]">
              {event.title}
            </h1>
            
            <div
              onScroll={getevent}
              className={` w-full  flex items-center flex-wrap justify-center gap-x-5 gap-y-10 ${
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

Booths.propTypes = {
  isTheme1: PropTypes.string,
  isTheme2: PropTypes.any,
  isTheme3: PropTypes.any,
  isTheme4: PropTypes.any,
  renderedBooth: PropTypes.shape({
    map: PropTypes.func,
  }),
};
