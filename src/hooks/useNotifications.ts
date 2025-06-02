
import { useEffect } from 'react';
import { CalendarEvent } from '@/types/event';

// Dynamic import untuk Capacitor plugins
const getLocalNotifications = async () => {
  try {
    const { LocalNotifications } = await import('@capacitor/local-notifications');
    return LocalNotifications;
  } catch (error) {
    console.log('Local notifications not available in web environment');
    return null;
  }
};

export const useNotifications = () => {
  useEffect(() => {
    // Request permissions on mount
    const requestPermissions = async () => {
      const LocalNotifications = await getLocalNotifications();
      if (LocalNotifications) {
        try {
          await LocalNotifications.requestPermissions();
        } catch (error) {
          console.log('Permission request failed:', error);
        }
      }
    };
    
    requestPermissions();
  }, []);

  const scheduleEventReminder = async (event: CalendarEvent) => {
    if (!event.reminderMinutes) return;

    const LocalNotifications = await getLocalNotifications();
    if (!LocalNotifications) {
      console.log('Local notifications not available, using browser notification fallback');
      // Fallback for web environment
      if ('Notification' in window) {
        const reminderTime = new Date(event.startDate);
        reminderTime.setMinutes(reminderTime.getMinutes() - event.reminderMinutes);
        
        if (reminderTime > new Date()) {
          const timeUntilReminder = reminderTime.getTime() - new Date().getTime();
          setTimeout(() => {
            new Notification('Pengingat Jadwal', {
              body: `${event.title} akan dimulai dalam ${event.reminderMinutes} menit`,
              icon: '/favicon.ico'
            });
          }, timeUntilReminder);
        }
      }
      return;
    }

    const reminderTime = new Date(event.startDate);
    reminderTime.setMinutes(reminderTime.getMinutes() - event.reminderMinutes);

    // Only schedule if reminder time is in the future
    if (reminderTime > new Date()) {
      try {
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
      } catch (error) {
        console.error('Failed to schedule notification:', error);
      }
    }
  };

  const cancelEventReminder = async (eventId: string) => {
    const LocalNotifications = await getLocalNotifications();
    if (!LocalNotifications) return;

    try {
      await LocalNotifications.cancel({
        notifications: [{ id: parseInt(eventId) }]
      });
    } catch (error) {
      console.error('Failed to cancel notification:', error);
    }
  };

  return {
    scheduleEventReminder,
    cancelEventReminder,
  };
};
