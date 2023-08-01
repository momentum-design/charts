import { Chart } from 'chart.js/auto';

export const CenterValue = {
  id: 'CenterValue',
  afterDatasetDraw: (chart: Chart | any) => {
    const { ctx } = chart;
    const cx = chart.getDatasetMeta(0).data[0].x;
    const cy = chart.getDatasetMeta(0).data[0].y;
    const fontColor = chart.config.options.fontColor;
    const fontFamily = chart.config.options.fontFamily;
    let fontSize = 30;
    const centerValue = chart.config.data.datasets[0].centerValue;
    ctx.save();

    // Font
    if (chart.width / 600 > 1) {
      fontSize = 24;
    } else if (chart.width / 600 < 0.5) {
      fontSize = 12;
    } else {
      fontSize = Math.floor((chart.width / 600) * 30);
    }

    if (centerValue) {
      ctx.font = `${fontSize}px ${fontFamily}`;
      ctx.fillStyle = fontColor;
      ctx.textAlign = 'center';
      ctx.fillText(centerValue, cx, cy);
      ctx.restore();
    }
  },
};
