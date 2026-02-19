export type Role = 'Employee' | 'Manager' | 'Admin';

export type WorkflowStatus = 'NEW' | 'REQUESTED' | 'APPROVED' | 'REJECTED';

export interface Workflow {
    id: number;
    title: string;
    status: WorkflowStatus;
    date: string;
    createdBy: 'Admin';
    managerComments?: string;
    requestedBy?: 'Employee';
}
