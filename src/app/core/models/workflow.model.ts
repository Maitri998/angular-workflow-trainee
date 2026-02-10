// export interface Workflow {
//   id: number;
//   title: string;
//   status: 'Pending' | 'In Progress' | 'Completed';
//   createdAt: string;
//   description: string;
// }


export type WorkflowStatus = 'Pending' | 'In Progress' | 'Completed';

export interface Workflow {
  id: number;
  title: string;
  status: WorkflowStatus;
  createdAt: string;
  description: string;
}