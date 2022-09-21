import React from 'react';
import { get } from 'lodash';
import { Navigate, RouteObject } from 'react-router-dom';

import BaseInfo from '../containers/BaseInfo';
import { getPlatformSettingsNavs } from '../utils/navs';
import SettingsLayout from '../containers/SettingsLayout';
import NotificationConfigurationRoutes from './notification-configuration';
import NotificationConfiguration from '../containers/NotificationConfiguration';

const navs = getPlatformSettingsNavs();
const indexRoutePath = get(navs, '[0].children[0].name', '/404');

const routes: RouteObject[] = [
  {
    path: '/settings',
    element: <SettingsLayout />,
    children: [
      {
        index: true,
        element: <Navigate to={indexRoutePath} replace />,
      },
      {
        path: 'base-info',
        element: <BaseInfo />,
      },
      {
        path: 'notification-configuration',
        element: <NotificationConfiguration />,
        children: NotificationConfigurationRoutes,
      },
    ],
  },
];

export default routes;
