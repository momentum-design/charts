import { ChartConfiguration, ChartOptions } from 'chart.js/auto';
import { getFontStyleAbbreviation } from '../../core';
import { ChartType } from '../../types';
import { PieChart } from '../pie';
import { CenterLabel, DonutData, DonutOptions } from './donut.type';
export class DonutChart extends PieChart<DonutData, DonutOptions> {
  static readonly donutOptions: DonutOptions = {
    legend: {
      position: 'right',
    },
    centerLabels: [],
  };

  getType(): ChartType {
    return ChartType.Donut;
  }

  protected getConfiguration(): ChartConfiguration {
    const donutConfig = super.getConfiguration();
    donutConfig?.plugins?.push(this.centerLabel());
    return donutConfig;
  }

  protected getDefaultOptions(): DonutOptions {
    return DonutChart.defaultOptions;
  }

  protected afterOptionsCreated(options: ChartOptions): ChartOptions {
    const _options = options as ChartOptions<'doughnut'>;
    _options.cutout = this.options.cutout;
    return _options as ChartOptions;
  }

  private centerLabel() {
    return {
      id: 'centerLabel',
      afterDatasetDraw: () => {
        this.getCenterValue();
      },
    };
  }

  private getCenterValue(): void {
    if (!this.api) {
      return;
    }

    const metaSets = this.api.getSortedVisibleDatasetMetas();
    if (metaSets.length > 1) {
      return;
    }

    const ctx = this.api.ctx;
    const centerY = this.api.height / 2;
    const centerLabels = this.options.centerLabels;

    const meta = this.api.getDatasetMeta(0);
    let innerRadius = 0;
    let outerRadius = 0;
    let total = 0;
    if ('total' in meta) {
      total = meta.total as number;
    }
    if ('innerRadius' in meta.data[0]) {
      innerRadius = meta.data[0].innerRadius as number;
    }
    if ('outerRadius' in metaSets[0].data[0]) {
      outerRadius = metaSets[0].data[0].outerRadius as number;
    }

    const scaleNum = innerRadius / 120 > 1 ? 1 : innerRadius / 120;

    ctx.save();
    centerLabels?.forEach((label: CenterLabel, index: number) => {
      const labelFont = this.getChartJSFont(label.font!, { size: index === 0 ? 30 : 14 });
      labelFont.size = labelFont.size! * scaleNum;
      if (label) {
        label.font = label.font || {};
        label.font.size = labelFont.size;
      }
      const offsetSize = centerLabels[0]?.font?.size ?? 0;
      const curFont = getFontStyleAbbreviation(labelFont);
      const text: string = label.text ? label.text : total.toString();
      ctx.font = curFont;
      ctx.textBaseline = 'middle';
      ctx.fillStyle = label.font?.style ?? 'black';
      ctx.fillText(text, outerRadius - ctx.measureText(text).width / 2, index === 0 ? centerY : centerY + offsetSize);
    });
    ctx.restore();
  }
}
