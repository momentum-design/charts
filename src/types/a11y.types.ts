export interface A11y {
  tabindex?: number;
  role?: ARIARoles;
  ariaLabel?: string;
}
// TODO: see https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles
type ARIARoles = 'button' | 'checkbox' | 'radio' | 'switch';
