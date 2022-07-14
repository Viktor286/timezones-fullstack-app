import { useEffect, useRef } from 'react';

export default function AutocompleteDropdown({ filteredTimezones, selectedZoneIdx, onTimezoneClick }) {
  const selected = useRef();

  useEffect(() => {
    if (selected.current instanceof HTMLElement) {
      selected.current.scrollIntoView({ block: 'center' });
    }
  }, [selectedZoneIdx]);

  if (!filteredTimezones.length) {
    return <p className="timezone-not-found">Timezone not found</p>;
  }

  return (
    <ul className="timezones-list">
      {filteredTimezones.map((timezone, index) => {
        if (index === selectedZoneIdx) {
          return (
            <li className="active" ref={selected} key={timezone} onClick={onTimezoneClick}>
              {timezone}
            </li>
          );
        } else {
          return (
            <li key={timezone} onClick={onTimezoneClick}>
              {timezone}
            </li>
          );
        }
      })}
    </ul>
  );
}
