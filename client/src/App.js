import { useState } from 'react';
import './App.css';
import TimezonesSelector from './components/TimezoneSelector';
import TimezonesClocks from './components/TimezonesClocks';
import { createClockItem } from './model/clockItem';
import { isValidIanaTimezone } from './model/dateTimeZone';

const defaultClocksList = [createClockItem()];

function App() {
  const [clocks, setClocksList] = useState(defaultClocksList);
  const usedIanaIds = clocks.map((e) => e.ianaId);

  const addClockToList = (ianaId) => {
    if (isValidIanaTimezone(ianaId) && !clocks.find((el) => el.ianaId === ianaId)) {
      setClocksList((prevList) => [createClockItem(ianaId), ...prevList]);
      return true;
    }
    return false;
  };

  return (
    <div className="App">
      <h1>Timezones Clock ⏰</h1>
      <TimezonesSelector addClockToList={addClockToList} skipIanaIds={usedIanaIds} />
      <TimezonesClocks clocks={clocks} />
    </div>
  );
}

export default App;
