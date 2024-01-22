import {
  ChartConfiguration as CJChartConfiguration,
  ChartOptions as CJChartOptions,
  Plugin as CJPlugin,
} from 'chart.js/auto';
import { cloneDeep } from 'lodash-es';
import { getFontStyleAbbreviation } from '../../core';
import { ChartType } from '../../types';
import { PieChart } from '../pie';
import { CenterLabel, DonutChartOptions, DonutData } from './donut.type';

export class DonutChart extends PieChart<DonutData, DonutChartOptions> {
  static readonly defaults: DonutChartOptions = {
    innerRadius: '80%',
    legend: {
      position: 'right',
    },
    centerLabels: [{}, {}],
  };

  getType(): ChartType {
    return ChartType.Donut;
  }

  onWheel(): void {
    throw new Error('Method not implemented.');
  }

  protected getConfiguration(): CJChartConfiguration {
    const donutConfig = super.getConfiguration();
    donutConfig?.plugins?.push(this.centerLabelsPlugin());
    return donutConfig;
  }

  protected getDefaultOptions(): DonutChartOptions {
    return DonutChart.defaults;
  }

  protected afterOptionsCreated(options: CJChartOptions): CJChartOptions {
    const _options = options as CJChartOptions<'doughnut'>;
    _options.cutout = this.options.innerRadius;
    return _options as CJChartOptions;
  }

  private centerLabelsPlugin(): CJPlugin {
    return {
      id: 'centerLabels',
      afterDatasetDraw: () => {
        this.setCenterLabels();
      },
    };
  }

  private setCenterLabels(): void {
    if (!this.api) {
      return;
    }

    const metaSets = this.api.getSortedVisibleDatasetMetas();
    if (metaSets.length > 1) {
      return;
    }

    const ctx = this.api.ctx;
    const chartArea = this.api.chartArea;
    const chartWidth = chartArea.right - chartArea.left;
    const chartHeight = chartArea.bottom - chartArea.top;
    const canvasCenterX = chartWidth / 2 + chartArea.left;
    const canvasCenterY = chartHeight / 2 + chartArea.top;
    const centerLabels = this.options.centerLabels ? cloneDeep<CenterLabel[]>(this.options.centerLabels) : [];

    // remove the unit placeholder if no unit specified
    // in order to put total label in the middle
    if (!this.options.valueUnit && centerLabels.length > 1 && !centerLabels[1].text) {
      centerLabels.splice(1, 1);
    }

    const meta = this.api.getDatasetMeta(0);
    let innerRadius = 0;
    let total = 0;
    if ('total' in meta) {
      total = meta.total as number;
    }
    if ('innerRadius' in meta.data[0]) {
      innerRadius = meta.data[0].innerRadius as number;
    }

    const scaleNum = innerRadius / 80 > 1 ? 1 : innerRadius / 80;
    centerLabels?.forEach((label: CenterLabel, index: number) => {
      if (index > 1) {
        // ignore items after second one
        return;
      }

      if (!label.font) {
        label.font = {};
      }

      const cjFont = this.getCJFont(label.font || {}, {
        size: index === 0 ? 36 : 14,
      });
      if (cjFont.size) {
        cjFont.size = cjFont.size * scaleNum;
      }
      // required as the following offset will use the size.
      label.font.size = cjFont.size;

      let topOffset = 0;
      if (centerLabels.length > 1 && centerLabels[0]?.font?.size) {
        topOffset = centerLabels[0]?.font?.size;
      }

      if (index === 0) {
        // The first placeholder, the total will be shown.
        if (!label.text) {
          label.text = this.formatBigNumber(total);
        }
        if (!label.font.color) {
          label.font.color = this.options.font?.color;
        }
      }
      if (index === 1) {
        // The second placeholder, the unit will be shown
        if (!label.text) {
          label.text = this.options.valueUnit || '';
        }
        // if the font color does not specified
        if (!label.font?.color) {
          // set the muted color
          label.font.color = this.options.mutedColor;
        }
      }

      if (!label.text) {
        return;
      }

      ctx.font = getFontStyleAbbreviation(cjFont);
      ctx.textBaseline = 'middle';
      ctx.fillStyle = label.font?.color || '';
      ctx.fillText(
        label.text,
        canvasCenterX - ctx.measureText(label.text).width / 2,
        index === 0 ? canvasCenterY - topOffset / 4 : canvasCenterY + topOffset / 2,
      );
    });
  }
}
