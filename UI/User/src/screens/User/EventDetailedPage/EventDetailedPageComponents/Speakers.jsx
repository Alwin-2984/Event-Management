export function Speakers(renderedEvents) {
  return (
    
      <div className="mb-5">
        {renderedEvents.map((event) => {
          return (
            <div key={event.id} className="w-full h-full relative">
              <h1 className="text-black opacity-90  capitalize text-22 font-semibold text-lg ml-[2%] p-[1%3%1%3%]">
                {event.title}
              </h1>
              <div className="relative w-full flex items-center flex-wrap justify-center gap-x-5 gap-y-10 ">
                {event.events}
              </div>
            </div>
          );
        })}
      </div>
   
  );
}
