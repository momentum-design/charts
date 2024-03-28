export class LayoutHandler {
  private layoutElement: HTMLElement;
  private options: { gap: number; cols: number; cellHeight: number };
  private data: { id?: string; width: number; height: number; x: number; y: number }[];

  constructor(
    layoutSelector: string,
    data: { id?: string; width: number; height: number; x: number; y: number }[],
    options: { gap: number; cols: number; cellHeight: number },
  ) {
    this.layoutElement = document.querySelector(layoutSelector) as HTMLElement;
    this.layoutElement.style.position = 'relative';
    this.options = options;
    this.data = data;

    this.createLayout(data);

    window.addEventListener('resize', this.handleResize.bind(this));
  }

  private createLayout(data: { width: number; height: number; x: number; y: number }[]) {
    // Render Box
    const gap = this.options.gap;
    const cellHeight = this.options.cellHeight;
    const gridWidth = this.layoutElement.clientWidth;
    const cols = this.options.cols;
    const cellWidth = (gridWidth - gap * (cols + 1)) / cols;
    let maxHeight = 0;

    const boxElements = this.layoutElement.querySelectorAll('.mdw-layout-item');
    boxElements.forEach((box, index) => {
      const curData = data[index];
      const width = curData.width * (cellWidth + gap) - gap + 'px';
      const height = curData.height * (cellHeight + gap) - gap + 'px';
      const left = curData.x * (cellWidth + gap) + 'px';
      const top = curData.y * (cellHeight + gap) + 'px';

      (box as HTMLElement).style.position = 'absolute';
      (box as HTMLElement).style.width = width;
      (box as HTMLElement).style.height = height;
      (box as HTMLElement).style.transform = `translate3d(${left}, ${top}, 0)`;

      const boxBottom = curData.y * (cellHeight + gap) + curData.height * cellHeight;
      if (boxBottom > maxHeight) {
        maxHeight = boxBottom;
      }
    });

    this.layoutElement.style.height = maxHeight + 'px';
  }

  private handleResize() {
    this.createLayout(this.data);
  }

  static render(
    layoutSelector: string,
    data: { width: number; height: number; x: number; y: number }[],
    options: { gap: number; cols: number; cellHeight: number },
  ) {
    new LayoutHandler(layoutSelector, data, options);
  }
}
