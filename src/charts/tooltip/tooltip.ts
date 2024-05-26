/* eslint-disable @typescript-eslint/no-explicit-any */
import { CoreInteractionOptions as CJCoreInteractionOptions, TooltipModel as CJTooltipModel } from 'chart.js/auto';
import { COMPONENT_PREFIX } from '../../core';
import { formatNumber, isNullOrUndefined, mergeObjects } from '../../helpers';
import { DomElement, findDomElement } from '../../helpers/dom';
import { ChartData, ChartOptions, ChartType, CJUnknownChartType } from '../../types';
import { Chart } from '../.internal';
import { TooltipItem, TooltipOptions } from './tooltip.types';

const TOOLTIP_ID = `${COMPONENT_PREFIX}-tooltip`;
const TOOLTIP_CLASS = TOOLTIP_ID;

export class Tooltip<TChart extends Chart<ChartData, ChartOptions>> {
  static defaults: TooltipOptions = {
    fontSize: '13px',
    borderRadius: '4px',
    padding: '0.5rem 0.75rem',
    showTotal: false,
  };

  private options: TooltipOptions;
  private chartOptions: ChartOptions;

  constructor(public chart: TChart, options?: TooltipOptions) {
    this.chartOptions = this.chart.options;
    this.options = mergeObjects(Tooltip.defaults, options || {});
  }

  toCJPlugin(): any {
    const plugin: any = {
      enabled: this.options?.useNative,
      position: 'nearest',
      usePointStyle: true,
      callbacks: {},
    };

    if (!this.options?.useNative) {
      plugin.external = this.generateTooltipHtml.bind(this);
    }

    return plugin;
  }

  toCJInteraction(isHorizontal?: boolean): CJCoreInteractionOptions {
    const interaction = {
      intersect: false,
      axis: isHorizontal ? 'y' : 'x',
      mode: 'nearest',
    };
    if (this.options.combineItems) {
      interaction.mode = 'index';
    }
    return interaction as CJCoreInteractionOptions;
  }

  generateTooltipHtml(context: any) {
    // Tooltip Element
    const { chart, tooltip } = context;
    let tooltipEl = findDomElement(`#${TOOLTIP_ID}`);

    const chartType = chart.config.type;
    // Create element on first render
    if (!tooltipEl) {
      tooltipEl = new DomElement('div')
        .setAttribute('id', TOOLTIP_ID)
        .setStyle('opacity', 0)
        .setStyle('pointer-events', 'none')
        .setStyle('position', 'absolute')
        .setStyle('transition', 'all .1s ease')
        // .appendToBody();
        // below will append the tooltip element to container, but it may be cut by container.
        .appendTo(chart.canvas.parentNode as HTMLElement);
      if (this.options.maxWidth) {
        tooltipEl.setStyle('max-width', this.options.maxWidth);
      }
    }

    // Hide if no tooltip
    if (tooltip.opacity === 0) {
      tooltipEl.setStyle('opacity', 0);
      return;
    }

    // clear content
    tooltipEl.clearChildren();

    // Set caret Position
    tooltipEl.removeClass('above', 'below', 'no-transform');
    if (tooltip.yAlign) {
      tooltipEl.addClass(tooltip.yAlign);
    } else {
      tooltipEl.addClass('no-transform');
    }

    const tooltipContainer = new DomElement('div')
      .addClass(`${TOOLTIP_CLASS}-container`)
      .setStyle('border-radius', this.options.borderRadius)
      .setStyle('padding', this.options.padding)
      .setStyle('font-size', this.options.fontSize)
      .setStyle('background-color', this.chart.getCurrentTheme()?.tooltipBackgroundColor)
      .setStyle('color', this.chart.getCurrentTheme()?.tooltipTextColor);

    // title
    let titles: string[] = [];
    if (this.options?.title) {
      if (typeof this.options.title === 'string') {
        titles = [this.options.title];
      } else if (Array.isArray(this.options.title)) {
        titles = this.options.title;
      } else if (typeof this.options.title === 'function') {
        const titleFnResult = this.options.title(tooltip);
        if (typeof titleFnResult === 'string') {
          titles = [titleFnResult];
        } else if (Array.isArray(titleFnResult)) {
          titles = titleFnResult;
        }
      }
    }

    // items
    let tooltipItems: TooltipItem[] = [];
    if (typeof this.options.items === 'function') {
      tooltipItems = this.options.items(tooltip);
    } else {
      tooltipItems = this.options.items as TooltipItem[];
    }
    if (typeof this.options.sortItems === 'function') {
      tooltipItems = this.options.sortItems(tooltipItems);
    }
    const reverse = chart?.config?.options?.plugins?.legend?.reverse ?? false;
    if (reverse) {
      tooltipItems.reverse();
    }
    const datasetLength = chart.data.datasets.length;
    const tooltipItemsLength = tooltipItems.length;

    let titleExists = false;
    const hideTitleConditionWithoutTotal =
      !this.options.showTotal &&
      JSON.stringify(tooltip.title) === JSON.stringify(titles) &&
      tooltipItemsLength === 1 &&
      datasetLength === 1;
    const hideTitleConditionWithTotal =
      this.options.showTotal && JSON.stringify(tooltip.title) === JSON.stringify(titles);
    const hideTitleOnlyForPie = this.options.showTotal && chartType === ChartType.Pie && tooltipItemsLength > 1;
    if (
      titles.length > 0 &&
      ((!hideTitleConditionWithoutTotal && !hideTitleConditionWithTotal && !hideTitleOnlyForPie) ||
        this.options.beforeBody ||
        (this.options.showTotal && this.options.totalLabel))
    ) {
      titles.forEach((title: string) => {
        tooltipContainer
          ?.newChild('div')
          .addClass(`${TOOLTIP_CLASS}-title`)
          .setStyle('font-weight', 'bold')
          .setText(this.options.formatTitle ? this.options.formatTitle(title) : title);
      });
      titleExists = true;
    }
    // beforeBody
    if (this.options.beforeBody) {
      let beforeBody = '';
      if (typeof this.options.beforeBody === 'string') {
        beforeBody = this.options.beforeBody;
      } else if (typeof this.options.beforeBody === 'function') {
        beforeBody = this.options.beforeBody(tooltip);
      }
      tooltipContainer.newChild('div').addClass(`${TOOLTIP_CLASS}-before-body`).setHtml(beforeBody);
    }
    this.addTotalElement(tooltipContainer, titles, tooltipItems, titleExists, tooltip, chart);

    tooltipItems.forEach((tooltipItem: TooltipItem) => {
      const itemEl = tooltipContainer
        ?.newChild('div')
        .addClass(`${TOOLTIP_CLASS}-item`)
        .setStyle('display', 'flex')
        .setStyle('align-items', 'center');

      if (tooltipItem.active && tooltipItemsLength > 1) {
        itemEl?.addClass('active');
      }

      // icon
      itemEl?.addChild(this.generateHtmlForIcon(tooltipItem));

      // label
      if (datasetLength === 1 && tooltipItemsLength === 1 && chartType === ChartType.Bar) {
        itemEl?.addChild(
          new DomElement('span')
            .addClass(`${TOOLTIP_CLASS}-label`)
            .setStyle('white-space', 'nowrap')
            .setHtml(this.options.formatTitle ? this.options.formatTitle(tooltip.title) : tooltip.title),
        );
      } else if (tooltipItem.label) {
        itemEl?.addChild(this.generateHtmlForLabel(tooltipItem));
      }

      // values
      itemEl?.addChild(this.generateHtmlForValues(tooltipItem, tooltip));
    });

    // AfterBody
    if (this.options.afterBody) {
      let afterBody = '';
      if (typeof this.options.afterBody === 'string') {
        afterBody = this.options.afterBody;
      } else if (typeof this.options.afterBody === 'function') {
        afterBody = this.options.afterBody(tooltip);
      }
      tooltipContainer.newChild('div').addClass(`${TOOLTIP_CLASS}-after-body`).setHtml(afterBody);
    }

    // footer
    if (this.options?.footer) {
      let footers: string[] = [];
      if (typeof this.options.footer === 'string') {
        footers = [this.options.footer];
      } else if (Array.isArray(this.options.footer)) {
        footers = this.options.footer;
      } else if (typeof this.options.footer === 'function') {
        const footerFnResult = this.options.footer(chart);
        if (typeof footerFnResult === 'string') {
          footers = [footerFnResult];
        } else if (Array.isArray(footerFnResult)) {
          footers = footerFnResult;
        }
      }

      const footerEl = tooltipContainer
        .newChild('div')
        .addClass(`${TOOLTIP_CLASS}-footer`)
        .setStyle('text-align', 'center');
      footers.forEach((text: string) => {
        footerEl.newChild('div').setHtml(text);
      });
    }

    const arrowEl = new DomElement('div')
      .addClass(`${TOOLTIP_CLASS}-arrow`)
      .setStyle('position', 'absolute')
      .setStyle('border-style', 'solid')
      .setStyle('border-color', 'transparent')
      .setStyle('border-width', '6px');

    this.setPosition(context, tooltip, arrowEl, tooltipEl);

    // add arrow and container for tooltip
    tooltipEl.addChild(arrowEl);
    tooltipEl.addChild(tooltipContainer);
  }

  // set the position of the tooltip dynamically
  private setPosition(context: any, tooltip: any, arrowEl: DomElement, tooltipEl: DomElement): void {
    const position = context.chart.canvas.getBoundingClientRect();
    const left = position.left + window.scrollX + tooltip.caretX + 'px';
    const top = position.top + window.scrollY + tooltip.caretY + 'px';
    // display, position, and set styles
    tooltipEl.setStyle('opacity', '1');
    tooltipEl.setStyle('left', left);
    tooltipEl.setStyle('top', top);

    const xAlign = tooltip.xAlign;
    const yAlign = tooltip.yAlign;
    const arrowColor = this.chart.getCurrentTheme()?.tooltipBackgroundColor;

    const alignments: {
      [position: string]: {
        arrow?: { [key: string]: string };
        tooltip?: string;
      };
    } = {
      'center-top': {
        arrow: { top: '0', left: '50%', 'border-bottom-color': arrowColor, transform: 'translate(-50%, -11px)' },
        tooltip: 'translate(-50%, 6px)',
      },
      'right-top': {
        arrow: { top: '0', left: '100%', 'border-bottom-color': arrowColor, transform: 'translate(-18px, -11px)' },
        tooltip: 'translate(calc(-100% + 12px), 6px)',
      },
      'right-center': {
        arrow: { top: '50%', left: '100%', 'border-left-color': arrowColor, transform: 'translate(-1px, -50%)' },
        tooltip: 'translate(calc(-100% - 6px), -50%)',
      },
      'right-bottom': {
        arrow: { top: '100%', left: '100%', 'border-top-color': arrowColor, transform: 'translate(-18px, -1px)' },
        tooltip: 'translate(calc(-100% + 12px), calc(-100% - 6px))',
      },
      'center-bottom': {
        arrow: { top: '100%', left: '50%', 'border-top-color': arrowColor, transform: 'translate(-50%, -1px)' },
        tooltip: 'translate(-50%, calc(-100% - 6px))',
      },
      'left-bottom': {
        arrow: { top: '100%', left: '0', 'border-top-color': arrowColor, transform: 'translate(6px, -1px)' },
        tooltip: 'translate(-12px, calc(-100% - 6px))',
      },
      'left-center': {
        arrow: { top: '50%', left: '0', 'border-right-color': arrowColor, transform: 'translate(-11px, -50%)' },
        tooltip: 'translate(6px, -50%)',
      },
      'left-top': {
        arrow: { top: '0', left: '0', 'border-bottom-color': arrowColor, transform: 'translate(6px, -11px)' },
        tooltip: 'translate(-12px, 6px)',
      },
      'center-center': {
        tooltip: 'translate(-50%, -50%)',
      },
    };

    const alignKey = `${xAlign}-${yAlign}`;
    if (alignments[alignKey]) {
      if (alignments[alignKey].arrow) {
        Object.entries(alignments[alignKey].arrow as { [key: string]: string }).forEach(([key, value]) =>
          arrowEl.setStyle(key, value),
        );
      }
      tooltipEl.setStyle('transform', alignments[alignKey].tooltip);
    }
  }

  private generateHtmlForIcon(tooltipItem: TooltipItem): DomElement {
    return new DomElement('span')
      .addClass(`${TOOLTIP_CLASS}-icon`)
      .setStyle('display', 'inline-block')
      .setStyle('margin-right', '0.25rem')
      .setStyle('width', '1em')
      .setStyle('height', '1em')
      .setStyle('background', tooltipItem.colors.backgroundColor)
      .setStyle('border-radius', '4px')
      .setStyle('border-style', 'solid')
      .setStyle(
        'border-color',
        tooltipItem.colors.backgroundColor === tooltipItem.colors.backgroundColor
          ? '#dedede66'
          : tooltipItem.colors.borderColor,
      )
      .setStyle('border-width', '1px');
  }

  // label
  private generateHtmlForLabel(tooltipItem: TooltipItem): DomElement {
    const labelText =
      typeof this.options.formatLabel === 'function' ? this.options.formatLabel(tooltipItem.label) : tooltipItem.label;
    return new DomElement('span')
      .addClass(`${TOOLTIP_CLASS}-label`)
      .setStyle('white-space', 'nowrap')
      .setHtml(labelText);
  }

  private generateHtmlForValues(tooltipItem: TooltipItem, tooltip?: CJTooltipModel<CJUnknownChartType>): DomElement {
    const valuesEl = new DomElement('span')
      .addClass(`${TOOLTIP_CLASS}-values`)
      .setStyle('flex', '1')
      .setStyle('text-align', 'right')
      .setStyle('margin-left', '0.5rem');

    // value
    if (!isNullOrUndefined(tooltipItem.value)) {
      if (typeof this.options.formatValue === 'function') {
        valuesEl.setHtml(this.options.formatValue(tooltipItem.value as number, tooltip));
      } else {
        const valueText = `<span>${formatNumber(tooltipItem.value!, this.chartOptions.valuePrecision!)}</span>${
          this.options.showUnit ? ` ` + this.chartOptions.valueUnit || '' : ''
        }`;
        valuesEl.setHtml(valueText);
        // percentage
        if (this.options.showPercentage) {
          const percentageEl = valuesEl.newChild('span').setStyle('margin-left', '0.25rem');
          if (typeof tooltipItem.percent !== 'undefined') {
            percentageEl.setText('(' + formatNumber(tooltipItem.percent, this.chartOptions.valuePrecision!) + '%)');
          }
        }
      }
    }

    return valuesEl;
  }

  private generateHtmlForTotalValue(
    tooltipItems: TooltipItem[],
    tooltip?: CJTooltipModel<CJUnknownChartType>,
  ): DomElement {
    let total = 0;
    tooltipItems.forEach((tooltipItem: TooltipItem) => {
      total = total + (tooltipItem?.value ?? 0);
    });
    const valuesEl = new DomElement('span')
      .addClass(`${TOOLTIP_CLASS}-values`)
      .setStyle('flex', '1')
      .setStyle('text-align', 'right')
      .setStyle('margin-left', '0.5rem');

    // value
    if (typeof this.options.formatValue === 'function') {
      valuesEl.setHtml(this.options.formatValue(total, tooltip));
    } else {
      const valueText = `<span>${formatNumber(total, this.chartOptions.valuePrecision!)}</span>${
        this.options.showUnit ? ` ` + this.chartOptions.valueUnit || '' : ''
      }`;
      valuesEl.setHtml(valueText);
      // percentage
      if (this.options.showPercentage) {
        valuesEl
          .newChild('span')
          .setStyle('margin-left', '0.25rem')
          .setText('(' + formatNumber(100, this.chartOptions.valuePrecision!) + '%)');
      }
    }

    return valuesEl;
  }

  private addTotalElement(
    tooltipContainer: DomElement,
    titles: string[],
    tooltipItems: TooltipItem[],
    titleExists: boolean,
    tooltip: any,
    chart: any,
  ): void {
    if (this.options.showTotal && tooltipItems.length > 1) {
      const chartType = chart.config.type;
      let titleText = '';
      // Use "," to join multiple titles together.
      if (this.options.totalLabel) {
        titleText = this.options.totalLabel;
      } else if (chartType === ChartType.Pie) {
        titleText = titles && JSON.stringify(tooltip.title) !== JSON.stringify(titles) ? titles.toString() : '';
      } else {
        titleText = tooltip.title ? tooltip.title.toString() : '';
      }
      const totalEl = new DomElement('div')
        .addClass(`${TOOLTIP_CLASS}-total`)
        .setStyle('display', 'flex')
        .setStyle('align-items', 'center');

      totalEl?.addChild(
        new DomElement('span')
          .addClass(`${TOOLTIP_CLASS}-label`)
          .setStyle('white-space', 'nowrap')
          .setStyle('font-weight', `${titleExists ? 'normal' : 'bold'}`)
          .setHtml(this.options.formatTitle ? this.options.formatTitle(titleText) : titleText),
      );

      totalEl?.addChild(this.generateHtmlForTotalValue(tooltipItems, tooltip));
      tooltipContainer.addChild(totalEl);
    }
  }
}
