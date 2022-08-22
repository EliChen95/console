import {
  request,
  getBaseInfo,
  getOriginData,
  PathParams,
  useUrl,
  getResourceCreator,
} from '@ks-console/shared';
import { keyBy, get, set, cloneDeep, isEmpty } from 'lodash';

const module = 'workspace';

const { getResourceUrl, getPath, getDetailUrl } = useUrl({ module });
const getTenantUrl = (params = {}) =>
  globals.clusterRole === 'host'
    ? `kapis/tenant.kubesphere.io/v1alpha3${getPath(params)}/workspacetemplates`
    : `kapis/tenant.kubesphere.io/v1alpha3${getPath(params)}/${module}`;
export const getListUrl = (params: Record<string, any> = {}) =>
  params.cluster ? getResourceUrl() : getTenantUrl();
export const workspaceMapper = (item: any) => {
  const overrides = get(item, 'spec.overrides', []);
  const template = get(item, 'spec.template', {});
  const clusters: any[] = get(item, 'spec.placement.clusters', []);

  const overrideClusterMap: Record<string, any> = keyBy(overrides, 'clusterName');
  const clusterTemplates: Record<string, any> = {};
  clusters.forEach(({ name }) => {
    clusterTemplates[name] = cloneDeep(template);
    if (overrideClusterMap[name] && overrideClusterMap[name].clusterOverrides) {
      overrideClusterMap[name].clusterOverrides.forEach((cod: any) => {
        const path = cod.path.startsWith('/') ? cod.path.slice(1) : cod.path;
        set(clusterTemplates[name], path.replace(/\//g, '.'), cod.value);
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

export const fetchDetail = async ({ cluster, workspace }: PathParams) => {
  if (isEmpty(workspace)) {
    return;
  }

  const detail = await request.get(getDetailUrl({ name: workspace, cluster })).catch(err => {
    if (
      err.reason === 'Not Found' ||
      err.reason === 'No Such Object' ||
      err.reason === 'Forbidden'
    ) {
      // navigate('/404');
    }
  });

  return { ...workspaceMapper(detail), cluster };
};
