import { Chart } from '../src/lib/.internal';
import { ChartOptions, ColorMode, TableData } from '../src/types';

interface TestChartOptions extends ChartOptions {
  id?: string;
}

class TestChart extends Chart<any, TestChartOptions> {
  static defaults: TestChartOptions = {
    id: 'TestChart',
  };

  getTableData(): TableData {
    throw new Error('Method not implemented.');
  }

  getFormattedValue(value: number): string {
    return this.formatValueWithUnit(value);
  }

  protected getConfiguration() {
    return null;
  }

  protected getDefaultOptions() {
    return TestChart.defaults;
  }
}

describe('chart', () => {
  let chart: TestChart;
  const chartData = {};

  describe('theme and colors', () => {
    const keys = ['key1', 'key2', 'key3', 'key4'];
    const chartColors = ['#ff0000', '#00ff00', '#0000ff'];
    const chartOptions: TestChartOptions = { id: 'testChartInstance', colors: chartColors };

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

  describe('data', () => {
    describe('format value', () => {
      const chart = new TestChart(chartData, {
        valuePrecision: 5,
        valueUnit: 'mins',
      });
      test.each([
        [1234567, `1,234,567 ${chart.options.valueUnit}`],
        [1234567.123456, `1,234,567.12346 ${chart.options.valueUnit}`],
      ])('%d -> %s', (a, b) => {
        expect(chart.getFormattedValue(a)).toBe(b);
        expect(chart.getFormattedValue(a)).toBe(b);
      });
    });
  });
});
