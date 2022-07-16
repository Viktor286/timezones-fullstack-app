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
        const targetIdx = prevList.findIndex((e) => e.ianaId === ianaId);

        // trying convention to keep the local zone as always fist object
        const newClockList = [...prevList];
        newClockList[0] = createClockItem(ianaId, true);
        newClockList[targetIdx] = createClockItem(prevList[0].ianaId);

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
        addClockToList={addClockToList}
      />
    </div>
  );
}

export default App;
