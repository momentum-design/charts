export interface LayoutData {
  id?: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface LayoutOptions {
  cols: number;
  gap: number;
  cellHeight: number;
}

export enum LayoutEventType {
  BoxRenderComplete = 'boxRenderComplete',
}
