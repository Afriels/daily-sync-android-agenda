
import { useState } from 'react';
import { CalendarEvent } from '@/types/event';
import { useEvents } from '@/hooks/useEvents';
import { useNotifications } from '@/hooks/useNotifications';
import { EventCard } from '@/components/EventCard';
import { EventForm } from '@/components/EventForm';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Calendar as CalendarIcon, List } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | undefined>();
  const { events, addEvent, updateEvent, deleteEvent, getEventsForDate } = useEvents();
  const { scheduleEventReminder, cancelEventReminder } = useNotifications();
  const { toast } = useToast();

  const todayEvents = getEventsForDate(selectedDate);

  const handleSaveEvent = async (event: CalendarEvent) => {
    try {
      if (editingEvent) {
        await cancelEventReminder(editingEvent.id);
        updateEvent(editingEvent.id, event);
        toast({
          title: "Event berhasil diupdate",
          description: `${event.title} telah diperbarui`,
        });
      } else {
        addEvent(event);
        toast({
          title: "Event berhasil ditambahkan",
          description: `${event.title} telah ditambahkan ke jadwal`,
        });
      }
      
      // Schedule notification
      await scheduleEventReminder(event);
      
      setShowForm(false);
      setEditingEvent(undefined);
    } catch (error) {
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat menyimpan event",
        variant: "destructive",
      });
    }
  };

  const handleEditEvent = (event: CalendarEvent) => {
    setEditingEvent(event);
    setShowForm(true);
  };

  const handleDeleteEvent = async (id: string) => {
    try {
      await cancelEventReminder(id);
      deleteEvent(id);
      toast({
        title: "Event berhasil dihapus",
        description: "Event telah dihapus dari jadwal",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat menghapus event",
        variant: "destructive",
      });
    }
  };

  const eventDates = events.map(event => event.startDate);

  if (showForm) {
    return (
      <div className="min-h-screen bg-background p-4">
        <EventForm
          event={editingEvent}
          onSave={handleSaveEvent}
          onCancel={() => {
            setShowForm(false);
            setEditingEvent(undefined);
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Jadwal Harian</h1>
          <Button onClick={() => setShowForm(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Tambah Event
          </Button>
        </div>

        <Tabs defaultValue="calendar" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="calendar" className="gap-2">
              <CalendarIcon className="h-4 w-4" />
              Kalender
            </TabsTrigger>
            <TabsTrigger value="list" className="gap-2">
              <List className="h-4 w-4" />
              Daftar
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calendar" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Kalender</CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    modifiers={{
                      event: eventDates,
                    }}
                    modifiersStyles={{
                      event: { 
                        backgroundColor: 'hsl(var(--primary))',
                        color: 'hsl(var(--primary-foreground))',
                        borderRadius: '50%',
                      },
                    }}
                    className="pointer-events-auto"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>
                    Event untuk {format(selectedDate, 'dd MMMM yyyy')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {todayEvents.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      Tidak ada event untuk tanggal ini
                    </p>
                  ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {todayEvents.map((event) => (
                        <EventCard
                          key={event.id}
                          event={event}
                          onEdit={handleEditEvent}
                          onDelete={handleDeleteEvent}
                        />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="list">
            <Card>
              <CardHeader>
                <CardTitle>Semua Event</CardTitle>
              </CardHeader>
              <CardContent>
                {events.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    Belum ada event yang dibuat
                  </p>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {events
                      .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
                      .map((event) => (
                        <EventCard
                          key={event.id}
                          event={event}
                          onEdit={handleEditEvent}
                          onDelete={handleDeleteEvent}
                        />
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
