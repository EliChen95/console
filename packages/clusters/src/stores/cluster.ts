import {
  request,
  Constants,
  getBaseInfo,
  getOriginData,
  PathParams,
  isMultiCluster,
  useUrl,
  useList,
} from '@ks-console/shared';
import { keyBy, get, has, cloneDeep } from 'lodash';

export const clusterMapper = (item: any) => {
  const conditions = keyBy(get(item, 'status.conditions', []), 'type');
  const configz = get(item, 'status.configz', {});
  configz.ksVersion = get(item, 'status.kubeSphereVersion', '');

  return {
    ...getBaseInfo(item),
    conditions,
    configz,
    provider: get(item, 'spec.provider'),
    isHost: has(get(item, 'metadata.labels', {}), 'cluster-role.kubesphere.io/host'),
    kkName: get(item, 'metadata.labels["kubekey.kubesphere.io/name"]', ''),
    nodeCount: get(item, 'status.nodeCount'),
    kubernetesVersion: get(item, 'status.kubernetesVersion'),
    labels: get(item, 'metadata.labels'),
    group: get(item, 'metadata.labels["cluster.kubesphere.io/group"]', ''),
    isReady: isMultiCluster() ? get(conditions, 'Ready.status') === 'True' : true,
    visibility: get(item, 'metadata.labels["cluster.kubesphere.io/visibility"]'),
    connectionType: get(item, 'spec.connection.type'),
    _originData: getOriginData(item),
  };
};

export const module = 'clusters';

const { getResourceUrl, getPath } = useUrl({ module });

export const fetchDetail = async (params: PathParams) => {
  let detail;

  if (!isMultiCluster()) {
    detail = clusterMapper(cloneDeep(Constants.DEFAULT_CLUSTER));
  } else {
    const url = `${getResourceUrl(params)}/${params.name}`;
    const result = await request(url);

    detail = { ...params, ...clusterMapper(result) };
  }

  return detail;
};

const getTenantUrl = (params = {}) =>
  `kapis/tenant.kubesphere.io/v1alpha2${getPath(params)}/${module}`;

export const fetchList = (params: Record<string, any>, isGranted?: boolean) => {
  if (!isMultiCluster()) {
    return {
      data: [Constants.DEFAULT_CLUSTER].map(clusterMapper),
      isLoading: false,
      total: 1,
      refresh() {},
      reFetch() {},
    };
  }

  const url = !isGranted ? getResourceUrl() : getTenantUrl();

  return useList({ url, params, format: clusterMapper });
};
