import { common } from '@mui/material/colors';
import { alpha } from '@mui/material/styles';
import { error, indigo, info, neutral, success, warning } from './colors';

export function createPalette() {
  return {
    action: {
      active: neutral[500],
      disabled: alpha(neutral[900], 0.38),
      disabledBackground: alpha(neutral[900], 0.12),
      focus: alpha(neutral[900], 0.16),
      hover: alpha(neutral[900], 0.04),
      selected: alpha(neutral[900], 0.12)
    },
    background: {
      default: "#ededed", // background
      paper: common.white
    },
    divider: '#F2F4F7',
    error,
    info,
    mode: 'light',
    neutral,
    primary: indigo, // primary color
    success,
    text: {
      primary: neutral[900], // text color
      secondary: neutral[500], // secondary text color
      disabled: alpha(neutral[900], 0.38)
    },
    warning
  };
}
