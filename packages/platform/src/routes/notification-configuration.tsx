import React from 'react';
import { get } from 'lodash';
import { Navigate, RouteObject } from 'react-router-dom';

import type { NavItem } from '../types';
import { getNotificationConfigurationTabs } from '../utils/navs';

const tabs: NavItem[] = getNotificationConfigurationTabs();
const indexRoutePath = get(tabs, '[0].name', '/404');

const routes: RouteObject[] = [
  {
    index: true,
    element: <Navigate to={indexRoutePath} replace />,
  },
  {
    path: '/settings/notification-configuration/:tab',
    element: <></>,
  },
];

export default routes;
