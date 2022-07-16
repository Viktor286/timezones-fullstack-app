import { detectLocalTimezone } from './dateTimeZone';

export function createClockItem(iana) {
  const clockItem = {
    ianaId: iana || detectLocalTimezone(),
  };

  if (!iana) {
    clockItem.isLocal = true;
  }

  return clockItem;
}
