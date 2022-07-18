import './index.css';
import { useCallback, useEffect, useRef, useState } from 'react';
import useHeartBeat from '../Hooks/useHeartBeat';
import ClockItem, { NoClockItem } from '../ClockItem';
import ClockFilterInput from '../ClockFilterInput';

export default function ClocksList({ clockList, removeClockFromList, heartBeat, updateLocalClock }) {
  const [filteredClocks, setFilteredClocks] = useState(clockList);
  const [isClockFilterActive, setIsClockFilterActive] = useState(false);
  const [filterInput, setFilterInput] = useState('');
  const filterClocksInput = useRef();
  useHeartBeat(1); // clocks heartbeat is once in 1 sec

  const resetFilter = useCallback(() => {
    setIsClockFilterActive(false);
    setFilteredClocks(clockList);
    setFilterInput('');
    filterClocksInput.current.value = '';
  }, [clockList]);

  useEffect(() => {
    if (filterInput.length > 0) {
      const filteredClocks = clockList.filter(
        (clock) => clock.ianaId.toLowerCase().indexOf(filterInput.replaceAll(' ', '_').toLowerCase()) > -1,
      );
      setFilteredClocks(filteredClocks);
      setIsClockFilterActive(true);
    } else {
      resetFilter();
    }

    // if clocks changed, we need recalculate the filteredClocks
  }, [filterInput, clockList, resetFilter]);

  // Apply filtering with the isClockFilterActive gate
  const finalClockList = isClockFilterActive ? filteredClocks : clockList;

  return (
    <section className="timezones-clocks">
      <ClockFilterInput ref={filterClocksInput} {...{ setFilterInput, resetFilter, filterInput }} />
      <ul id="clocks-list">
        {finalClockList.length ? (
          finalClockList.map((el) => {
            const localIanaId = finalClockList[0]?.ianaId;
            return (
              <ClockItem
                key={el.ianaId}
                clockItem={el}
                heartBeat={heartBeat}
                localIana={localIanaId}
                updateLocalClock={updateLocalClock}
                removeClockFromList={removeClockFromList}
              />
            );
          })
        ) : (
          <NoClockItem resetFilter={resetFilter} />
        )}
      </ul>
    </section>
  );
}
