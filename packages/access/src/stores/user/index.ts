import { get } from 'lodash';
import { useMutation } from 'react-query';
import { useUrl, getBaseInfo, getOriginData, request } from '@ks-console/shared';

import type { GetPathParams } from '../../types';
import type { UserCreateParams } from '../../types/user';
import type { OriginalUser } from './types';

const module = 'users';

const { getPath } = useUrl({ module });

function getModule(params?: GetPathParams) {
  const cluster = params?.cluster;
  const workspace = params?.workspace;
  const namespace = params?.namespace;
  const devops = params?.devops;

  if (namespace || devops) {
    return 'members';
  }

  if (workspace) {
    return 'workspacemembers';
  }

  if (cluster) {
    return 'clustermembers';
  }

  return 'users';
}

export function getResourceUrl(params?: GetPathParams) {
  return `kapis/iam.kubesphere.io/v1alpha2${getPath(params)}/${getModule(params)}`;
}

export const getListUrl = getResourceUrl;

export function formatUser(item: OriginalUser) {
  return {
    ...getBaseInfo(item),
    username: get(item, 'metadata.name', ''),
    email: get(item, 'spec.email', ''),
    role: get(item, 'metadata.annotations["iam.kubesphere.io/role"]', ''),
    globalrole: get(item, 'metadata.annotations["iam.kubesphere.io/globalrole"]', ''),
    clusterrole: get(item, 'metadata.annotations["iam.kubesphere.io/clusterrole"]', ''),
    workspacerole: get(item, 'metadata.annotations["iam.kubesphere.io/workspacerole"]', ''),
    roleBind: get(item, 'metadata.annotations["iam.kubesphere.io/role-binding"]', ''),
    groups: get(item, 'spec.groups', []),
    status: get(item, 'status.state', 'Pending'),
    conditions: get(item, 'status.conditions', []),
    lastLoginTime: get(item, 'status.lastLoginTime'),
    _originData: getOriginData(item),
  };
}

export function useUserCreateMutation(options?: { onSuccess?: () => void }) {
  const url = getListUrl();
  const onSuccess = options?.onSuccess;
  return useMutation<unknown, unknown, UserCreateParams>(data => request.post(url, data), {
    onSuccess,
  });
}
