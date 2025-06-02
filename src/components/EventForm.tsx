
import { useState, useEffect } from 'react';
import { CalendarEvent, EventFormData } from '@/types/event';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface EventFormProps {
  event?: CalendarEvent;
  onSave: (event: CalendarEvent) => void;
  onCancel: () => void;
}

export const EventForm = ({ event, onSave, onCancel }: EventFormProps) => {
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    date: new Date(),
    startTime: '09:00',
    endTime: '10:00',
    location: '',
    reminderMinutes: 10,
  });

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        description: event.description || '',
        date: event.startDate,
        startTime: format(event.startDate, 'HH:mm'),
        endTime: format(event.endDate, 'HH:mm'),
        location: event.location || '',
        reminderMinutes: event.reminderMinutes || 10,
      });
    }
  }, [event]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const startDate = new Date(formData.date);
    const [startHour, startMinute] = formData.startTime.split(':');
    startDate.setHours(parseInt(startHour), parseInt(startMinute));

    const endDate = new Date(formData.date);
    const [endHour, endMinute] = formData.endTime.split(':');
    endDate.setHours(parseInt(endHour), parseInt(endMinute));

    const newEvent: CalendarEvent = {
      id: event?.id || Date.now().toString(),
      title: formData.title,
      description: formData.description,
      startDate,
      endDate,
      location: formData.location,
      reminderMinutes: formData.reminderMinutes,
    };

    onSave(newEvent);
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{event ? 'Edit Event' : 'Tambah Event Baru'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Judul Event</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div>
            <Label>Tanggal</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.date ? format(formData.date, 'PPP') : <span>Pilih tanggal</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.date}
                  onSelect={(date) => date && setFormData({ ...formData, date })}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startTime">Waktu Mulai</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="endTime">Waktu Selesai</Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="location">Lokasi</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Opsional"
            />
          </div>

          <div>
            <Label htmlFor="description">Deskripsi</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Opsional"
            />
          </div>

          <div>
            <Label htmlFor="reminder">Pengingat (menit sebelumnya)</Label>
            <Input
              id="reminder"
              type="number"
              value={formData.reminderMinutes}
              onChange={(e) => setFormData({ ...formData, reminderMinutes: parseInt(e.target.value) })}
              min="0"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">
              {event ? 'Update' : 'Simpan'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              Batal
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
