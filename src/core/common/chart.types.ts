const themes = {
  'color-health': ['#00CF64', '#FFC14F', '#D4371C', '#643ABD', '#F0677E', '#EBD460', '#00A3B5'],
  'qualitative-colors-primary': ['#643ABD', '#F0677E', '#EBD460', '#00A3B5', '#93C437', '#7D7A18', '#99DDFF'],
  'qualitative-colors-secondary': ['#0A78CC', '#16A693', '#FAC3F8', '#FF9D52', '#601E66', '#C7A5FA', '#D3DB7B'],
  'qualitative-colors-tertiary': ['#8C91BD', '#67E7F0', '#148579', '#F294F1', '#0A414D', '#B4BA43', '#996E00'],
  'sequential-colors-general-violet': ['#F0E3FC', '#E2CAFC', '#C7A5FA', '#A87FF1', '#875AE1', '#643ABD', '#432C77'],
  'sequential-colors-general-cobalt': ['#C7EEFF', '#99DDFF', '#5EBFF6', '#279BE7', '#0A78CC', '#08599C', '#103C62'],
  'sequential-colors-general-slate': ['#E3E7FA', '#CED2ED', '#B0B4D9', '#8C91BD', '#6F739E', '#535573', '#393A47'],
  'sequential-colors-health-green': ['#78F5B8', '#31E88C', '#00CF64', '#00AB50', '#00853C', '#03612C', '#08421F'],
  'sequential-colors-health-yellow': ['#FFD98C', '#FFC14F', '#FC9D03', '#D97F00', '#A85F00', '#7D4705', '#54330D'],
  'sequential-colors-health-red': ['#FFD5CC', '#FFBBAD', '#FF9580', '#F7644A', '#D4371C', '#A12512', '#6E1D13'],
  'diverging-colors-alerts': ['#FFCD59', '#F7A947', '#EE8335', '#E55920', '#CF3110', '#A82013', '#821016'],
  'diverging-colors-green-to-red': ['#008672', '#4BA28C', '#8CBBAC', '#CCD2CE', '#E19D79', '#C3411D', '#990000'],
};

export type LayoutPosition = 'left' | 'top' | 'right' | 'bottom' | 'center' | 'chartArea' | { [scaleId: string]: number };

export interface ChartOptions {
  responsive?: boolean;
  theme?: string | [];
  fontColor?: string;
  fontFamily?: string;
  aspectRatio?: number;
  isLegendClick?: boolean;
  legendDisplay?: boolean;
  legendPosition?: LayoutPosition;
  paddingLeft?: number;
  paddingRight?: number;
  paddingTop?: number;
  paddingBottom?: number;
}

const chartOptions: ChartOptions = {
  responsive: true,
  theme: 'color-health',
  fontColor: '#000',
  fontFamily: 'Helvetica',
  aspectRatio: 1.6,
};

export { themes, chartOptions };
