import React from 'react';
import { getDateTimeZone, prepareTimeDifferenceStr } from '../../model/dateTimeZone';
import ClockGraphics from '../ClockGraphics';
import './index.css';

export default function ClockItem({ clockItem, localIana, removeClockFromList, updateLocalClock }) {
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
      <div className="update-local-clock-box">
        {clockItem.isLocal ? (
          <div className="i-am-here">(I am here)</div>
        ) : (
          <button className="update-local-clock" onClick={() => updateLocalClock(zoneIana)}>
            🏠 make this your local clock
          </button>
        )}
      </div>

      <section className="timezone-numbers">{timeDifferenceString}h</section>
      <ClockGraphics {...{ h: parseInt(hours), m: parseInt(minutes), s: parseInt(seconds) }} />
      <section className="timezone-title">
        <h2>
          {zoneIana}
          {!clockItem.isLocal ? (
            <button className="remove" onClick={() => removeClockFromList(zoneIana)}>
              ✕
            </button>
          ) : null}
        </h2>
        {time}&nbsp;{meridiem} ({abbr}) {day}
        <br />
        <span className="gmt">{gmtShift}</span>
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
