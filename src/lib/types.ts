export type TaskStatus = 'pending' | 'running' | 'completed' | 'error';

export interface Task {
  id: string;
  description: string;
  status: TaskStatus;
  result?: string;
  feedback?: string;
  refinedApproach?: string;
}
