import { appConfig } from '../config/app.config';

const dateFormatter = new Intl.DateTimeFormat(appConfig.locale, {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
});

export const formatDate = (iso: string) => dateFormatter.format(new Date(iso));

export const formatDuration = (totalSeconds: number) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds].map((part) => String(part).padStart(2, '0')).join(':');
};

export const getInitials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');

export const cx = (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(' ');
