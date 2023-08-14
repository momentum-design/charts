/* eslint-disable */
import { ChartEvent, LegendItem } from 'chart.js/auto';
import { LegendClickData } from './plugin.types';

const getOrCreateTooltip = (chart: any) => {
  let tooltipEl = chart.canvas.parentNode.querySelector('.legend-tooltip');

  if (!tooltipEl) {
    tooltipEl = document.createElement('div');
    tooltipEl.setAttribute('class', 'legend-tooltip');
    tooltipEl.style.background = 'rgba(0, 0, 0, 0.5)';
    tooltipEl.style.borderRadius = '5px';
    tooltipEl.style.opacity = 1;
    tooltipEl.style.minWidth = '100px';
    tooltipEl.style.padding = '10px';
    tooltipEl.style.pointerEvents = 'none';
    tooltipEl.style.position = 'absolute';
    tooltipEl.style.transition = 'all .1s ease';
    tooltipEl.style.transform = 'translate(-100%, -50%)';

    const tooltipBox = document.createElement('div');
    tooltipBox.setAttribute('class', 'legend-tooltip-container');
    tooltipBox.style.margin = '0px';
    tooltipEl.appendChild(tooltipBox);
    chart.canvas.parentNode.appendChild(tooltipEl);

    // right triangle
    const triangle = document.createElement('span');
    triangle.style.width = '0px';
    triangle.style.height = '0px';
    triangle.style.borderStyle = 'solid';
    triangle.style.borderColor = 'transparent';
    triangle.style.borderWidth = '8px';
    triangle.style.borderLeftColor = 'rgba(0, 0, 0, 0.5)';
    triangle.style.borderLeftWidth = '8px';
    triangle.style.position = 'absolute';
    triangle.style.top = '50%';
    triangle.style.marginTop = '-10px';
    triangle.style.right = '-16px';
    tooltipEl.appendChild(triangle);
  }
  return tooltipEl;
};

const legendClickHandler = (evt: ChartEvent, item: LegendItem, legend: any): void => {
  // TODO: support Filter Click
  if (legend.chart.config.options?.isLegendClick) {
    if (['pie', 'doughnut'].includes(legend.chart.config.type)) {
      const index = item.index;
      const legendObj: LegendClickData = {
        label: item.text,
        value: legend.chart.config.data.datasets[0].data[index as number],
      };
      legend.chart.config.options.onLegendClick(legendObj);
    }
  } else {
    if (['pie', 'doughnut'].includes(legend.chart.config.type)) {
      const index = item.index;
      const chart = legend.chart;
      chart.toggleDataVisibility(index);
      chart.update();
    }
  }
};

const colorBlock = (colors: { backgroundColor: string; borderColor?: string }) => {
  const boxSpan = document.createElement('span');
  boxSpan.style.background = colors.backgroundColor;
  boxSpan.style.borderColor = colors?.borderColor || 'none';
  boxSpan.style.borderWidth = '2px';
  boxSpan.style.marginRight = '10px';
  boxSpan.style.height = '10px';
  boxSpan.style.width = '10px';
  boxSpan.style.display = 'inline-block';
  return boxSpan;
};

// default tooltip body (no seriesTooltipBody parameter)
const customizeTooltipBody = (legend: any, item: LegendItem, legendTooltip: any) => {
  const tooltipBody = document.createElement('div');
  tooltipBody.style.color = '#fff';
  tooltipBody.style.padding = '5px 0';
  tooltipBody.style.width = '100%';
  let replacedTemplate = '';

  const boxSpan = colorBlock({ backgroundColor: item.fillStyle as string });
  if (legendTooltip.isMultipleLegend) {
    let currentIndex: number = item.index as number;

    legend.chart.config.data.datasets.forEach((element: any, index: number) => {
      const totalData = legend.chart._metasets[index].total;
      const curValue = element.data[currentIndex];
      const curLabel = element.label;
      const percentage = ((curValue / totalData) * 100).toFixed(legendTooltip.floorNumber) + '%';

      const curTemplate = `${legendTooltip.body}`.replace('${colorBlock}', boxSpan.outerHTML).replace('${seriesName}', item.text).replace('${label}', curLabel).replace('${percentage}', percentage).replace('${value}', curValue).replace('${total}', totalData);

      replacedTemplate = replacedTemplate + curTemplate;
    });
  } else {
    const totalData = legend.chart._metasets[0].total;
    const legendData = legend.chart.config.data.datasets[0];
    const currentLegendData = legendData.data[item.index as number];
    const percentage = ((Math.floor(currentLegendData) / totalData) * 100).toFixed(legendTooltip.floorNumber) + '%';

    replacedTemplate = `${legendTooltip.body}`.replace('${colorBlock}', boxSpan.outerHTML).replace('${seriesName}', item.text).replace('${label}', legendData.label).replace('${percentage}', percentage).replace('${value}', currentLegendData).replace('${total}', totalData);
  }

  tooltipBody.innerHTML = replacedTemplate;
  return tooltipBody;
};

const legendHandleHover = (evt: ChartEvent, item: LegendItem, legend: any): void => {
  const { chart } = legend;
  const tooltipEl = getOrCreateTooltip(chart);

  // Hide if no tooltip
  if (tooltipEl.legendItems === 0) {
    tooltipEl.style.opacity = 0;
    return;
  }

  const isMultipleLegend = legend.chart.config.options.isMultipleLegend;
  const floorNumber = legend.chart.config.options.legendTooltipFloor;
  const header = legend.chart.config.options.legendTooltipHead;
  const body = legend.chart.config.options.legendTooltipBody;
  const footer = legend.chart.config.options.legendTooltipFooter;

  const legendTooltip = { isMultipleLegend, floorNumber, body };

  let tooltipHeader = chart.canvas.parentNode.querySelector('.legend-tooltip-header');
  if (!tooltipHeader && header) {
    tooltipHeader = document.createElement('div');
    tooltipHeader.setAttribute('class', 'legend-tooltip-header');
    tooltipHeader.style.color = '#fff';
    tooltipHeader.style.padding = '5px 0 0 0';

    const boxSpan = colorBlock({ backgroundColor: item.fillStyle as string });
    const replacedTemplate = `${header}`.replace('${colorBlock}', boxSpan.outerHTML).replace('${seriesName}', item.text);

    tooltipHeader.innerHTML = replacedTemplate;
  }

  let tooltipBody: any;
  if (body) {
    tooltipBody = customizeTooltipBody(legend, item, legendTooltip);
  } else {
    legendTooltip.body = '<div class=flex-x-between><p style=min-width:60px><span>${colorBlock}${seriesName}:</span><span>${value}</span></p><span>(${percentage})</span></div>';
    tooltipBody = customizeTooltipBody(legend, item, legendTooltip);
  }

  // Remove old children
  const tooltipRoot = tooltipEl.querySelector('.legend-tooltip-container');
  while (tooltipRoot?.firstChild) {
    tooltipRoot.firstChild.remove();
  }

  // Footer
  let tooltipFooter = chart.canvas.parentNode.querySelector('.legend-tooltip-footer');
  if (!tooltipFooter && footer) {
    tooltipFooter = document.createElement('p');
    tooltipFooter.setAttribute('class', 'legend-tooltip-footer');
    tooltipFooter.style.width = '100%';
    tooltipFooter.innerHTML = footer;
    tooltipFooter.style.textAlign = 'center';
    tooltipFooter.style.color = '#fff';
  }

  // Add new children
  tooltipHeader && tooltipRoot.appendChild(tooltipHeader);
  tooltipBody && tooltipRoot.appendChild(tooltipBody);
  tooltipFooter && tooltipRoot.appendChild(tooltipFooter);

  // tooltip position
  const left = legend.left;
  const top = legend.legendHitBoxes[item.index as number].top;
  tooltipEl.style.opacity = 1;
  tooltipEl.style.left = left + 'px';
  tooltipEl.style.top = top + 8 + 'px';
};

const legendHandleLeave = (evt: ChartEvent, item: LegendItem, legend: any): void => {
  const { chart } = legend;
  let tooltipEl = chart.canvas.parentNode.querySelector('.legend-tooltip');
  if (tooltipEl) {
    tooltipEl.parentNode.removeChild(tooltipEl);
  }
  legend.chart.update();
};

export { legendClickHandler, legendHandleHover, legendHandleLeave };
