import { detectLocalTimezone } from './dateTimeZone';

export function createClockItem(iana) {
  return {
    isLocal: !iana,
    ianaId: iana || detectLocalTimezone(),
  };
}
