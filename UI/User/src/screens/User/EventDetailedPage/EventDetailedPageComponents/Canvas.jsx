import PropTypes from "prop-types";
import { BsCaretRight } from "react-icons/bs";
import CountDown from "./CountDown";

export default function Canvas({ bg }) {
  return (
    <div
      style={bg}
      className="bg-cover bg-no-repeat	relative text-white flex justify-center items-center w-full h-[36rem] bg-center  max-md:max-h-96 max-sm:items-end max-sm:mb-7"
    >
      <div className="flex w-3/4   max-2xl:w-11/12">
        <div className="w-full flex flex-row justify-between mt-[16%] items-end max-sm:mb-7">
          <div>
            <div className="text-white font-extrabold text-5xl font-sans max-md:text-3xl max-sm:text-2xl">
              ROYAL KAPPIKUDI EVENT
            </div>
            <div className=" flex flex-row items-center text-white font-light text-xl font-mono">
              Home <BsCaretRight /> &nbsp;
              <div className="text-red-400 font-light text-xl ">
                Event Details
              </div>
            </div>
          </div>
          <div className=" text-red-400 font-extrabold text-3xl font-sans max-md:text-3xl max-sm:text-2xl">
            <CountDown />
          </div>
        </div>
      </div>
    </div>
  );
}

Canvas.propTypes = {
  bg: PropTypes.any,
};
