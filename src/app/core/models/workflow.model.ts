/**
 * Workflow Status Types:
 * - pending: Workflow created, awaiting employee action
 * - inprogress: Employee has taken action, sent to manager
 * - rejected: Manager rejected the workflow
 * - approved: Manager approved the workflow
 */
export type WorkflowStatus = 'pending' | 'inprogress' | 'rejected' | 'approved';

export interface Workflow {
  id: number;
  title: string;
  status: WorkflowStatus;
  createdAt: string;
  description: string;
  createdBy: string;
  assignedTo?: string;
}