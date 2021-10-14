import { Navigate, useRoutes } from 'react-router-dom';

// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';

// Pages
import Login from './pages/Login';
import DashboardApp from './pages/DashboardApp';
import User from './pages/user/User';
import Historic from './pages/historic';
import ImportationHistoric from './pages/historicImportation';
import Vessel from './pages/vessel';
import Port from './pages/port';
import Exportation from './pages/exportation/Exportation';
import Importation from './pages/importation/Importation';
import Chargeur from './pages/chargeur';
import Agence from './pages/agence';
import NotFound from './pages/Page404';

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { path: '/', element: <Navigate to="/dashboard/app" replace /> },
        { path: 'app', element: <DashboardApp /> },
        { path: 'user', element: <User /> },
        { path: 'importation', element: <Importation /> },
        { path: 'exportation', element: <Exportation /> },
        { path: 'vessel', element: <Vessel /> },
        { path: 'port', element: <Port /> },
        { path: 'chargeur', element: <Chargeur /> },
        { path: 'agence', element: <Agence /> },
        { path: 'historique', element: <Historic /> },
        { path: 'import-historique', element: <ImportationHistoric /> }
      ]
    },
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        { path: '/', element: <Login /> },
        { path: '404', element: <NotFound /> },
        { path: 'dashboard', element: <Navigate to="/dashboard" /> },
        { path: '*', element: <Navigate to="/404" /> }
      ]
    },

    { path: '*', element: <Navigate to="/404" replace /> }
  ]);
}
