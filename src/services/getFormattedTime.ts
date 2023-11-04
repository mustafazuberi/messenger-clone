const getFormattedTime = (milliSeconds: number): string => {
  const timestamp = milliSeconds;
  const date = new Date(timestamp);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const timeString = `${hours}:${minutes}`;
  return timeString;
};



export default getFormattedTime;
