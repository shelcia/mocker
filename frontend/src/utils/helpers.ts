import dayjs from 'dayjs';

export function toISO(date: Date | undefined, time: string) {
  if (!date) return undefined;
  const [h = '00', m = '00', s = '00'] = time.split(':');
  return dayjs(date)
    .hour(Number(h))
    .minute(Number(m))
    .second(Number(s))
    .millisecond(0)
    .toISOString();
}

export function fromISO(value?: string) {
  if (!value) return { date: undefined, time: '00:00:00' };
  const d = dayjs(value);
  return {
    date: d.toDate(),
    time: d.format('HH:mm:ss'),
  };
}
