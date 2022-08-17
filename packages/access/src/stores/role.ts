import { merge } from 'lodash';
import { useUrl, useList } from '@ks-console/shared';
import type { UseListOptions } from '@ks-console/shared';

import type { GetPathParams } from '../types';

const module = 'globalroles';

const { getPath } = useUrl({ module });

export function getResourceUrl(params?: GetPathParams) {
  return `kapis/iam.kubesphere.io/v1alpha2${getPath(params)}/${module}`;
}

interface Role {
  apiVersion: string;
}

export function useRoles(options?: Omit<UseListOptions<Role>, 'url'>) {
  // TODO: missing params ?
  const url = getResourceUrl();
  const params = {
    annotation: 'kubesphere.io/creator',
  };
  const opts = merge(
    {},
    {
      url,
      params,
    },
    options,
  );
  return useList(opts);
}
