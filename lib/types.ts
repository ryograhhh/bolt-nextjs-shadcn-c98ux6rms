export interface ShareProcess {
  status: string;
  progress: number;
  current_count: number;
  share_count: number;
  post_link: string;
}

export interface ProcessGroup {
  processes: Array<{ id: string } & ShareProcess>;
  totalShares: number;
  completedShares: number;
}