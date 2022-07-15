import './index.css';
import { getDateTimeZone } from '../../model/dateTimeZone';

function ClockItem({ abbr, day, gmtShift, meridiem, time, zoneIana }) {
  // abbr: "EDT"
  // day: "Jul 15th"
  // gmtShift: "-04:00"
  // meridiem: "AM"
  // time: "08:16"
  // zoneIana: "America/New_York"

  return (
    <div>
      {time}&nbsp;{meridiem}&nbsp;
      {zoneIana} {gmtShift} {abbr} {day}
    </div>
  );
}

export default function TimezonesClocks({ clocks = [] }) {
  return (
    <section className="timezones-clocks">
      <ul>
        {clocks.map((el) => {
          return <li key={el.ianaId}>{ClockItem(getDateTimeZone(el.ianaId))}</li>;
        })}
      </ul>
    </section>
  );
}
