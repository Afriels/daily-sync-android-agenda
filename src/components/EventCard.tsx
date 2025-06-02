
import { CalendarEvent } from '@/types/event';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, MapPin, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface EventCardProps {
  event: CalendarEvent;
  onEdit: (event: CalendarEvent) => void;
  onDelete: (id: string) => void;
}

export const EventCard = ({ event, onEdit, onDelete }: EventCardProps) => {
  const formatTime = (date: Date) => format(date, 'HH:mm');

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{event.title}</CardTitle>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(event)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(event.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>
              {formatTime(event.startDate)} - {formatTime(event.endDate)}
            </span>
          </div>
          
          {event.location && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{event.location}</span>
            </div>
          )}
          
          {event.description && (
            <p className="text-sm text-muted-foreground mt-2">
              {event.description}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
