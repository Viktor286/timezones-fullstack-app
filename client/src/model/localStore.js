const localStorageAppKey = 'timezonesApp';

export function getLocalUserSettings() {
  const localUserSettings = window.localStorage.getItem(localStorageAppKey);
  try {
    return JSON.parse(localUserSettings) || {};
  } catch (e) {
    console.error('Local user settings not found');
    return {};
  }
}

export function setLocalUserSettings(localUserSettings) {
  try {
    window.localStorage.setItem(localStorageAppKey, JSON.stringify(localUserSettings));
    return true;
  } catch (e) {
    console.error('Error occurred while setting local user settings');
    return false;
  }
}

export function getLocalUserTimezoneList() {
  const localUserSettings = getLocalUserSettings();
  const { timezoneList = [] } = localUserSettings;
  return timezoneList;
}

export function setLocalUserTimezoneList(timezoneList) {
  setLocalUserSettings({ timezoneList });
}
