import type { Chart } from 'chart.js/auto';
import { alphaColor } from '../../helpers/color';
import { CJElement } from '../../types';

export function chartSegmentStatus(originChartColor: string | string[]) {
  return {
    id: 'chartSegmentStatus',
    beforeUpdate: (chart: Chart): void => {
      const data = chart.config.data;
      if (!data?.datasets?.length) {
        return;
      }
      const metaData = chart.getDatasetMeta(0);
      const originBG = originChartColor;

      const selectedArr = metaData?.data?.map((data: CJElement) => data?.selected ?? false);

      if (typeof originBG !== 'string' && originBG?.length > 0) {
        const result = originBG.map((color: string, index: number) => {
          if (selectedArr[index]) {
            return color;
          } else {
            return alphaColor(color, 0.4);
          }
        });
        data.datasets[0].backgroundColor = result;
      }

      if (selectedArr.every((selected) => selected === false)) {
        data.datasets[0].backgroundColor = originBG;
      }
    },
  };
}
