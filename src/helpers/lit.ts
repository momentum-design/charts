import { CSSResult, LitElement, unsafeCSS } from 'lit';

/**
 * Some really basic transformation of shadow to light DOM styles with minimal encapsulation.
 * @param e
 * @param selector
 * @returns
 */
export function wrapSelector(
  e: typeof LitElement & { tag: string; disableShadowRoot: boolean },
  selector: string,
): CSSResult {
  if (e.disableShadowRoot) {
    if (!selector.includes(':host')) {
      selector = `:host ${selector}`;
    }
    selector = selector.replace(/\:host/g, e.tag);
  }
  return unsafeCSS(selector);
}
