/* eslint-disable @typescript-eslint/no-explicit-any */
import { CoreInteractionOptions as CJCoreInteractionOptions } from 'chart.js/auto';
import { formatNumber, isNullOrUndefined, mergeObjects } from '../../helpers';
import { DomElement, findDomElement } from '../../helpers/dom';
import { ChartData, ChartOptions } from '../../types';
import { Chart } from '../.internal';
import { TooltipItem, TooltipOptions } from './tooltip.types';

const TOOLTIP_ID = 'mdw-tooltip';
const TOOLTIP_CLASS = TOOLTIP_ID;

export class Tooltip<TChart extends Chart<ChartData, ChartOptions>> {
  static defaults: TooltipOptions = {
    fontSize: '13px',
    borderRadius: '4px',
    padding: '0.5rem 0.75rem',
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

  toCJInteraction(): CJCoreInteractionOptions {
    const interaction = {
      intersect: false,
      axis: 'xy',
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

    // Create element on first render
    if (!tooltipEl) {
      tooltipEl = new DomElement('div')
        .setAttribute('id', TOOLTIP_ID)
        .setStyle('border-radius', this.options.borderRadius)
        .setStyle('padding', this.options.padding)
        .setStyle('opacity', 0)
        .setStyle('pointer-events', 'none')
        .setStyle('position', 'absolute')
        .setStyle('transform', 'translate(-50%, 0)')
        .setStyle('transition', 'all .1s ease')
        .appendToBody();
      // below will append the tooltip element to container, but it may be cut by container.
      // .appendTo(chart.canvas.parentNode as HTMLElement);
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

    titles.forEach((title: string) => {
      tooltipEl
        ?.newChild('div')
        .addClass(`${TOOLTIP_CLASS}-title`)
        .setStyle('font-weight', 'bold')
        .setText(this.options.formatTitle ? this.options.formatTitle(title) : title);
    });

    // beforeBody
    if (this.options.beforeBody) {
      let beforeBody = '';
      if (typeof this.options.beforeBody === 'string') {
        beforeBody = this.options.beforeBody;
      } else if (typeof this.options.beforeBody === 'function') {
        beforeBody = this.options.beforeBody(tooltip);
      }
      tooltipEl.newChild('div').addClass(`${TOOLTIP_CLASS}-before-body`).setHtml(beforeBody);
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
    tooltipItems.forEach((tooltipItem: TooltipItem) => {
      const itemEl = tooltipEl
        ?.newChild('div')
        .addClass(`${TOOLTIP_CLASS}-item`)
        .setStyle('display', 'flex')
        .setStyle('align-items', 'center');

      if (tooltipItem.active && tooltipItems.length > 1) {
        itemEl?.addClass('active');
      }

      // icon
      itemEl?.addChild(this.generateHtmlForIcon(tooltipItem));

      // label
      const labelShouldBeHidden = titles && titles.length === 1 && tooltipItem.label === titles[0];
      if (tooltipItem.label && !labelShouldBeHidden) {
        itemEl?.addChild(this.generateHtmlForLabel(tooltipItem));
      }

      // values
      itemEl?.addChild(this.generateHtmlForValues(tooltipItem, labelShouldBeHidden));
    });

    // AfterBody
    if (this.options.afterBody) {
      let afterBody = '';
      if (typeof this.options.afterBody === 'string') {
        afterBody = this.options.afterBody;
      } else if (typeof this.options.beforeBody === 'function') {
        afterBody = this.options.afterBody(tooltip);
      }
      tooltipEl.newChild('div').addClass(`${TOOLTIP_CLASS}-after-body`).setHtml(afterBody);
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

      const footerEl = tooltipEl.newChild('div').addClass(`${TOOLTIP_CLASS}-footer`).setStyle('text-align', 'center');
      footers.forEach((text: string) => {
        footerEl.newChild('div').setHtml(text);
      });
    }

    const position = context.chart.canvas.getBoundingClientRect();
    const left = position.left + window.scrollX + tooltip.x + tooltip.width / 2 + 'px';
    const top = position.top + window.scrollY + tooltip.y + 'px';

    // display, position, and set styles
    tooltipEl.setStyle('font-size', this.options.fontSize);
    tooltipEl.setStyle('background-color', this.chart.getCurrentTheme()?.tooltipBackgroundColor);
    tooltipEl.setStyle('color', this.chart.getCurrentTheme()?.tooltipTextColor);
    tooltipEl.setStyle('opacity', '1');
    tooltipEl.setStyle('left', left);
    tooltipEl.setStyle('top', top);
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

  private generateHtmlForValues(tooltipItem: TooltipItem, labelHidden?: boolean): DomElement {
    const valuesEl = new DomElement('span').addClass(`${TOOLTIP_CLASS}-values`).setStyle('flex', '1');

    if (!labelHidden) {
      valuesEl.setStyle('text-align', 'right').setStyle('margin-left', '0.5rem');
    }

    // value
    if (!isNullOrUndefined(tooltipItem.value)) {
      const valueText =
        typeof this.options.formatValue === 'function'
          ? this.options.formatValue(tooltipItem.value as number)
          : `<span>${formatNumber(tooltipItem.value!, this.chartOptions.valuePrecision!)}</span>${
              this.options.showUnit ? this.chartOptions.valueUnit || '' : ''
            }`;
      valuesEl.setHtml(valueText);
    }

    // percentage
    if (this.options.showPercentage) {
      const percentageEl = valuesEl.newChild('span').setStyle('margin-left', '0.25rem');
      if (typeof tooltipItem.percent !== 'undefined') {
        percentageEl.setText('(' + formatNumber(tooltipItem.percent, this.chartOptions.valuePrecision!) + '%)');
      }
    }

    return valuesEl;
  }
}
