
import { useState, useEffect } from 'react';
import { CalendarEvent } from '@/types/event';

export const useEvents = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    // Load events from localStorage
    const savedEvents = localStorage.getItem('calendar-events');
    if (savedEvents) {
      const parsedEvents = JSON.parse(savedEvents).map((event: any) => ({
        ...event,
        startDate: new Date(event.startDate),
        endDate: new Date(event.endDate),
      }));
      setEvents(parsedEvents);
    }
  }, []);

  const saveEvents = (newEvents: CalendarEvent[]) => {
    setEvents(newEvents);
    localStorage.setItem('calendar-events', JSON.stringify(newEvents));
  };

  const addEvent = (event: CalendarEvent) => {
    const newEvents = [...events, event];
    saveEvents(newEvents);
  };

  const updateEvent = (id: string, updatedEvent: CalendarEvent) => {
    const newEvents = events.map(event => 
      event.id === id ? updatedEvent : event
    );
    saveEvents(newEvents);
  };

  const deleteEvent = (id: string) => {
    const newEvents = events.filter(event => event.id !== id);
    saveEvents(newEvents);
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.startDate);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  return {
    events,
    addEvent,
    updateEvent,
    deleteEvent,
    getEventsForDate,
  };
};
