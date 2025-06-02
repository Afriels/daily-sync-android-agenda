
export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  location?: string;
  reminderMinutes?: number;
}

export interface EventFormData {
  title: string;
  description: string;
  date: Date;
  startTime: string;
  endTime: string;
  location: string;
  reminderMinutes: number;
}
