import SettingsContext from "src/settings";

export function checkperms(n) {
  n = n - 1 
  if (n < 0 || n >= SettingsContext.user.permissions.length) {
    throw new Error('Index out of bounds');
  }

  const character = SettingsContext.user.permissions[n];

  if (character === '1') {
    return true;
  } else if (character === '0') {
    return false;
  }
}