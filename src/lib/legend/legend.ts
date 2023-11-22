import { ChartTypeRegistry, LegendElement, LegendItem } from 'chart.js';
import { LegendItemOptions } from '../../types';

const legendClickHandler = function (
  legendItem: LegendItem,
  legend: LegendElement<keyof ChartTypeRegistry>,
  selectedLegends: LegendItemOptions[],
  callback: (legends: LegendItemOptions[]) => void,
): void {
  let legendObj: LegendItemOptions = {};
  legendObj = {
    label: legendItem.text,
    value: legendItem.text,
  };
  const legends = selectedLegends ?? [];
  const legendIndex = legends?.findIndex((data: LegendItemOptions) => data.label === legendItem.text);
  if (legendIndex !== -1) {
    legends.splice(legendIndex, 1);
  } else {
    legends.push(legendObj);
  }
  callback(legends);
};

export default legendClickHandler;
