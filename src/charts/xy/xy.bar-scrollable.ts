import { Chart as CJ, Plugin } from 'chart.js/auto';
import { Chart } from '../.internal';
import { XYChartOptions, XYData } from './xy.types';

export class BarScrollable<TChart extends Chart<XYData, XYChartOptions>> {
  constructor(public chart: TChart) {}

  public toCJPlugin(): Plugin {
    const chart = this.chart;
    return {
      id: 'barScrollable',
      start: () => {},
      beforeInit: () => {},
      afterDatasetsDraw(cj: CJ) {
        const {
          ctx,
          chartArea: { height },
          width,
        } = cj;
        const {
          categoryAxis: { max },
        } = cj.getInitialScaleBounds();
        const labelsCount = cj.data.labels?.length ?? 0;
        const labelSizePerPage = max + 1;
        if (labelSizePerPage >= labelsCount) {
          return;
        }

        const scale = cj.scales.categoryAxis;
        const firstPositiveIndex = scale.getValueForPixel(scale.getPixelForTick(0)) ?? 0;
        const rectX = width - 10;
        const rectY = scale.getBasePixel() - height;
        const rectWidth = 8;
        const radii = 8;
        const rectHeight = height;

        ctx.beginPath();
        ctx.fillStyle = chart.getCurrentTheme()?.scrollbarBackgroundColor;
        ctx.roundRect(rectX, rectY, rectWidth, rectHeight, radii);
        ctx.fill();
        ctx.beginPath();
        ctx.fillStyle = chart.getCurrentTheme()?.scrollbarThumbBackgroundColor;
        ctx.roundRect(
          rectX,
          rectY + (firstPositiveIndex / labelsCount) * rectHeight,
          rectWidth,
          (labelSizePerPage / labelsCount) * rectHeight,
          radii,
        );
        ctx.fill();
      },
    };
  }
}
