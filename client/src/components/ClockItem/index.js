import React from 'react';
import { getDateTimeZone, prepareTimeDifferenceStr } from '../../model/dateTimeZone';
import ClockGraphics from '../ClockGraphics';
import './index.css';

export default function ClockItem({ clockItem, removeClockFromList, localIana, updateLocalClock }) {
  const {
    abbr,
    day,
    gmtShift,
    meridiem,
    time,
    zoneIana,
    hours,
    minutes,
    seconds,
    utcOffset: remoteUtcOffset,
  } = getDateTimeZone(clockItem.ianaId);

  const { utcOffset: localUtcOffset } = getDateTimeZone(localIana);
  const timeDifferenceString = prepareTimeDifferenceStr(localUtcOffset, remoteUtcOffset);

  return (
    <li data-iana={zoneIana}>
      <ClockGraphics {...{ h: parseInt(hours), m: parseInt(minutes), s: parseInt(seconds) }} />
      <section>
        {time}&nbsp;{meridiem}&nbsp;({hours}:{minutes})&nbsp;({abbr}) &nbsp;
        {zoneIana} <br />
        GMT{gmtShift} {day} ({timeDifferenceString})
        {!clockItem.isLocal ? (
          <>
            <button className="remove" onClick={() => removeClockFromList(zoneIana)}>
              ✕
            </button>
            <button
              className="update-local-clock"
              onClick={() => {
                updateLocalClock(zoneIana);
                removeClockFromList(zoneIana);
              }}
            >
              🏠 make this your local clock
            </button>
          </>
        ) : null}
      </section>
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
