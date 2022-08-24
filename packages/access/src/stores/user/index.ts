import { useMutation } from 'react-query';
import { useUrl, request } from '@ks-console/shared';

import type { GetPathParams } from '../../types';

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

export interface UserCreateParams {
  apiVersion: 'iam.kubesphere.io/v1alpha2';
  kind: 'User';
  metadata: {
    name: string;
    annotations: {
      'iam.kubesphere.io/globalrole'?: string;
      'kubesphere.io/description'?: string;
      'iam.kubesphere.io/uninitialized': 'true';
      'kubesphere.io/creator': string;
    };
  };
  spec: {
    email: string;
    password: string;
  };
}

export function useUserCreateMutation() {
  const url = getListUrl();
  return useMutation<unknown, unknown, UserCreateParams>(data => request.post(url, data));
}
