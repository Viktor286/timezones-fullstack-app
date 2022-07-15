import './index.css';
import TimezonesClockItem from '../TimezonesClockItem';

export default function TimezonesClocksList({ clocks = [], removeClockFromList }) {
  return (
    <section className="timezones-clocks">
      <ul>
        {clocks.map((el) => (
          <TimezonesClockItem key={el.ianaId} clockItem={el} removeClockFromList={removeClockFromList} />
        ))}
      </ul>
    </section>
  );
}
