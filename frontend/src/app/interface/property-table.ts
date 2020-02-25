export interface TableColumnDefinition {
    name?: string;
    key: string;
    expand?: boolean;
    hide?: boolean;
    type?: string;
}


export const ACTION_COLUMN = 'actions';