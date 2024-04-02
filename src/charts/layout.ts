interface IOptions {
  gap: number;
  cols: number;
  cellHeight: number;
}

interface IData {
  width: number;
  height: number;
  x: number;
  y: number;
  id?: string;
}

export class LayoutJs {
  private layoutElement: HTMLElement;
  private options: IOptions;
  private data: IData[];

  constructor(layoutSelector: string, data: IData[], options: IOptions = { gap: 10, cols: 6, cellHeight: 30 }) {
    this.layoutElement = document.querySelector(layoutSelector) as HTMLElement;
    this.layoutElement.style.position = 'relative';
    this.options = options;
    this.data = data;

    window.addEventListener('resize', this.handleResize.bind(this));
  }

  private render(): void {
    const { gap, cellHeight, cols } = this.options;
    const gridWidth = this.layoutElement.clientWidth;
    const cellWidth = (gridWidth - gap * (cols - 1)) / cols;
    let maxHeight = 0;

    const boxElements = this.layoutElement.querySelectorAll(':scope > div');
    boxElements.forEach((box, index) => {
      const curData = this.data[index];
      const width = curData.width * (cellWidth + gap) - gap + 'px';
      const height = curData.height * (cellHeight + gap) - gap + 'px';
      const left = curData.x * (cellWidth + gap) + 'px';
      const top = curData.y * (cellHeight + gap) + 'px';

      box.setAttribute(
        'style',
        `position:absolute;width:${width};height:${height};transform:translate3d(${left}, ${top}, 0) `,
      );

      const boxBottom = curData.y * (cellHeight + gap) + curData.height * cellHeight;
      if (boxBottom > maxHeight) {
        maxHeight = boxBottom;
      }
    });

    this.layoutElement.style.height = maxHeight + 'px';
  }

  private handleResize(): void {
    this.render();
  }
}
