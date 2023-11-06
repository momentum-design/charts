import Chart from 'chart.js/auto';

export type ChartTooltipItemContextParsed = { dataIndex: number; datasetIndex: number; y: number | null };
export type ChartTooltipItemContextRaw = { dataIndex: number; datasetIndex: number };

/**
 * See https://www.chartjs.org/docs/latest/configuration/tooltip.html#tooltip-item-context
 */
export type ChartTooltipItemContext = {
  // The chart the tooltip is being shown on
  chart: Chart;

  // Label for the tooltip
  label: string;

  // Parsed data values for the given `dataIndex` and `datasetIndex`
  parsed: ChartTooltipItemContextParsed;

  // Raw data values for the given `dataIndex` and `datasetIndex`
  raw: ChartTooltipItemContextRaw;

  // Formatted value for the tooltip
  formattedValue: string;

  // The dataset the item comes from
  dataset: any;

  // Index of the dataset the item comes from
  datasetIndex: number;

  // Index of this data item in the dataset
  dataIndex: number;

  // The chart element (point, arc, bar, etc.) for this tooltip item
  element: Element;
};
