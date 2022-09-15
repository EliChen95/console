import React, { PropsWithChildren } from 'react';
import styled from 'styled-components';
import { keyBy } from 'lodash';
import { Tag } from '@kubed/components';
import { Icon, Constants } from '@ks-console/shared';

const { CLUSTER_GROUP_TAG_TYPE, CLUSTER_PROVIDER_ICON } = Constants;

interface ClusterWrapperProps {
  clusters: any[];
  clustersDetail: any;
}

const Tags = styled.div`
  .tag {
    margin-right: 4px;

    .icon {
      margin-top: -2px;
      margin-right: 2px;
    }
  }
`;

function ClusterWrapper({
  clusters,
  clustersDetail,
  children,
}: PropsWithChildren<ClusterWrapperProps>): JSX.Element {
  const clusterMap = keyBy(clustersDetail, 'name');
  return (
    <Tags>
      {clusters.map(item => {
        const cluster = clusterMap[item.name] || item;
        return (
          <Tag key={cluster.name} type={CLUSTER_GROUP_TAG_TYPE[cluster.group]}>
            <Icon
              name={CLUSTER_PROVIDER_ICON[cluster.provider] || 'kubernetes'}
              size={16}
              variant="light"
            />
            {children ? children : cluster.name}
          </Tag>
        );
      })}
    </Tags>
  );
}

export default ClusterWrapper;
