export interface Workflow {
    id: number;
    title: string;
    status: 'PENDING' | 'IN PROGRESS' | 'COMPLETED';
    date: string;
}
