import dayjs from 'dayjs';

export const toISO = (date: Date | undefined, time: string) => {
  if (!date) return undefined;

  const [h = '00', m = '00', s = '00'] = time.split(':');

  return dayjs(date)
    .hour(Number(h))
    .minute(Number(m))
    .second(Number(s))
    .millisecond(0)
    .toISOString();
};

export const fromISO = (value?: string) => {
  if (!value) return { date: undefined, time: '00:00:00' };

  const d = dayjs(value);

  return {
    date: d.toDate(),
    time: d.format('HH:mm:ss'),
  };
};

export const copyTextToClipboard = async (text) => {
  if ('clipboard' in navigator) {
    return await navigator.clipboard.writeText(text);
  } else {
    return document.execCommand('copy', true, text);
  }
};

export const queryKeys = {
  projects: (userId: string) => ['projects', userId] as const,
};

export const logout = (setHasToken, navigate) => {
  localStorage.clear();
  setHasToken(false);
  navigate('/');
};
