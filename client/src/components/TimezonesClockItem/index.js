import React from 'react';
import { getDateTimeZone } from '../../model/dateTimeZone';

export default React.memo(function TimezonesClockItem({ clockItem, removeClockFromList }) {
  // abbr: "EDT"
  // day: "Jul 15th"
  // gmtShift: "-04:00"
  // meridiem: "AM"
  // time: "08:16"
  // zoneIana: "America/New_York"
  const { abbr, day, gmtShift, meridiem, time, zoneIana } = getDateTimeZone(clockItem.ianaId);

  return (
    <li>
      {time}&nbsp;{meridiem}&nbsp;
      {zoneIana} {gmtShift} {abbr} {day}
      {!clockItem.isLocal ? <button onClick={() => removeClockFromList(zoneIana)}>✕</button> : null}
    </li>
  );
});
