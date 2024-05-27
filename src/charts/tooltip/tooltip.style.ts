import { PositionDirection, PositionStyle } from './tooltip.types';

export const TooltipPositions: {
  [key in PositionDirection]: PositionStyle;
} = {
  [PositionDirection.CenterTop]: {
    arrow: { top: '0', left: '50%', borderDirection: 'bottom', transform: 'translate(-50%, -11px)' },
    transform: 'translate(-50%, 6px)',
  },
  [PositionDirection.RightTop]: {
    arrow: {
      top: '0',
      left: '100%',
      borderDirection: 'bottom',
      transform: 'translate(-18px, -11px)',
    },
    transform: 'translate(calc(-100% + 12px), 6px)',
  },
  [PositionDirection.RightCenter]: {
    arrow: { top: '50%', left: '100%', borderDirection: 'left', transform: 'translate(-1px, -50%)' },
    transform: 'translate(calc(-100% - 6px), -50%)',
  },
  [PositionDirection.RightBottom]: {
    arrow: { top: '100%', left: '100%', borderDirection: 'top', transform: 'translate(-18px, -1px)' },
    transform: 'translate(calc(-100% + 12px), calc(-100% - 6px))',
  },
  [PositionDirection.CenterBottom]: {
    arrow: { top: '100%', left: '50%', borderDirection: 'top', transform: 'translate(-50%, -1px)' },
    transform: 'translate(-50%, calc(-100% - 6px))',
  },
  [PositionDirection.LeftBottom]: {
    arrow: { top: '100%', left: '0', borderDirection: 'top', transform: 'translate(6px, -1px)' },
    transform: 'translate(-12px, calc(-100% - 6px))',
  },
  [PositionDirection.LeftCenter]: {
    arrow: { top: '50%', left: '0', borderDirection: 'right', transform: 'translate(-11px, -50%)' },
    transform: 'translate(6px, -50%)',
  },
  [PositionDirection.LeftTop]: {
    arrow: { top: '0', left: '0', borderDirection: 'bottom', transform: 'translate(6px, -11px)' },
    transform: 'translate(-12px, 6px)',
  },
  [PositionDirection.CenterCenter]: {
    transform: 'translate(-50%, -50%)',
  },
};
