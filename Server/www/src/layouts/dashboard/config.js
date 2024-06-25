import ChartBarIcon from '@heroicons/react/24/solid/ChartBarIcon';
import ShoppingBagIcon from '@heroicons/react/24/solid/ShoppingBagIcon';
import UsersIcon from '@heroicons/react/24/solid/UsersIcon';
import SettingsIcon from '@heroicons/react/24/solid/Cog6ToothIcon'
import { SvgIcon } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus, faGears, faSliders, faSyringe } from '@fortawesome/free-solid-svg-icons';

export var items = [
  {
    title: 'Overview',
    path: '/',
    icon: (
      <SvgIcon fontSize="small">
        <ChartBarIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Bots',
    path: '/bots',
    icon: (
      <SvgIcon fontSize="small">
        <UsersIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Logs',
    path: '/logs-page',
    icon: (
      <SvgIcon fontSize="small">
        <ShoppingBagIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Injections',
    path: '/injections',
    icon: (
      <SvgIcon fontSize="small">
        <FontAwesomeIcon icon={faSyringe}></FontAwesomeIcon>
      </SvgIcon>
    )
  },
  {
    title: 'Settings',
    path: '/settings',
    icon: (
      <SvgIcon fontSize="small">
        <FontAwesomeIcon icon={faSliders}></FontAwesomeIcon>
      </SvgIcon>
    )
  }
];
