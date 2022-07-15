import React, { useEffect, useRef } from 'react';

export function enhanceIanaStrToReactElement(str) {
  const components = str.replaceAll('_', ' ').split('/');
  return (
    <>
      <span className="city">{components[components.length - 1]}</span>&nbsp;
      <span className="region">
        ({components[0]}
        {components.length === 3 ? `/${components[1]}` : null})
      </span>
    </>
  );
}

export default function AutocompleteDropdown({ filteredTimezones, selectedZoneIdx, onTimezoneClick }) {
  const active = useRef();

  useEffect(() => {
    if (active.current instanceof HTMLElement) {
      active.current.scrollIntoView({ block: 'center' });
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
            <li key={timezone} data-iana={timezone} onClick={onTimezoneClick} ref={active} className="active">
              {enhanceIanaStrToReactElement(timezone)}
            </li>
          );
        } else {
          return (
            <li key={timezone} data-iana={timezone} onClick={onTimezoneClick}>
              {enhanceIanaStrToReactElement(timezone)}
            </li>
          );
        }
      })}
    </ul>
  );
}
