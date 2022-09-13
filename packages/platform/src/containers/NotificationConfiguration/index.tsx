import React from 'react';
import { isEmpty } from 'lodash';
import { Loudspeaker } from '@kubed/icons';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { Banner, Navs, Card, Loading } from '@kubed/components';

import ConfigForm from './ConfigForm';
import type { LabelValue, NavItem } from '../../types';
import { getNotificationConfigurationTabs } from '../../utils/navs';

import { CssContainer } from './styles';

function NotificationConfiguration(): JSX.Element {
  const navigate = useNavigate();
  const { tab = 'mail' } = useParams<any>();
  const isLoading = false;
  const tabs: NavItem[] = getNotificationConfigurationTabs();
  const navs: Array<LabelValue> = tabs.map((item: NavItem) => ({
    label: t(item.title),
    value: item.name,
  }));

  function handleNavsChange(navKey: string): void {
    navigate(`/settings/notification-configuration/${navKey}`);
  }

  return (
    <CssContainer>
      <div className="mb-12">
        <Banner
          icon={<Loudspeaker />}
          className="mb12"
          title={t('NOTIFICATION_CONFIGURATION')}
          description={t('NOTIFICATION_CONFIGURATION_DESC')}
        />
        {!isEmpty(navs) && <Navs value={tab} onChange={handleNavsChange} data={navs} />}
      </div>
      <Card>
        <Outlet />
        {isLoading && <Loading className="loading" />}
        {!isLoading && <ConfigForm currentTab={tab} tabs={tabs} />}
      </Card>
    </CssContainer>
  );
}

export default NotificationConfiguration;
