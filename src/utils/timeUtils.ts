import { formatDistance, format } from 'date-fns';
import { vi } from 'date-fns/locale';

export const formatTimeDistance = (dateString: string): string => {
  return formatDistance(new Date(dateString), new Date(), { 
    addSuffix: true,
    locale: vi 
  });
};

export const formatDateTime = (dateString: string): string => {
  return format(new Date(dateString), 'HH:mm:ss dd/MM/yyyy', { locale: vi });
};