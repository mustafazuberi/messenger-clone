import { useEffect, useState } from "react";

const AudioCalTimer: React.FC<{ startTime: number }> = ({ startTime }) => {
  const calculateTimeDifference = () => {
    const currentTime = Date.now();
    const timeDifference = currentTime - startTime;

    if (timeDifference >= 0) {
      // Calculate the elapsed time since the start time
      const elapsedSeconds = Math.floor(timeDifference / 1000);
      const elapsedMinutes = Math.floor(elapsedSeconds / 60);
      const elapsedHours = Math.floor(elapsedMinutes / 60);
      const elapsedDays = Math.floor(elapsedHours / 24);

      setDays(elapsedDays);
      setHours(elapsedHours % 24);
      setMinutes(elapsedMinutes % 60);
      setSeconds(elapsedSeconds % 60);
    } else {
      // Timer hasn't started yet, calculate time until start
      const remainingTime = Math.abs(timeDifference);
      const remainingSeconds = Math.floor(remainingTime / 1000);
      const remainingMinutes = Math.floor(remainingSeconds / 60);
      const remainingHours = Math.floor(remainingMinutes / 60);
      const remainingDays = Math.floor(remainingHours / 24);

      setDays(remainingDays);
      setHours(remainingHours % 24);
      setMinutes(remainingMinutes % 60);
      setSeconds(remainingSeconds % 60);
    }
  };

  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => calculateTimeDifference(), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <h6>
      {days} : {hours} : {minutes} : {seconds}
    </h6>
  );
};

export default AudioCalTimer;
