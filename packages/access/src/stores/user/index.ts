import { get, noop, merge } from 'lodash';
import { useMutation } from 'react-query';
import { notify } from '@kubed/components';
import { useUrl, getBaseInfo, getOriginData, request, cookie } from '@ks-console/shared';

import type { GetPathParams } from '../../types';
import type {
  OriginalUser,
  FormattedUser,
  UserStatusMutationType,
  UserCreateParams,
  UserEditParams,
} from '../../types/user';

export const module = 'users';

const { getPath, getDetailUrl } = useUrl({ module });

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

export function formatUser(item: OriginalUser): FormattedUser {
  return {
    ...getBaseInfo<OriginalUser>(item),
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
    _originData: getOriginData<OriginalUser>(item),
  };
}

export function showAction(item: FormattedUser) {
  return !globals.config.presetUsers.includes(item.name) && globals.user.username !== item.name;
}

export function useUserCreateMutation(options?: { onSuccess?: () => void }) {
  const onSuccess = options?.onSuccess;
  const url = getListUrl();
  return useMutation<unknown, unknown, UserCreateParams>(data => request.post(url, data), {
    onSuccess,
  });
}

export function useUserEditMutation({
  detail,
  onSuccess = noop,
}: {
  detail: FormattedUser;
  onSuccess?: () => void;
}) {
  const url = getDetailUrl(detail);
  return useMutation<unknown, unknown, UserEditParams>(data => request.put(url, data), {
    onSuccess: async (data, params) => {
      const { name } = detail;

      if (params.password && name === globals.user.username) {
        await request.post('logout');
      } else {
        const lang = params?.spec?.lang;
        if (lang && params.lang !== cookie('lang')) {
          window.location.reload();
        }
      }

      onSuccess();
    },
  });
}

function getStatus(detail: FormattedUser, type?: UserStatusMutationType) {
  if (type === 'active') {
    return 'Active';
  }

  if (type === 'disabled') {
    return 'Disabled';
  }

  return detail.status === 'Active' ? 'Disabled' : 'Active';
}

function userStatusMutationFn(detail: FormattedUser, type?: UserStatusMutationType) {
  const url = getDetailUrl(detail);
  const params = merge(
    {
      apiVersion: 'iam.kubesphere.io/v1alpha2',
      kind: 'User',
    },
    detail._originData,
    {
      status: {
        state: getStatus(detail, type),
      },
      metadata: {
        resourceVersion: detail.resourceVersion,
      },
    },
  );
  return request.put(url, params);
}

export function useUserStatusMutation(options?: { onSuccess?: () => void }) {
  const onSuccess = options?.onSuccess;
  return useMutation(userStatusMutationFn, { onSuccess });
}

export function useUsersStatusMutation(options?: { onSuccess?: () => void }) {
  const onSuccess = options?.onSuccess;
  return useMutation(
    ({ details, type }: { details: FormattedUser[]; type?: UserStatusMutationType }) => {
      const promises = details.map(detail => userStatusMutationFn(detail, type));
      return Promise.allSettled(promises);
    },
    { onSuccess },
  );
}

export function validateUserDelete(detail: FormattedUser) {
  if (detail.name === globals.user.username) {
    notify.error(t('Error Tips'), t('Unable to delete itself'));
    return false;
  }

  return true;
}

export function useUserDeleteMutation(options?: { onSuccess?: () => void }) {
  const onSuccess = options?.onSuccess;

  return useMutation(
    (detail: FormattedUser) => {
      const url = getDetailUrl(detail);
      return request.delete(url);
    },
    { onSuccess },
  );
}
