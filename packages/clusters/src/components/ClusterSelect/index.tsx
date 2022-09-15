import React, { useState, useMemo } from 'react';
import { Alert, Checkbox } from '@kubed/components';
import { isEmpty } from 'lodash';
import { fetchList, module } from '../../stores/cluster';
import { hasPermission, isMultiCluster } from '@ks-console/shared';
import { AlertWrapper, ClusterItem, ClusterSelectItemWrapper, ClusterSelectWrapper } from './style';

interface Props {
  value?: Array<{ name: string }>;
  onChange?: (val: Array<{ name: string }>) => void;
}

function ClusterSelect({ value = [], onChange }: Props): JSX.Element {
  const [showTip, setShowTip] = useState<boolean>(false);
  const hasManagePermission = hasPermission({ module, action: 'manage' });
  const params = hasManagePermission
    ? { limit: -1 }
    : { limit: -1, labelSelector: 'cluster.kubesphere.io/visibility=public' };
  const { data = [], isLoading } = fetchList(params, !hasManagePermission);
  const hostCluster = useMemo(
    () => data.filter((item: any) => item.isHost).map((item: any) => item.name),
    [data],
  );
  const handleClick = (name: string) => {
    let newValue: Array<{ name: string }> = [];
    if (value.some(item => item.name === name)) {
      newValue = value.filter(item => item.name !== name);
    } else {
      newValue = [...value, { name }];
    }

    setShowTip(newValue.some(item => hostCluster.includes(item.name)));
    onChange?.(newValue);
  };

  if (isEmpty(data) && !isLoading) {
    return <Alert type="warning">{t('NO_CLUSTER_AVAILABLE_DESC')}</Alert>;
  }
  return (
    <ClusterSelectWrapper>
      {showTip && <AlertWrapper type="warning">{t('SELECT_HOST_CLUSTER_WARNING')}</AlertWrapper>}
      {data.map((cluster: any) => (
        <ClusterSelectItemWrapper
          className={!isMultiCluster() ? 'disabled' : ''}
          key={cluster.name}
          onClick={isMultiCluster() ? () => handleClick(cluster.name) : undefined}
        >
          <Checkbox
            checked={value.some(item => item.name === cluster.name)}
            disabled={!isMultiCluster()}
            onClick={e => e.stopPropagation()}
          />
          <ClusterItem cluster={cluster} />
        </ClusterSelectItemWrapper>
      ))}
    </ClusterSelectWrapper>
  );
}

export default ClusterSelect;
