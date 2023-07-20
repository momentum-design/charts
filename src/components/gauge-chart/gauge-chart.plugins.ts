import { Chart } from 'chart.js/auto';

export const GaugeNeedle = {
  id: 'GaugeNeedle',
  afterDatasetDraw: (chart: Chart | any, args: any) => {
    const {
      ctx,
      chartArea: { left, right },
    } = chart;

    const dataTotal = args.meta.total;
    const chartValue = args.meta._dataset.value;
    const averageValue = dataTotal / 2;
    const angle = Math.PI + (1 / dataTotal) * chartValue * Math.PI;
    const cy = chart._metasets[0].data[0].y;
    const cx = chart.width / 2;
    ctx.save();

    // Needle
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(0, -2);
    ctx.lineTo(cy - 80, 0);
    ctx.lineTo(0, 2);
    ctx.fillStyle = '#000';
    ctx.fill();

    // Needle dot
    ctx.translate(-cx, -cy);
    ctx.arc(cx, cy, 5, 0, 10);
    ctx.fill();
    ctx.restore();

    // Font
    ctx.font = '16px Helvetica';
    ctx.fillStyle = '#000';
    ctx.textAlign = 'center';
    ctx.fillText(chartValue.toString(), cx, cy + 30);
    ctx.textAlign = 'center';
    ctx.fillText(averageValue.toString(), cx, 30);
    ctx.textAlign = 'left';
    ctx.fillText('0', left - 20, cy);
    ctx.textAlign = 'right';
    ctx.fillText(dataTotal.toString(), right + 30, cy);
    ctx.restore();
  },
};
