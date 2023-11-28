import { Chart, ChartEvent, ChartTypeRegistry, LegendElement, LegendItem } from 'chart.js/auto';
import { DonutLabel } from './donut.type';

const getCenterValue = (chart: Chart | any, total?: number, label?: string | number) => {
  const ctx = chart.ctx;
  const centerY = chart.height / 2;

  const innerRadius = chart.getDatasetMeta(0).data[0].innerRadius;
  const outerRadius = chart.getDatasetMeta(0).data[0].outerRadius;

  const scaleNum = innerRadius / 120;
  const valueFontSize = scaleNum < 1 ? 36 * scaleNum : 36;
  const totalFontSize = scaleNum < 1 ? 14 * scaleNum : 14;

  ctx.restore();
  if (label) {
    const totalText = label ? label : '';
    ctx.font = `${totalFontSize}px Arial`;
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'black';
    ctx.fillText(totalText, outerRadius - ctx.measureText(totalText).width / 2, centerY + valueFontSize);
  }

  ctx.font = `${valueFontSize}px Arial`;
  ctx.fillText(total, outerRadius - ctx.measureText(total).width / 2, label ? centerY : centerY + valueFontSize / 2);

  ctx.save();
};

const centerLabel = (donut?: DonutLabel) => {
  return {
    id: 'centerLabel',
    afterDatasetDraw: (chart: Chart | any) => {
      if (!donut?.enable) {
        return;
      }
      const total = chart.getDatasetMeta(0).total;
      getCenterValue(chart, total, donut.label);
    },
  };
};

const legendClickHandler = (e: ChartEvent, item: LegendItem, legend: LegendElement<keyof ChartTypeRegistry>): void => {
  const chart = legend.chart;
  const index = item.index;
  chart.toggleDataVisibility(index as number);
  const meta = chart.getDatasetMeta(0);
  if ('total' in meta) {
    const total = meta.total;
    getCenterValue(chart, total);
  }

  chart.update();
};

export { centerLabel, legendClickHandler };
