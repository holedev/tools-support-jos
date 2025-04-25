import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { CalendarEvent } from "../types";

interface PreviewTableProps {
  events: CalendarEvent[];
}

export default function PreviewTable({ events }: PreviewTableProps) {
  return (
    <div className='rounded-md border'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Subject</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((event) => (
            <TableRow key={`${event.Subject}-${event["Start Date"]}-${event["Start Time"]}`}>
              <TableCell className='font-medium'>{event.Subject}</TableCell>
              <TableCell>{event["Start Date"]}</TableCell>
              <TableCell>
                {event["All Day Event"] === "True" ? "All Day" : `${event["Start Time"]} - ${event["End Time"]}`}
              </TableCell>
              <TableCell>{event.Description}</TableCell>
            </TableRow>
          ))}
          {events.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className='text-center text-muted-foreground'>
                No events to preview. Please fill in the form and click "Preview" to see your timetable.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
