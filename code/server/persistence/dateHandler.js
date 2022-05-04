import dayjs, { Dayjs } from 'dayjs';

class dateHandler {
  /**
   * Used to convert the dayjs object to the timestamp.
   * @param {Dayjs} date 
   * @returns the Unix timestamp (the number of seconds since the Unix Epoch) of the Day.js object
   */
  dateToTimestamp = (date) => date.unix();

  /**
   * 
   * @param {number} timestamp
   * @returns 
   */
  timestampToDayjs = (timestamp) => dayjs.unix(timestamp);
}

export { dateHandler }