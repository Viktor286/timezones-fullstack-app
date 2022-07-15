import React from 'react';
import TimezoneSelectorItem from '../TimezoneSelectorItem';
import './index.css';

export default function AutocompleteDropdown({ filteredTimezones, selectedZoneIdx, onTimezoneClick }) {
  if (!filteredTimezones.length) {
    return <p className="timezone-not-found">Timezone not found</p>;
  }

  return (
    <ul className="timezones-list">
      {filteredTimezones.map((timezone, index) => {
        return (
          <TimezoneSelectorItem
            key={timezone}
            timezone={timezone}
            onTimezoneClick={onTimezoneClick}
            isActive={index === selectedZoneIdx}
          />
        );
      })}
    </ul>
  );
}