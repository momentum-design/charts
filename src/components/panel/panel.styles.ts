import { css } from 'lit';

const themeStyles = css``;

const baseInfoStyles = css`
  .base-info {
    max-width: 90%;
    justify-content: flex-start;
    display: flex;
    align-items: center;
    margin-right: var(--rems-10px);
    color: var(--text-primary-normal);
    &.subtitle {
      flex-direction: column;
      align-items: flex-start;
    }
    .title {
      font-size: var(--rems-16px);
      overflow: hidden;
      text-overflow: ellipsis;
      font-weight: 500;
      white-space: nowrap;
      margin-right: var(--rems-10px);
    }
    .description-subtitle {
      font-size: var(--rems-12px);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .description-icon {
      background-image: var(--icon-info);
      width: var(--rems-16px);
      height: var(--rems-16px);
      background-size: var(--rems-16px);
      background-repeat: no-repeat;
      display: inline-block;
      cursor: pointer;
      position: relative;
    }
  }
`;

const panelActionsStyles = css`
  .actions {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    .actions-more {
      &:hover i {
        background-color: var(--button-secondary-bg-hover);
        border-radius: var(--rems-4px);
      }
      i {
        display: inline-block;
        cursor: pointer;
        position: relative;
        background-image: var(--icon-more);
        width: var(--rems-16px);
        height: var(--rems-16px);
        background-repeat: no-repeat;
        background-size: var(--rems-16px);
      }
      .actions-more-list {
        position: absolute;
        width: calc(2 * var(--rems-100px));
        display: none;
        background-color: #fff;
        transform: translateY(var(--rems-8px));
        transition: all 0.1s cubic-bezier(0.16, 1, 0.5, 1);
        list-style: none;
        padding: 0;
        margin: 0;
        border: var(--rems-1px) solid var(--border-color);
        border-radius: var(--rems-4px);
        background-color: var(--bg-primary-color);
        color: var(--text-primary-normal);
        li {
          > button {
            align-items: center;
            padding: var(--rems-5px) var(--rems-16px);
            text-decoration: none;
            background-color: transparent;
            border: none;
            cursor: pointer;
            width: 100%;
            line-height: var(--rems-24px);
            text-align: left;
            color: var(--text-primary-normal);
          }
          &:hover,
          &:focus {
            color: var(--dropdown-link-color-active);
            background-color: var(--dropdown-link-bg-active);
          }
        }
      }

      &:hover .actions-more-list {
        display: block;
        transform: translateY(0) translateX(calc(-180 * var(--rems-1px)));
      }
    }
  }
`;

const panelButtonGroupsStyles = css`
  .button-groups {
    display: flex;
    background-color: var(--bg-primary-color);
    margin-bottom: var(--rems-14px);
    .button-group {
      display: flex;
      background-color: var(--bg-secondary-color);
      padding: var(--rems-2px);
      border-radius: var(--rems-4px);
      &:not(:last-child) {
        margin-right: var(--rems-4px);
      }
      .button {
        min-width: var(--rems-30px);
        max-width: var(--rems-100px);
        height: var(--rems-24px);
        padding: var(--rems-4px) var(--rems-12px);
        border: none;
        color: var(--text-secondary-normal);
        font-size: var(--rems-14px);
        cursor: pointer;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        &:not(:last-child) {
          margin-right: var(--rems-2px);
        }
        &:not(.active):hover {
          background-color: var(--button-secondary-bg-hover);
        }
        &.active {
          border-radius: var(--rems-4px);
          background-color: var(--button-secondary-bg-active);
          color: var(--text-primary-normal);
        }
      }
    }
  }
`;

export const panelStyles = [
  themeStyles,
  css`
    .panel {
      border: var(--rems-1px) solid var(--border-color);
      border-radius: var(--rems-4px);
      background-color: var(--bg-primary-color);
      color: var(--text-primary-normal);
      min-width: calc(4 * var(--rems-100px));
      .panel-header {
        display: flex;
        justify-content: space-between;
        margin: var(--rems-14px);
        ${baseInfoStyles};
        ${panelActionsStyles};
      }
      .panel-body {
        margin: var(--rems-14px);
        ${panelButtonGroupsStyles};
      }
    }
  `,
];
