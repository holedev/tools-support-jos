"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { PlusCircle, X } from "lucide-react";
import { useState } from "react";
import type { CalendarEvent, SubjectFormData } from "../types";
import PreviewTable from "./preview-table";

const INITIAL_SUBJECT: SubjectFormData = {
  id: "1",
  schedulePeriod: {
    startDate: "",
    endDate: "",
    weekQuantity: undefined
  },
  classSchedule: {
    selectedDays: [],
    startTime: "",
    endTime: ""
  },
  details: {
    title: "",
    description: "",
    allDayEvent: false,
    isPrivate: false
  }
};

const daysOfWeek = [
  { value: 0, label: "Sunday" },
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" }
];

export default function ExportForm() {
  const [subjects, setSubjects] = useState<SubjectFormData[]>([INITIAL_SUBJECT]);
  const [previewEvents, setPreviewEvents] = useState<CalendarEvent[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  // Keep all the helper functions unchanged
  const addSubject = () => {
    setSubjects((prev) => [
      ...prev,
      {
        ...INITIAL_SUBJECT,
        id: String(prev.length + 1)
      }
    ]);
  };

  const removeSubject = (id: string) => {
    setSubjects((prev) => prev.filter((subject) => subject.id !== id));
  };

  const updateSubject = (id: string, updates: Partial<SubjectFormData>) => {
    setSubjects((prev) => prev.map((subject) => (subject.id === id ? { ...subject, ...updates } : subject)));
  };

  const handleScheduleChange = (
    id: string,
    field: keyof SubjectFormData["schedulePeriod"],
    value: string | number | undefined
  ) => {
    const subject = subjects.find((s) => s.id === id);
    if (!subject) return;

    const updates: SubjectFormData["schedulePeriod"] = {
      startDate: subject.schedulePeriod.startDate,
      endDate: subject.schedulePeriod.endDate,
      weekQuantity: subject.schedulePeriod.weekQuantity,
      [field]: value
    };

    updateSubject(id, { schedulePeriod: updates });
  };

  const calculateDates = (id: string) => {
    const subject = subjects.find((s) => s.id === id);
    if (!subject) return;

    const updates = { ...subject.schedulePeriod };

    if (updates.startDate && updates.endDate && !updates.weekQuantity) {
      // Calculate weeks from start and end dates
      const start = new Date(updates.startDate);
      const end = new Date(updates.endDate);
      const diffTime = end.getTime() - start.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Add 1 to include both start and end days
      updates.weekQuantity = Math.ceil(diffDays / 7);
    } else if (updates.startDate && updates.weekQuantity && !updates.endDate) {
      // Calculate end date from start date and weeks
      const start = new Date(updates.startDate);
      const end = new Date(start);
      end.setDate(end.getDate() + (updates.weekQuantity - 1) * 7); // Subtract 1 from weeks to compensate for inclusive counting
      updates.endDate = end.toISOString().split("T")[0];
    }

    updateSubject(id, { schedulePeriod: updates });
  };

  const handleDayToggle = (subjectId: string, day: number) => {
    const subject = subjects.find((s) => s.id === subjectId);
    if (!subject) return;

    const selectedDays = subject.classSchedule.selectedDays.includes(day)
      ? subject.classSchedule.selectedDays.filter((d) => d !== day)
      : [...subject.classSchedule.selectedDays, day];

    updateSubject(subjectId, {
      classSchedule: { ...subject.classSchedule, selectedDays }
    });
  };

  const generateEvents = (subject: SubjectFormData): CalendarEvent[] | null => {
    const { schedulePeriod, classSchedule, details } = subject;

    // Validate required fields
    if (!schedulePeriod.startDate || !details.title || !classSchedule.selectedDays.length) {
      return null;
    }

    const startDate = new Date(schedulePeriod.startDate);
    let endDate = schedulePeriod.endDate ? new Date(schedulePeriod.endDate) : null;

    if (schedulePeriod.weekQuantity && !endDate) {
      endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + schedulePeriod.weekQuantity * 7);
    }

    if (!endDate) return null;

    // Generate events for selected days within date range
    const events: CalendarEvent[] = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      if (classSchedule.selectedDays.includes(currentDate.getDay())) {
        events.push({
          Subject: details.title,
          "Start Date": `${String(currentDate.getMonth() + 1).padStart(2, "0")}/${String(currentDate.getDate()).padStart(2, "0")}/${currentDate.getFullYear()}`,
          "Start Time": details.allDayEvent ? "" : classSchedule.startTime,
          "End Date": `${String(currentDate.getMonth() + 1).padStart(2, "0")}/${String(currentDate.getDate()).padStart(2, "0")}/${currentDate.getFullYear()}`,
          "End Time": details.allDayEvent ? "" : classSchedule.endTime,
          "All Day Event": details.allDayEvent ? "True" : "False",
          Description: details.description || "",
          Private: details.isPrivate ? "True" : "False"
        });
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return events;
  };

  const handlePreview = () => {
    const allEvents: CalendarEvent[] = [];
    let hasError = false;

    subjects.forEach((subject, index) => {
      const events = generateEvents(subject);
      if (!events) {
        alert(`Please fill in all required fields for subject ${index + 1}`);
        hasError = true;
        return;
      }
      allEvents.push(...events);
    });

    if (!hasError) {
      setPreviewEvents(allEvents);
      setShowPreview(true);
    }
  };

  const generateCSV = () => {
    const allEvents: CalendarEvent[] = [];
    let hasError = false;

    subjects.forEach((subject, index) => {
      const events = generateEvents(subject);
      if (!events) {
        alert(`Please fill in all required fields for subject ${index + 1}`);
        hasError = true;
        return;
      }
      allEvents.push(...events);
    });

    if (hasError) return;

    const headers = [
      "Subject",
      "Start Date",
      "Start Time",
      "End Date",
      "End Time",
      "All Day Event",
      "Description",
      "Private"
    ];

    // Add UTF-8 BOM for proper encoding of Vietnamese characters
    const BOM = "\ufeff";

    const csv =
      BOM +
      [
        headers.join(","),
        ...allEvents.map((event) =>
          headers
            .map((header) => {
              const value = event[header as keyof typeof event];
              return value.includes(",") || value.includes('"') ? `"${value.replace(/"/g, '""')}"` : value;
            })
            .join(",")
        )
      ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "timetable.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className='space-y-8'>
      {subjects.map((subject, index) => (
        <Card key={subject.id} className='p-6'>
          <div className='space-y-6'>
            <div className='flex items-center justify-between mb-4'>
              <h2 className='text-xl font-semibold'>Subject {index + 1}</h2>
              {subjects.length > 1 && (
                <Button variant='ghost' size='icon' onClick={() => removeSubject(subject.id)}>
                  <X className='h-4 w-4' />
                </Button>
              )}
            </div>

            <div>
              <Label htmlFor={`title-${subject.id}`}>Course/Subject Name*</Label>
              <Input
                placeholder='COM605 - Mạng và truyền dữ liệu nâng cao'
                id={`title-${subject.id}`}
                type='text'
                value={subject.details.title}
                onChange={(e) =>
                  updateSubject(subject.id, {
                    details: { ...subject.details, title: e.target.value }
                  })
                }
              />
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor={`startDate-${subject.id}`}>Start Date*</Label>
                <Input
                  id={`startDate-${subject.id}`}
                  type='date'
                  value={subject.schedulePeriod.startDate}
                  onChange={(e) => handleScheduleChange(subject.id, "startDate", e.target.value)}
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor={`endDate-${subject.id}`}>End Date</Label>
                <Input
                  id={`endDate-${subject.id}`}
                  type='date'
                  value={subject.schedulePeriod.endDate}
                  onChange={(e) => handleScheduleChange(subject.id, "endDate", e.target.value)}
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor={`weekQuantity-${subject.id}`}>Number of Weeks</Label>
                <div className='flex gap-2'>
                  <Input
                    id={`weekQuantity-${subject.id}`}
                    type='number'
                    min='1'
                    value={subject.schedulePeriod.weekQuantity || ""}
                    onChange={(e) =>
                      handleScheduleChange(
                        subject.id,
                        "weekQuantity",
                        e.target.value ? Number.parseInt(e.target.value) : undefined
                      )
                    }
                  />
                  <Button variant='secondary' onClick={() => calculateDates(subject.id)}>
                    Calculate
                  </Button>
                </div>
              </div>
            </div>

            <div>
              <Label>Class Days*</Label>
              <div className='flex flex-wrap gap-2 mt-2'>
                {daysOfWeek.map((day) => (
                  <Button
                    key={day.value}
                    variant={subject.classSchedule.selectedDays.includes(day.value) ? "default" : "outline"}
                    onClick={() => handleDayToggle(subject.id, day.value)}
                  >
                    {day.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <Label htmlFor={`startTime-${subject.id}`}>Start Time</Label>
                <Input
                  id={`startTime-${subject.id}`}
                  type='time'
                  value={subject.classSchedule.startTime}
                  onChange={(e) =>
                    updateSubject(subject.id, {
                      classSchedule: {
                        ...subject.classSchedule,
                        startTime: e.target.value
                      }
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor={`endTime-${subject.id}`}>End Time</Label>
                <Input
                  id={`endTime-${subject.id}`}
                  type='time'
                  value={subject.classSchedule.endTime}
                  onChange={(e) =>
                    updateSubject(subject.id, {
                      classSchedule: {
                        ...subject.classSchedule,
                        endTime: e.target.value
                      }
                    })
                  }
                />
              </div>
            </div>

            <div>
              <Label htmlFor={`description-${subject.id}`}>Description (e.g., Room, Professor)</Label>
              <Input
                id={`description-${subject.id}`}
                placeholder='P209 - GV. Trần Thanh Nam'
                type='text'
                value={subject.details.description}
                onChange={(e) =>
                  updateSubject(subject.id, {
                    details: {
                      ...subject.details,
                      description: e.target.value
                    }
                  })
                }
              />
            </div>

            <div className='flex gap-4'>
              <div className='flex items-center space-x-2'>
                <Switch
                  id={`allDay-${subject.id}`}
                  checked={subject.details.allDayEvent}
                  onCheckedChange={(checked) =>
                    updateSubject(subject.id, {
                      details: {
                        ...subject.details,
                        allDayEvent: checked
                      }
                    })
                  }
                />
                <Label htmlFor={`allDay-${subject.id}`}>All Day Event</Label>
              </div>
              <div className='flex items-center space-x-2'>
                <Switch
                  id={`private-${subject.id}`}
                  checked={subject.details.isPrivate}
                  onCheckedChange={(checked) =>
                    updateSubject(subject.id, {
                      details: {
                        ...subject.details,
                        isPrivate: checked
                      }
                    })
                  }
                />
                <Label htmlFor={`private-${subject.id}`}>Private Event</Label>
              </div>
            </div>
          </div>
        </Card>
      ))}

      <Button onClick={addSubject} variant='outline' className='w-full'>
        <PlusCircle className='w-4 h-4 mr-2' />
        Add Another Subject
      </Button>

      <div className='flex gap-4'>
        <Button onClick={handlePreview} className='flex-1'>
          Preview Timetable
        </Button>
        <Button onClick={generateCSV} className='flex-1' variant='outline'>
          Generate CSV
        </Button>
      </div>

      {showPreview && (
        <div className='mt-8'>
          <h2 className='text-lg font-semibold mb-4'>Preview</h2>
          <PreviewTable events={previewEvents} />
        </div>
      )}
    </div>
  );
}
