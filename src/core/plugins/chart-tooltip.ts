/* eslint-disable */
const getOrCreateTooltip = (chart: any) => {
  let tooltipEl = chart.canvas.parentNode.querySelector('.series-tooltip');

  if (!tooltipEl) {
    tooltipEl = document.createElement('div');
    tooltipEl.setAttribute('class', 'series-tooltip');
    tooltipEl.style.background = '#000';
    tooltipEl.style.borderRadius = '5px';
    tooltipEl.style.opacity = 1;
    tooltipEl.style.pointerEvents = 'none';
    tooltipEl.style.position = 'absolute';
    tooltipEl.style.transform = 'translate(-50%, 0)';
    tooltipEl.style.transition = 'all .1s ease';

    const tooltipBox = document.createElement('div');
    tooltipBox.setAttribute('class', 'series-tooltip-container');
    tooltipBox.style.margin = '0px';
    tooltipEl.appendChild(tooltipBox);
    chart.canvas.parentNode.appendChild(tooltipEl);

    // triangle
    const triangle = document.createElement('span');
    triangle.style.width = '0px';
    triangle.style.height = '0px';
    triangle.style.borderStyle = 'solid';
    triangle.style.borderColor = 'transparent';
    triangle.style.borderWidth = '8px';
    triangle.style.borderBottomColor = '#000';
    triangle.style.borderBottomWidth = '8px';
    triangle.style.position = 'absolute';
    triangle.style.top = '-16px';
    triangle.style.left = '50%';
    triangle.style.marginLeft = '-10px';
    tooltipEl.appendChild(triangle);
  }
  return tooltipEl;
};

// init color block
const colorBlock = (colors: { backgroundColor: string; borderColor: string }) => {
  const boxSpan = document.createElement('span');
  boxSpan.style.background = colors.backgroundColor;
  boxSpan.style.borderColor = colors.borderColor;
  boxSpan.style.borderWidth = '2px';
  boxSpan.style.marginRight = '10px';
  boxSpan.style.height = '10px';
  boxSpan.style.width = '10px';
  boxSpan.style.display = 'inline-block';
  return boxSpan;
};

const customizeTooltipBody = (tooltip: any, seriesTooltip: any) => {
  const tooltipBody = document.createElement('div');
  tooltipBody.style.color = '#fff';
  tooltipBody.style.padding = '5px 0';
  tooltipBody.style.width = '100%';

  let replacedTemplate = '';

  if (seriesTooltip.isMultipleSeries) {
    seriesTooltip.bodyLines.forEach((body: any, i: any) => {
      const colors = tooltip.labelColors[i];
      const boxSpan = document.createElement('span');
      boxSpan.style.background = colors.backgroundColor;
      boxSpan.style.borderColor = colors.borderColor;
      boxSpan.style.borderWidth = '2px';
      boxSpan.style.marginRight = '10px';
      boxSpan.style.height = '10px';
      boxSpan.style.width = '10px';
      boxSpan.style.display = 'inline-block';
    });
  } else {
    // TODO: support single series
    const totalData = tooltip.chart._metasets[0].total;
    const percentage = ((tooltip.dataPoints[0].parsed / totalData) * 100).toFixed(seriesTooltip.floorNumber) + '%';
    const colors = tooltip.labelColors[0];
    const boxSpan = colorBlock(colors);
    const splitBody = seriesTooltip.bodyLines[0][0].split(':');
    const label = splitBody[0]?.trim();
    const value = splitBody[1]?.trim();

    replacedTemplate = `${seriesTooltip.body}`.replace('${colorBlock}', boxSpan.outerHTML).replace('${seriesName}', seriesTooltip.titleLines).replace('${percentage}', percentage).replace('${label}', label).replace('${value}', value).replace('${total}', totalData);
  }

  tooltipBody.innerHTML = replacedTemplate;
  return tooltipBody;
};

const externalTooltipHandler = (context: any) => {
  // Tooltip Element
  const { chart, tooltip } = context;
  const tooltipEl = getOrCreateTooltip(chart);

  // Hide if no tooltip
  if (tooltip.opacity === 0) {
    tooltipEl.style.opacity = 0;
    return;
  }

  // Set Text
  if (tooltip.body) {
    const isMultipleSeries = tooltip.chart.config.options.isMultipleSeries;
    const floorNumber = tooltip.chart.config.options.seriesTooltipFloor;
    const header = tooltip.chart.config.options.seriesTooltipHead;
    const body = tooltip.chart.config.options.seriesTooltipBody;
    const footer = tooltip.chart.config.options.seriesTooltipFooter;
    const titleLines = tooltip.title || [];
    const bodyLines = tooltip.body.map((b: any) => b.lines);

    const seriesTooltip = { isMultipleSeries, floorNumber, body, titleLines, bodyLines };

    // header
    let tooltipHeader = chart.canvas.parentNode.querySelector('.series-tooltip-header');
    if (!tooltipHeader && header) {
      tooltipHeader = document.createElement('div');
      tooltipHeader.setAttribute('class', 'series-tooltip-header');
      tooltipHeader.style.color = '#fff';
      tooltipHeader.style.padding = '5px 0 0 0';
      tooltipHeader.innerHTML = header;
    }

    // body
    let tooltipBody: any;
    if (body) {
      tooltipBody = customizeTooltipBody(tooltip, seriesTooltip);
    } else {
      seriesTooltip.body = '<div>${colorBlock}${seriesName}</div><div class=flex-x-between><p style=min-width:100px>Percentage</p><span>${percentage}</span></p></div><div class=flex-x-between><p style=min-width:100px>Total</p><span>${value}</span></p></div> ';
      tooltipBody = customizeTooltipBody(tooltip, seriesTooltip);
    }

    // Remove old children
    const tooltipRoot = tooltipEl.querySelector('.series-tooltip-container');
    while (tooltipRoot?.firstChild) {
      tooltipRoot.firstChild.remove();
    }

    // Footer
    let tooltipFooter = chart.canvas.parentNode.querySelector('.series-tooltip-footer');
    if (!tooltipFooter && footer) {
      tooltipFooter = document.createElement('p');
      tooltipFooter.setAttribute('class', 'series-tooltip-footer');
      tooltipFooter.style.width = '100%';
      tooltipFooter.innerHTML = footer;
      tooltipFooter.style.textAlign = 'center';
      tooltipFooter.style.color = '#fff';
    }

    // Add new children
    tooltipHeader && tooltipRoot.appendChild(tooltipHeader);
    tooltipBody && tooltipRoot.appendChild(tooltipBody);
    tooltipFooter && tooltipRoot.appendChild(tooltipFooter);
  }

  const { offsetLeft: positionX, offsetTop: positionY } = chart.canvas;
  tooltipEl.style.opacity = 1;
  tooltipEl.style.left = positionX + tooltip.caretX + 'px';
  tooltipEl.style.top = positionY + tooltip.caretY + 'px';
  tooltipEl.style.font = tooltip.options.bodyFont.string;
  tooltipEl.style.padding = tooltip.options.padding + 'px ' + tooltip.options.padding + 'px';
};

export { externalTooltipHandler };
