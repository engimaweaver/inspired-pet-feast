
export interface TableColumn {
  key: string;
  header: string;
  render?: (value: any, row: any) => React.ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export const createTableColumn = (
  key: string, 
  header: string, 
  options?: Partial<Omit<TableColumn, 'key' | 'header'>>
): TableColumn => ({
  key,
  header,
  ...options
});
