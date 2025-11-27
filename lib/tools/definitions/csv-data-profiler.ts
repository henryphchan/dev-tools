import { ToolInfo } from '../types';

const tool: ToolInfo = {
  id: 'csv-profiler',
  slug: 'csv-data-profiler',
  title: 'CSV Data Profiler',
  seoTitle: 'Profile CSV columns for patterns, uniques, and nulls | Dev Tools',
  description: 'Inspect CSV headers, nulls, unique values, and patterns with exportable results.',
  longDescription:
    'Validate CSV structure quickly by pasting or uploading a file. Review unique counts, nulls, dominant data patterns, and sample values per column, then export the profiling summary as CSV.',
  badge: 'Text & Analysis',
  accent: 'Data Quality',
  keywords: ['csv profiling', 'data quality', 'unique count', 'null count', 'pattern analysis', 'data profiler'],
};

export default tool;
