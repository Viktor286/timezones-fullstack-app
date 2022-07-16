import './index.css';
import { useCallback, useEffect, useRef, useState } from 'react';
import useHeartBeat from '../Hooks/useHeartBeat';
import TimezonesClockItem, { NoTimezonesClockItem } from '../TimezonesClockItem';
import TimezonesClockFilterInput from '../TimezonesClockFilterInput';

export default function TimezonesClocksList({ clocks, removeClockFromList }) {
  const [filteredClocks, setFilteredClocks] = useState(clocks);
  const [isClockFilterActive, setIsClockFilterActive] = useState(false);
  const [filterInput, setFilterInput] = useState('');
  const filterClocksInput = useRef();
  useHeartBeat(15); // clocks heartbeat is once in 15 sec

  const resetFilter = useCallback(() => {
    setIsClockFilterActive(false);
    setFilteredClocks(clocks);
    setFilterInput('');
    filterClocksInput.current.value = '';
  }, [clocks]);

  useEffect(() => {
    if (filterInput.length > 0) {
      const filteredClocks = clocks.filter(
        (clock) => clock.ianaId.toLowerCase().indexOf(filterInput.replaceAll(' ', '_').toLowerCase()) > -1,
      );
      setFilteredClocks(filteredClocks);
      setIsClockFilterActive(true);
    } else {
      resetFilter();
    }

    // if clocks changed, we need recalculate the filteredClocks
  }, [filterInput, clocks, resetFilter]);

  // Apply filtering with the isClockFilterActive gate
  const clockList = isClockFilterActive ? filteredClocks : clocks;

  return (
    <section className="timezones-clocks">
      <TimezonesClockFilterInput ref={filterClocksInput} {...{ setFilterInput, resetFilter }} />
      <ul id="clocks-list">
        {clockList.length ? (
          clockList.map((el) => (
            <TimezonesClockItem key={el.ianaId} clockItem={el} removeClockFromList={removeClockFromList} />
          ))
        ) : (
          <NoTimezonesClockItem resetFilter={resetFilter} />
        )}
      </ul>
    </section>
  );
}
