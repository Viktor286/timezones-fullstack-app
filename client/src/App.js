import { useState } from 'react';
import './App.css';
import TimezonesSelector from './components/TimezoneSelector';
import ClocksList from './components/ClocksList';
import LogoHeader from './components/LogoHeader';
import { createClockItem } from './model/clockItem';
import { isValidIanaTimezone } from './model/dateTimeZone';
import { setLocalUserTimezoneList } from './model/localStore';

const defaultClocksList = [createClockItem()];

function App({ localUserSettings }) {
  const { timezoneList: localSettingsTimezoneList } = localUserSettings;
  const [clockList, setClockListList] = useState(localSettingsTimezoneList || defaultClocksList);
  const usedIanaIds = clockList.map((e) => e.ianaId);

  const addClockToList = (ianaId) => {
    if (isValidIanaTimezone(ianaId) && !clockList.find((el) => el.ianaId === ianaId)) {
      setClockListList((prevList) => {
        const newClockList = [...prevList, createClockItem(ianaId)];
        setLocalUserTimezoneList(newClockList);
        return newClockList;
      });
      return true;
    }
    return false;
  };

  const removeClockFromList = (ianaId) => {
    if (isValidIanaTimezone(ianaId)) {
      setClockListList((prevList) => {
        const newClockList = prevList.filter((clock) => {
          // don't delete default clock
          if (clock.ianaId === ianaId && !clock.isLocal) {
            return false;
          }
          return true;
        });
        setLocalUserTimezoneList(newClockList);
        return newClockList;
      });
    }
  };

  const updateLocalClock = (ianaId) => {
    if (isValidIanaTimezone(ianaId)) {
      setClockListList((prevList) => {
        const newClockList = prevList.map((clock) => {
          if (clock.isLocal) {
            clock.ianaId = ianaId;
          }
          return clock;
        });
        setLocalUserTimezoneList(newClockList);
        return newClockList;
      });
    }
  };

  return (
    <div className="App">
      <LogoHeader />
      <TimezonesSelector skipIanaIds={usedIanaIds} addClockToList={addClockToList} />
      <ClocksList
        clockList={clockList}
        updateLocalClock={updateLocalClock}
        removeClockFromList={removeClockFromList}
      />
    </div>
  );
}

export default App;
