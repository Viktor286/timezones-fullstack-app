import moment from 'moment-timezone';

export function getIanaTimeZones() {
  // Moment.js library vs window.Intl usage stat:
  // 1) Intl.supportedValuesOf('timeZone'); // 428 iana zones
  // 2) moment.tz.names(); // 594 iana zones
  // Bundle size with Moment.js 425kb vs without it 359kb = diff +66kb gzip
  // (results obtained via network request tab)
  return moment.tz.names().filter((e) => e !== 'Universal'); // rm Universal edge case
}

export function getDateTimeZone(iana = 'Greenwich') {
  const d = new Date();
  const momentObject = iana === 'Greenwich' ? moment.utc(d) : moment.utc(d).tz(iana);
  return utcToData(momentObject);
}

function utcToData(moment) {
  // https://momentjs.com/docs/#/displaying/format/
  // https://momentjs.com/timezone/docs/#/using-timezones/formatting/

  return {
    time: moment.format('hh:mm'), // '09:20'
    meridiem: moment.format('A'), // 'PM'
    day: moment.format('MMM Do'), // 'Jul 14th'
    zoneIana: moment._z?.name || 'Greenwich', // 'America/New_York'. TODO: is 'Greenwich' ok for 0-GMT ?
    gmtShift: moment.format('Z'), // '-04:00'
    abbr: moment.format('z'), // "PDT"
  };
}
