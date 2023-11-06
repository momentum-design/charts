/* eslint-disable @typescript-eslint/no-empty-interface */
import { ChartConfiguration, ChartConfigurationCustomTypesPerDataset } from 'chart.js/auto';
import { customElement } from 'lit/decorators.js';
import { ChartElement, COMPONENT_PREFIX } from '../../core';
import { getWordCloudConfiguration } from '../../lib/word-cloud';
import { ChartOptions, ChartTypeEnum } from '../../types';

@customElement(`${COMPONENT_PREFIX}-chart`)
export class HelloChart extends ChartElement<any, ChartOptions> {
  protected getChartJSConfiguration(): ChartConfiguration | ChartConfigurationCustomTypesPerDataset | null {
    switch (this.options?.type) {
      case ChartTypeEnum.WordCloud:
        return getWordCloudConfiguration(this.data || {}, this.options);
    }
    throw new Error('Method not implemented.');
  }
}
