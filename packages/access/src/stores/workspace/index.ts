import {
  request,
  getBaseInfo,
  getOriginData,
  PathParams,
  useUrl,
  getResourceCreator,
} from '@ks-console/shared';
import { keyBy, get, set, cloneDeep, isEmpty } from 'lodash';
import { MappedWorkspace, OriginalWorkspace } from './types';

export const name = 'WORKSPACE';
export const module = 'workspace';

const { getResourceUrl, getPath } = useUrl({ module });
const getTenantUrl = (params = {}) =>
  globals.clusterRole === 'host'
    ? `kapis/tenant.kubesphere.io/v1alpha3${getPath(params)}/workspacetemplates`
    : `kapis/tenant.kubesphere.io/v1alpha3${getPath(params)}/${module}`;

export const getListUrl = (params: Record<string, any> = {}) =>
  params.cluster ? getResourceUrl() : getTenantUrl();
const getDetailUrl = (params: PathParams = {}) => `${getListUrl(params)}/${params.name}`;

export const workspaceMapper = (item: OriginalWorkspace): MappedWorkspace => {
  const overrides = get(item, 'spec.overrides', []);
  const template = get(item, 'spec.template', {});
  const clusters: any[] = get(item, 'spec.placement.clusters', []);

  const overrideClusterMap: Record<string, any> = keyBy(overrides, 'clusterName');
  const clusterTemplates: Record<string, any> = {};
  clusters.forEach(({ cluster }) => {
    clusterTemplates[cluster] = cloneDeep(template);
    if (overrideClusterMap[cluster] && overrideClusterMap[cluster].clusterOverrides) {
      overrideClusterMap[cluster].clusterOverrides.forEach((cod: any) => {
        const path = cod.path.startsWith('/') ? cod.path.slice(1) : cod.path;
        set(clusterTemplates[cluster], path.replace(/\//g, '.'), cod.value);
      });
    }
  });

  return {
    ...getBaseInfo(item),
    annotations: get(item, 'metadata.annotations', {}),
    manager:
      get(item, 'spec.template.spec.manager') ||
      get(item, 'spec.manager') ||
      getResourceCreator(item),
    clusters,
    networkIsolation: get(item, 'spec.template.spec.networkIsolation'),
    overrides,
    clusterTemplates,
    _originData: getOriginData(item),
  };
};
export const deleteWorkspace = ({
  params = {},
  data,
}: {
  params?: PathParams;
  data?: Record<string, any>;
}) => request.delete(getDetailUrl(params), { data });

export const fetchDetail = async ({ cluster, workspace }: PathParams) => {
  if (isEmpty(workspace)) {
    return;
  }

  const res = await request.get<OriginalWorkspace>(getDetailUrl({ name: workspace, cluster }));

  return { ...workspaceMapper(res.data), cluster };
};
