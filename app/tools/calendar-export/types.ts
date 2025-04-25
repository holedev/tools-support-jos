export interface CalendarEvent {
  Subject: string;
  "Start Date": string;
  "Start Time": string;
  "End Date": string;
  "End Time": string;
  "All Day Event": string;
  Description: string;
  Private: string;
}

export interface SubjectFormData {
  id: string;
  schedulePeriod: {
    startDate: string;
    endDate: string;
    weekQuantity?: number;
  };
  classSchedule: {
    selectedDays: number[];
    startTime: string;
    endTime: string;
  };
  details: {
    title: string;
    description: string;
    allDayEvent: boolean;
    isPrivate: boolean;
  };
}

export interface CalendarExportFormData {
  subjects: SubjectFormData[];
}
