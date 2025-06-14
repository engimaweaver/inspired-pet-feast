
export interface ExportData {
  filename: string;
  data: any[];
  headers: string[];
}

export const downloadCSV = (data: ExportData) => {
  const csvContent = [
    data.headers.join(','),
    ...data.data.map(row => 
      data.headers.map(header => {
        const value = row[header] || '';
        // Escape quotes and wrap in quotes if contains comma
        return typeof value === 'string' && value.includes(',') 
          ? `"${value.replace(/"/g, '""')}"` 
          : value;
      }).join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${data.filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const downloadExcel = (data: ExportData) => {
  // Simple Excel-compatible format using TSV
  const tsvContent = [
    data.headers.join('\t'),
    ...data.data.map(row => 
      data.headers.map(header => row[header] || '').join('\t')
    )
  ].join('\n');

  const blob = new Blob([tsvContent], { type: 'application/vnd.ms-excel' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${data.filename}.xlsx`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportRevenueData = (revenueData: any[]) => {
  const data: ExportData = {
    filename: 'revenue-data',
    data: revenueData,
    headers: ['month', 'revenue', 'profit', 'expenses']
  };
  return data;
};

export const exportExpenseData = (expenseData: any[]) => {
  const data: ExportData = {
    filename: 'expense-breakdown',
    data: expenseData,
    headers: ['category', 'amount', 'percentage']
  };
  return data;
};

export const exportProfitMarginData = (profitData: any[]) => {
  const data: ExportData = {
    filename: 'profit-margins',
    data: profitData,
    headers: ['item', 'cost', 'price', 'margin']
  };
  return data;
};
