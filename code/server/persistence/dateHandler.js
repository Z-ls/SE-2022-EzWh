const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);

class dateHandler {
  /**
     * 
     * @param {dayjs.Dayjs} date
     * @returns {string} the string with format YYYY/MM/DD
     */
  DayjsToDate = (date) => date.format('YYYY/MM/DD');

  /**
   * 
   * @param {dayjs.Dayjs} date
   * @returns {string} the string with format YYYY/MM/DD HH:mm
   */
  DayjsToDateAndTime = (date) => date.format('YYYY/MM/DD HH:mm');

  /**
   * 
   * @param {string} date with format `YYYY/MM/DD`
   * @returns {boolean}
   */
   isDateValid = (date) => dayjs(date, 'YYYY/MM/DD', true).isValid();
  

  /**
   * 
   * @param {string} date with format `YYYY/MM/DD HH:mm`
   * @returns {boolean}
   */
  isDateAndTimeValid = (date) => dayjs(date, 'YYYY/MM/DD HH:mm', true).isValid();
}

module.exports = dateHandler;