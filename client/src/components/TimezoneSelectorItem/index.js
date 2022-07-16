import React, { useRef } from 'react';
import './index.css';

export default React.memo(function TimezoneSelectorItem({
  timezone,
  isItemActive,
  onTimezoneClick,
  onUpdateLocalClockClick,
}) {
  const listItemRef = useRef();

  if (isItemActive && listItemRef.current instanceof HTMLElement) {
    listItemRef.current.scrollIntoView({ block: 'center' });
  }

  const timezoneParts = timezone.replaceAll('_', ' ').split('/');
  const city = timezoneParts[timezoneParts.length - 1];
  const region = `${timezoneParts[0]}${timezoneParts.length === 3 ? `/${timezoneParts[1]}` : ''}`;

  return (
    <li
      data-iana={timezone}
      onClick={onTimezoneClick}
      ref={listItemRef}
      className={isItemActive ? 'active' : ''}
    >
      <button className="update-local-clock" onClick={(e) => onUpdateLocalClockClick(e, timezone)}>
        🏠 make this your local clock
      </button>
      <span className="city">{city}</span>&nbsp;
      <span className="region">{region}</span>
    </li>
  );
});
