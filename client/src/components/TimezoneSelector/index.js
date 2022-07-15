import { useState } from 'react';
import AutocompleteDropdown from './AutocompleteDropdown';
import { getIanaTimeZones } from '../../model/dateTimeZone';
import './index.css';

const timezonesDefault = getIanaTimeZones();

export default function TimezonesSelector({ addClockToList, skipIanaIds }) {
  const timezones = timezonesDefault.filter((tz) => !skipIanaIds.includes(tz));
  const [input, setInput] = useState('');
  const [selectedZoneIdx, setSelectedZoneIdx] = useState(0);
  const [filteredTimezones, setFilteredTimezones] = useState(timezones);
  const [showAutocomplete, setShowShowAutocomplete] = useState(false);

  const resetTimezonesSelector = () => {
    setSelectedZoneIdx(0);
    setFilteredTimezones([]);
    setShowShowAutocomplete(false);
    setInput('');
    document.activeElement.blur();
  };

  const onInputChange = (e) => {
    const inputValue = e.target.value;
    const filtered = timezones.filter(
      (tz) => tz.toLowerCase().indexOf(inputValue.replaceAll(' ', '_').toLowerCase()) > -1,
    );

    setInput(inputValue);
    setSelectedZoneIdx(0);
    setShowShowAutocomplete(true);
    setFilteredTimezones(filtered);
  };

  const onInputFocus = () => {
    // show all timezones on empty input focus
    if (input === '') {
      setFilteredTimezones(timezones);
      setShowShowAutocomplete(true);
      setSelectedZoneIdx(0);
    }
  };

  const onInputBlur = () => {
    setTimeout(() => resetTimezonesSelector(), 200);
  };

  const onTimezoneClick = (e) => {
    const ianaId = e.currentTarget.dataset.iana;
    if (addClockToList(ianaId)) {
      resetTimezonesSelector();
    }
  };

  const onInputKey = (e) => {
    if (e.keyCode === 27) {
      resetTimezonesSelector();
    }
    // Enter
    if (e.keyCode === 13) {
      const ianaId = filteredTimezones[selectedZoneIdx];
      if (addClockToList(ianaId)) {
        resetTimezonesSelector();
      }
    }

    // KeyUp
    const len = filteredTimezones.length;
    if (e.keyCode === 38) {
      const prevIndex = (((selectedZoneIdx - 1) % len) + len) % len;
      setSelectedZoneIdx(prevIndex);
      return;
    }

    // KeyDown
    if (e.keyCode === 40) {
      const nextIndex = (selectedZoneIdx + 1) % len;
      setSelectedZoneIdx(nextIndex);
    }
  };

  return (
    <section className="timezones-selector">
      <div className="adaptive-box">
        <input
          id="timezones-search"
          type="text"
          onChange={onInputChange}
          onKeyDown={onInputKey}
          onFocus={onInputFocus}
          onBlur={onInputBlur}
          value={input}
          placeholder="Input the city"
        />
        {showAutocomplete && (
          <AutocompleteDropdown {...{ filteredTimezones, selectedZoneIdx, onTimezoneClick }} />
        )}
      </div>
    </section>
  );
}
