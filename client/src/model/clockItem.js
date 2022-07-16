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

export function prepareTimeDifferenceStr(localUtcOffset, remoteUtcOffset) {
  const totalOffset = localUtcOffset - remoteUtcOffset;
  const diffHours = totalOffset / 60;
  const diffMinutes = Math.abs(totalOffset % 60);
  const sign = diffHours <= 0 ? '+' : '-';
  return `${sign}${Math.floor(Math.abs(diffHours))}${diffMinutes !== 0 ? `:${diffMinutes}` : ''}`;
}
