import { isNullOrUndefined } from './utils';

export class DomElement {
  private htmlElement: HTMLElement;
  private parentDom?: DomElement;

  get nativeElement() {
    return this.htmlElement;
  }

  constructor(tagOrElement: string | HTMLElement) {
    if (tagOrElement instanceof HTMLElement) {
      this.htmlElement = tagOrElement;
    } else {
      this.htmlElement = document.createElement(tagOrElement);
    }
  }

  newChild(childTag: string): DomElement {
    const child = new DomElement(childTag);
    this.htmlElement.appendChild(child.htmlElement);
    this.parentDom = this;
    return child;
  }

  addChild(domElement: DomElement): DomElement {
    domElement.appendTo(this.nativeElement);
    return this;
  }

  clearChildren(): DomElement {
    this.htmlElement.innerHTML = '';
    return this;
  }

  setAttribute(name: string, value?: string | number | null): DomElement {
    if (!isNullOrUndefined(value)) {
      this.htmlElement.setAttribute(name, value!.toString());
    }
    return this;
  }

  setStyle(name: string, value?: string | number | null): DomElement {
    if (!isNullOrUndefined(value)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (<any>this.htmlElement.style)[name] = value;
    }
    return this;
  }

  addClass(...tokens: string[]): DomElement {
    this.htmlElement.classList.add(...tokens);
    return this;
  }

  removeClass(...tokens: string[]): DomElement {
    this.htmlElement.classList.remove(...tokens);
    return this;
  }

  setText(text: string): DomElement {
    this.htmlElement.innerText = text;
    return this;
  }

  setHtml(html: string): DomElement {
    this.htmlElement.innerHTML = html;
    return this;
  }

  parent(): DomElement | undefined {
    return this.parentDom;
  }

  appendTo(element: HTMLElement): DomElement {
    element.appendChild(this.htmlElement);
    return this;
  }

  appendToBody(): DomElement {
    this.appendTo(document.body);
    return this;
  }
}

export function findDomElement(selector: string): DomElement | null {
  if (document.querySelector(selector)) {
    return new DomElement(document.querySelector(selector) as HTMLElement);
  }

  return null;
}
