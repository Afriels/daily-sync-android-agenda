
import { useEffect } from 'react';
import { LocalNotifications } from '@capacitor/local-notifications';
import { CalendarEvent } from '@/types/event';

export const useNotifications = () => {
  useEffect(() => {
    // Request permissions on mount
    LocalNotifications.requestPermissions();
  }, []);

  const scheduleEventReminder = async (event: CalendarEvent) => {
    if (!event.reminderMinutes) return;

    const reminderTime = new Date(event.startDate);
    reminderTime.setMinutes(reminderTime.getMinutes() - event.reminderMinutes);

    // Only schedule if reminder time is in the future
    if (reminderTime > new Date()) {
      await LocalNotifications.schedule({
        notifications: [
          {
            title: 'Pengingat Jadwal',
            body: `${event.title} akan dimulai dalam ${event.reminderMinutes} menit`,
            id: parseInt(event.id),
            schedule: { at: reminderTime },
            sound: 'default',
            attachments: undefined,
            actionTypeId: '',
            extra: null
          }
        ]
      });
    }
  };

  const cancelEventReminder = async (eventId: string) => {
    await LocalNotifications.cancel({
      notifications: [{ id: parseInt(eventId) }]
    });
  };

  return {
    scheduleEventReminder,
    cancelEventReminder,
  };
};
