import { useState } from 'react';
import './App.css';
import TimezonesSelector from './components/TimezoneSelector';
import ClocksList from './components/ClocksList';
import LogoHeader from './components/LogoHeader';
import { createClockItem } from './model/clockItem';
import { isValidIanaTimezone } from './model/dateTimeZone';

const defaultClocksList = [createClockItem()];

function App() {
  const [clocks, setClocksList] = useState(defaultClocksList);
  const usedIanaIds = clocks.map((e) => e.ianaId);

  const addClockToList = (ianaId) => {
    if (isValidIanaTimezone(ianaId) && !clocks.find((el) => el.ianaId === ianaId)) {
      setClocksList((prevList) => [...prevList, createClockItem(ianaId)]);
      return true;
    }
    return false;
  };

  const removeClockFromList = (ianaId) => {
    if (isValidIanaTimezone(ianaId)) {
      setClocksList((prevList) => {
        return prevList.filter((clock) => {
          // don't delete default clock
          if (clock.ianaId === ianaId && !clock.isLocal) {
            return false;
          }
          return true;
        });
      });
    }
  };

  const updateLocalClock = (ianaId) => {
    if (isValidIanaTimezone(ianaId)) {
      setClocksList((prevList) => {
        return prevList.map((clock) => {
          if (clock.isLocal) {
            clock.ianaId = ianaId;
          }
          return clock;
        });
      });
    }
  };

  return (
    <div className="App">
      <LogoHeader />
      <TimezonesSelector
        skipIanaIds={usedIanaIds}
        addClockToList={addClockToList}
        updateLocalClock={updateLocalClock}
      />
      <ClocksList removeClockFromList={removeClockFromList} clocks={clocks} />
    </div>
  );
}

export default App;
