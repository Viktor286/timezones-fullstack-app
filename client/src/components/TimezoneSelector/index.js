import { useState } from 'react';
import AutocompleteDropdown from './AutocompleteDropdown';
import { getDateTimeZone, getIanaTimeZones } from '../../model/getDateTimeZone';
import './index.css';

const timezones = getIanaTimeZones();

// todo: delete after verification
console.log('UTC', getDateTimeZone());
console.log('LOCAL', getDateTimeZone('America/New_York'));

export default function TimezonesSelector() {
  const [input, setInput] = useState('');
  const [selectedZoneIdx, setSelectedZoneIdx] = useState(0);
  const [filteredTimezones, setFilteredTimezones] = useState([]);
  const [showAutocomplete, setShowShowAutocomplete] = useState(false);

  const onInputChange = (e) => {
    const inoutValue = e.target.value;
    const filtered = timezones.filter((tz) => tz.toLowerCase().indexOf(inoutValue.toLowerCase()) > -1);

    setInput(inoutValue);
    setSelectedZoneIdx(0);
    setShowShowAutocomplete(true);
    setFilteredTimezones(filtered);
  };

  const onTimezoneClick = (e) => {
    setSelectedZoneIdx(0);
    setFilteredTimezones([]);
    setInput(e.target.innerText);
    setShowShowAutocomplete(false);
  };

  const onInputKey = (e) => {
    // Enter
    if (e.keyCode === 13) {
      setSelectedZoneIdx(0);
      setShowShowAutocomplete(false);
      setInput(filteredTimezones[selectedZoneIdx]);
      return;
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
        <input type="text" onChange={onInputChange} onKeyDown={onInputKey} value={input} />
        {showAutocomplete && input && (
          <AutocompleteDropdown {...{ filteredTimezones, selectedZoneIdx, onTimezoneClick }} />
        )}
      </div>
    </section>
  );
}
