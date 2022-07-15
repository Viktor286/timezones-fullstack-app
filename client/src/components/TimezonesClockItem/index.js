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
    <li data-iana={zoneIana}>
      {time}&nbsp;{meridiem}&nbsp; ({abbr}) &nbsp;
      {zoneIana} GMT{gmtShift} {day}
      {!clockItem.isLocal ? (
        <button className="remove" onClick={() => removeClockFromList(zoneIana)}>
          ✕
        </button>
      ) : null}
    </li>
  );
});

export function NoTimezonesClockItem({ resetFilter }) {
  return (
    <li>
      no clocks to show
      <button className="item-reset-filter" onClick={resetFilter}>
        reset filter
      </button>
    </li>
  );
}
