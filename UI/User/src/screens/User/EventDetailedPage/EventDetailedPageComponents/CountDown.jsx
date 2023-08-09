import PropTypes from "prop-types";
import { useState, useEffect, useCallback, useMemo } from "react";

/**
 * Countdown component that displays the remaining time between a starting date
 * and the current date in days, hours, minutes, and seconds.
 */
const CountDown = ({ StartDate }) => {
  // Replace with the desired starting date
  const startingDate = useMemo(() => new Date(StartDate), [StartDate]);

  // Calculate initial time remaining
  const currentTime = new Date().getTime();
  const timeRemaining = startingDate.getTime() - currentTime;

  const [remaining, setRemaining] = useState(timeRemaining);

  /**
   * Calculates the updated time remaining and updates the state.
   */
  const calculateTimeRemaining = useCallback(() => {
    const updatedTimeRemaining = startingDate.getTime() - new Date().getTime();
    setRemaining(updatedTimeRemaining);
  }, [startingDate]);

  useEffect(() => {
    // Update time remaining every second
    const interval = setInterval(calculateTimeRemaining, 1000);

    // Clear interval when component unmounts
    return () => {
      clearInterval(interval);
    };
  }, [calculateTimeRemaining]);

  /**
   * Formats time in days, hours, minutes, and seconds.
   * @param {number} time - Time in milliseconds.
   * @returns {string} Formatted time string.
   */
  const formatTime = (time) => {
    const days = Math.floor(time / (1000 * 60 * 60 * 24));
    const hours = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((time % (1000 * 60)) / 1000);

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  return <div>{formatTime(remaining)}</div>;
};

CountDown.propTypes = {
  StartDate: PropTypes.any,
};

export default CountDown;
