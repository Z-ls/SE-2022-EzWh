const dayjs = require('dayjs');

class dateHandler {
  /**
     * 
     * @param {dayjs.Dayjs} date
     * @returns {string} the string with format YYYY/MM/DD
     */
  DayjsToDate = (date) => dayjs.unix(date).format('YYYY/MM/DD');

  /**
   * 
   * @param {dayjs.Dayjs} date
   * @returns {string} the string with format YYYY/MM/DD HH:mm
   */
  DayjsToDateAndTime = (date) => date.format('YYYY/MM/DD HH:mm');
}

module.exports = dateHandler;