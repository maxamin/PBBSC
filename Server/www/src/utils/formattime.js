export function formatTime(time) {
    let formattedTime = "";
    if (time < 60) {
      formattedTime = `${time} second${time === 1 ? "" : "s"}`;
    } else if (time < 3600) {
      const minutes = Math.floor(time / 60);
      formattedTime = `${minutes} minute${minutes === 1 ? "" : "s"}`;
    } else if (time < 86400) {
      const hours = Math.floor(time / 3600);
      formattedTime = `${hours} hour${hours === 1 ? "" : "s"}`;
    } else {
      const days = Math.floor(time / 86400);
      formattedTime = `${days} day${days === 1 ? "" : "s"}`;
    }
    return formattedTime;
}