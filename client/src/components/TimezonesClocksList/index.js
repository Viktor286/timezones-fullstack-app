import './index.css';
import ClockItem from '../ClockItem';

export default function TimezonesClocksList({ clocks = [], removeClockFromList }) {
  return (
    <section className="timezones-clocks">
      <ul>
        {clocks.map((el) => (
          <ClockItem key={el.ianaId} clockItem={el} removeClockFromList={removeClockFromList} />
        ))}
      </ul>
    </section>
  );
}
