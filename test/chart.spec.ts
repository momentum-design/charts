import { Chart } from '../src/lib/.internal';
import { ChartOptions, ColorMode, TableData } from '../src/types';

interface TestChartOptions extends ChartOptions {
  id: string;
}

class TestChart extends Chart<{}, TestChartOptions> {
  static defaultOptions = {
    id: 'TestChart',
  };
  getTableData(): TableData {
    throw new Error('Method not implemented.');
  }
  protected getConfiguration() {
    return null;
  }
  protected getDefaultOptions() {
    return TestChart.defaultOptions;
  }
}

describe('chart', () => {
  describe('theme and colors', () => {
    let chart: TestChart;
    let chartData = {};
    let keys = ['key1', 'key2', 'key3', 'key4'];
    let chartColors = ['#ff0000', '#00ff00', '#0000ff'];
    let chartOptions: TestChartOptions = { id: 'testChartInstance', colors: chartColors };

    it('should create an instance', () => {
      chart = new TestChart(chartData, chartOptions);
      expect(chart).toBeTruthy();
    });

    it('should return correct colors', () => {
      chart = new TestChart(chartData, chartOptions);
      const colors = (<any>chart).getColorsForKeys(keys);
      expect(colors.length).toBe(keys.length);
      expect(colors[0]).toBe(chartColors[0]);
    });

    it('should repeat the colors if exceeding the color definitions', () => {
      chart = new TestChart(chartData, { colorMode: ColorMode.Repeat, ...chartOptions });
      const colors = (<any>chart).getColorsForKeys(keys);
      expect(colors[3]).toBe(chartColors[0]);
    });

    it('should repeat the colors if exceeding the color definitions and there are some color mapping definitions', () => {
      const firstColor = '#000000';
      chart = new TestChart(chartData, {
        colorMode: ColorMode.Repeat,
        colorMapping: {
          [keys[0]]: firstColor,
        },
        ...chartOptions,
      });
      const colors = (<any>chart).getColorsForKeys(keys);
      expect(colors[0]).toBe(firstColor);
      expect(colors[1]).toBe(chartColors[0]);
    });
  });
});
