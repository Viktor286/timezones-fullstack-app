import React from 'react';
import TimezoneSelectorItem from '../TimezoneSelectorItem';
import './index.css';

export default function TimezoneSelectorList({
  filteredTimezones,
  selectedZoneIdx,
  onTimezoneClick,
  onUpdateLocalClockClick,
}) {
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
            isItemActive={index === selectedZoneIdx}
            onTimezoneClick={onTimezoneClick}
            onUpdateLocalClockClick={onUpdateLocalClockClick}
          />
        );
      })}
    </ul>
  );
}
