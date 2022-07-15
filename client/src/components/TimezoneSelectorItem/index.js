import React, { useRef } from 'react';
import './index.css';

export default React.memo(function TimezoneSelectorItem({ timezone, onTimezoneClick, isActive }) {
  const listItemRef = useRef();

  if (isActive) {
    if (listItemRef.current instanceof HTMLElement) {
      listItemRef.current.scrollIntoView({ block: 'center' });
    }
  }

  const timezoneParts = timezone.replaceAll('_', ' ').split('/');
  const city = timezoneParts[timezoneParts.length - 1];
  const region = `${timezoneParts[0]}${timezoneParts.length === 3 ? `/${timezoneParts[1]}` : ''}`;

  return (
    <li data-iana={timezone} onClick={onTimezoneClick} ref={listItemRef} className={isActive ? 'active' : ''}>
      <span className="city">{city}</span>&nbsp;
      <span className="region">{region}</span>
    </li>
  );
});
