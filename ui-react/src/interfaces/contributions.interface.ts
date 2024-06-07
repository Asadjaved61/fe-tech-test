export enum Status {
  Scheduled = "Scheduled",
  Active = "Active",
  Complete = "Complete",
}

export interface ContributionI {
  id: number;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  owner: string;
  status: Status;
}
