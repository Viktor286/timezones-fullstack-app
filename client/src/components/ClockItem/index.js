import React from 'react';
import { getDateTimeZone } from '../../model/dateTimeZone';
import { prepareTimeDifferenceStr } from '../../model/clockItem';

export default function ClockItem({ clockItem, removeClockFromList, localIana }) {
  const {
    abbr,
    day,
    gmtShift,
    meridiem,
    time,
    zoneIana,
    hours,
    minutes,
    utcOffset: remoteUtcOffset,
  } = getDateTimeZone(clockItem.ianaId);

  const { utcOffset: localUtcOffset } = getDateTimeZone(localIana);
  const timeDifferenceString = prepareTimeDifferenceStr(localUtcOffset, remoteUtcOffset);

  return (
    <li data-iana={zoneIana}>
      {time}&nbsp;{meridiem}&nbsp;({hours}:{minutes})&nbsp;({abbr}) &nbsp;
      {zoneIana} GMT{gmtShift} {day} ({timeDifferenceString})
      {!clockItem.isLocal ? (
        <button className="remove" onClick={() => removeClockFromList(zoneIana)}>
          ✕
        </button>
      ) : null}
    </li>
  );
}

export function NoClockItem({ resetFilter }) {
  return (
    <li>
      no clocks to show
      <button className="item-reset-filter" onClick={resetFilter}>
        reset filter
      </button>
    </li>
  );
}
