import { A11y } from '../../types/a11y.types';

export interface PanelData {
  title: string;
  description: string;
}

export interface PanelOptions {
  descriptionMode: 'icon' | 'subtitle';
  radioButtonGroups?: RadioButtonGroup[];
  actions?: Actions;
}

export interface Actions extends A11y {
  label: string;
  items: Action[];
  onClick?: (value: Button | number | string, index?: number) => string | number;
}

export interface Button extends A11y {
  label: string;
  icon?: string;
  value: string | number;
  active?: boolean;
  onClick?: (value: Button | number | string, index?: number) => string | number;
}

export interface RadioButtonGroup extends A11y {
  type: GroupType;
  buttons?: Button[];
  onClick?: (value: Button | number | string, index?: number) => string | number;
}

export interface Action extends A11y {
  label: string;
  icon?: string;
  value: string | number;
  hoverShow?: boolean;
  onClick?: (value: Action | number | string, index?: number) => string | number;
}

export enum GroupType {
  ChartType = 'chartType',
  TimeGrain = 'timeGrain',
  Percentage = 'percentage',
}

export enum PanelEventType {
  ActionClick = 'actionClick',
  ButtonGroupClick = 'panelButtonGroupClick',
  ThemeChange = 'themeChange',
}
