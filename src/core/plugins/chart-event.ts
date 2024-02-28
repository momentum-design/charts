import type { Chart } from 'chart.js/auto';
import { setColorToRgba } from '../utils';

export function chartSeriesStatus(originChartColor: string | string[]) {
  return {
    id: 'chartSeriesStatus',
    beforeUpdate: (chart: Chart): void => {
      const data = chart.config.data;
      const metaData = chart.getDatasetMeta(0);
      const originBG = originChartColor;

      const selectedArr = metaData?.data?.map((data) => data.active);

      if (typeof originBG !== 'string' && originBG?.length > 0) {
        const result = originBG.map((color: string, index: number) => {
          if (selectedArr[index]) {
            return color;
          } else {
            return setColorToRgba(color, 0.4);
          }
        });
        data.datasets.length ? (data.datasets[0].backgroundColor = result) : null;
      }

      if (selectedArr.every((selected) => selected === false)) {
        data.datasets.length ? (data.datasets[0].backgroundColor = originBG) : null;
      }
    },
  };
}
