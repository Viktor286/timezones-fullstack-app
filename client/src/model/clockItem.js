import { detectLocalTimezone } from './dateTimeZone';

export function createClockItem(iana, isLocal = false) {
  const clockItem = {
    ianaId: iana || detectLocalTimezone(),
  };

  if (!iana || isLocal) {
    clockItem.isLocal = true;
  }

  return clockItem;
}
