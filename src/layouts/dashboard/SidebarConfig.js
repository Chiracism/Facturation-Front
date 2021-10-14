import { Icon } from '@iconify/react';
import pieChart2Fill from '@iconify/icons-eva/pie-chart-2-fill';
import peopleFill from '@iconify/icons-eva/people-fill';
import fileTextFill from '@iconify/icons-eva/file-text-fill';
import personFill from '@iconify/icons-eva/person-fill';
import awardFill from '@iconify/icons-eva/award-fill';
import compassFill from '@iconify/icons-eva/compass-fill';
import flagFill from '@iconify/icons-eva/flag-fill';
import listFill from '@iconify/icons-eva/list-fill';

import jwt from 'jsonwebtoken';

// ----------------------------------------------------------------------

const getIcon = (name) => <Icon icon={name} width={22} height={22} />;
let sidebarConfig = null;

export default function SidebarConfig() {
  // Check User Auth
  const tokenData = localStorage.getItem('lmc_token');

  if (tokenData) {
    const user = jwt.verify(JSON.parse(tokenData), process.env.REACT_APP_JWT_KEY);

    if (!user) {
      localStorage.removeItem('lmc_token');
      sidebarConfig = [];
    } else if (user && user.role_id === 1) {
      sidebarConfig = [
        {
          title: 'dashboard',
          path: '/dashboard/app',
          icon: getIcon(pieChart2Fill)
        },
        {
          title: 'formulaire importation',
          path: '/dashboard/importation',
          icon: getIcon(fileTextFill)
        },
        {
          title: 'formulaire exportation',
          path: '/dashboard/exportation',
          icon: getIcon(fileTextFill)
        },
        {
          title: 'Vessel',
          path: '/dashboard/vessel',
          icon: getIcon(compassFill)
        },
        {
          title: 'Port',
          path: '/dashboard/port',
          icon: getIcon(flagFill)
        },
        {
          title: 'Chargeur',
          path: '/dashboard/chargeur',
          icon: getIcon(personFill)
        },
        {
          title: 'Agence',
          path: '/dashboard/agence',
          icon: getIcon(awardFill)
        },
        {
          title: 'user',
          path: '/dashboard/user',
          icon: getIcon(peopleFill)
        },
        {
          title: 'historique exportation',
          path: '/dashboard/historique',
          icon: getIcon(listFill)
        },
        {
          title: 'historique importation',
          path: '/dashboard/import-historique',
          icon: getIcon(listFill)
        }
      ];
    } else if (user && user.role_id === 2) {
      sidebarConfig = [
        {
          title: 'dashboard',
          path: '/dashboard/app',
          icon: getIcon(pieChart2Fill)
        },
        {
          title: 'formulaire exportation',
          path: '/dashboard/exportation',
          icon: getIcon(fileTextFill)
        },
        {
          title: 'Vessel',
          path: '/dashboard/vessel',
          icon: getIcon(compassFill)
        },
        {
          title: 'Port',
          path: '/dashboard/port',
          icon: getIcon(flagFill)
        },
        {
          title: 'Chargeur',
          path: '/dashboard/chargeur',
          icon: getIcon(personFill)
        },
        {
          title: 'Agence',
          path: '/dashboard/agence',
          icon: getIcon(awardFill)
        }
      ];
    }
  } else {
    sidebarConfig = [];
  }

  return sidebarConfig;
}
