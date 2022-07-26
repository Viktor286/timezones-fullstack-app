import { useEffect, useState } from 'react';
import './App.css';
import TimezonesSelector from './components/TimezoneSelector';
import ClocksList from './components/ClocksList';
import LoginForm from './components/LoginForm';
import LogoHeader from './components/LogoHeader';
import AdminSideBar from './components/AdminSideBar';
import { createClockItem } from './model/clockItem';
import { isValidIanaTimezone } from './model/dateTimeZone';
import { setLocalUserTimezoneList } from './model/localStore';
import { getUserTimezones, setUserTimezones } from './requests/user';
import { parseJwt } from './utils/misc.js';

const defaultClocksList = [createClockItem()];

function App({ localUserSettings, localUserAuth }) {
  const { timezoneList: localSettingsTimezoneList } = localUserSettings;
  const [clockList, setClockListList] = useState(localSettingsTimezoneList || defaultClocksList);

  const [auth, setAuth] = useState(localUserAuth || {});
  const usedIanaIds = clockList.map((e) => e.ianaId);

  const addClockToList = (ianaId) => {
    if (isValidIanaTimezone(ianaId) && !clockList.find((el) => el.ianaId === ianaId)) {
      setClockListList((prevList) => {
        const newClockList = [...prevList, createClockItem(ianaId)];
        setLocalUserTimezoneList(newClockList);
        setUserTimezones(newClockList, auth);
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
        setUserTimezones(newClockList, auth);
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
        setUserTimezones(newClockList, auth);
        return newClockList;
      });
    }
  };

  useEffect(() => {
    if (auth.token) {
      const getUserData = async () => {
        const timezones = await getUserTimezones(auth);
        if (timezones.length > 0) {
          setClockListList(timezones);
        }
      };

      // todo: we should verify signature of the jwt to ensure it hasn't been tempered
      const token = parseJwt(auth.token);
      const currentTimeSec = Math.floor(Date.now() / 1000);
      if (token.exp <= currentTimeSec) {
        // Token expired
      } else {
        getUserData();
      }
    }
  }, [auth]);

  return (
    <div className="app">
      {auth.role === 'admin' || auth.role === 'manager' ? <AdminSideBar auth={auth} /> : null}
      <main>
        <LogoHeader />
        <LoginForm auth={auth} setAuth={setAuth} setClockListList={setClockListList} />
        <TimezonesSelector skipIanaIds={usedIanaIds} addClockToList={addClockToList} />
        <ClocksList
          clockList={clockList}
          updateLocalClock={updateLocalClock}
          removeClockFromList={removeClockFromList}
          addClockToList={addClockToList}
        />
      </main>
    </div>
  );
}

export default App;
