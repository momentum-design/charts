import { Chart } from 'chart.js/auto';

const getCenterValue = (chart: Chart | any, centerLabel: any, cx: number, cy: number) => {
  let centerContent = chart.canvas.parentNode.querySelector('.centerContent');
  if (!centerContent) {
    centerContent = document.createElement('div');
    centerContent.setAttribute('class', 'centerContent');
    centerContent.style.textAlign = 'center';
    centerContent.innerHTML = centerLabel;
    centerContent.style.position = 'absolute';
    chart.canvas.parentNode.appendChild(centerContent);
  }
  const styles = window.getComputedStyle(centerContent);
  const offsetWidth = parseInt(styles.width, 10);
  const offsetHeight = parseInt(styles.height, 10);
  centerContent.style.left = cx - offsetWidth / 2 + 'px';
  centerContent.style.top = cy - offsetHeight / 2 + 'px';
  return centerContent;
};

export const centerValue = {
  id: 'centerValue',
  afterDatasetDraw: (chart: Chart | any) => {
    const { ctx } = chart;
    const cx = chart.getDatasetMeta(0).data[0]?.x;
    const cy = chart.getDatasetMeta(0).data[0]?.y;
    const centerLabel = chart.config.options.centerLabel;
    getCenterValue(chart, centerLabel, cx, cy);
  },
};
