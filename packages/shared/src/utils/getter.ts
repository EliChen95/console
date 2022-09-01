import { omit, get, isEmpty } from 'lodash';

export const getServedVersion = (item: any) => {
  const versions = get(item, 'spec.versions', []);
  if (versions.length === 0) {
    return '';
  }
  let servedVersion = get(versions[versions.length - 1], 'name');
  versions.some((ver: any) => {
    if (get(ver, 'served', false)) {
      servedVersion = get(ver, 'name', servedVersion);
      return true;
    }
    return false;
  });
  return servedVersion;
};

export const getResourceCreator = <T extends Record<string, any>>(item: T): string =>
  get(item, 'metadata.annotations["kubesphere.io/creator"]') ||
  get(item, 'metadata.annotations.creator') ||
  '';

export const getDescription = <T extends Record<string, any>>(item: T): string =>
  get(item, 'metadata.annotations["kubesphere.io/description"]') ||
  get(item, 'metadata.annotations.desc') ||
  '';

export const getAliasName = <T extends Record<string, any>>(item: T): string =>
  get(item, 'metadata.annotations["kubesphere.io/alias-name"]') ||
  get(item, 'metadata.annotations.displayName') ||
  '';

export const getDisplayName = <T extends Record<string, any>>(item: T): string => {
  if (isEmpty(item)) {
    return '';
  }

  if (item.display_name) {
    return item.display_name;
  }

  return `${item.name}${item.aliasName ? `(${item.aliasName})` : ''}`;
};

type OmitKeys =
  | 'status'
  | 'metadata.uid'
  | 'metadata.selfLink'
  | 'metadata.generation'
  | 'metadata.ownerReferences'
  | 'metadata.resourceVersion'
  | 'metadata.creationTimestamp'
  | 'metadata.managedFields';

export type OriginData<T extends Record<string, any> = Record<string, any>> = Omit<T, OmitKeys>;

export const getOriginData = <T extends Record<string, any>>(item: T): OriginData<T> =>
  omit(item, [
    'status',
    'metadata.uid',
    'metadata.selfLink',
    'metadata.generation',
    'metadata.ownerReferences',
    'metadata.resourceVersion',
    'metadata.creationTimestamp',
    'metadata.managedFields',
  ]);

export interface BaseInfo {
  uid: string;
  name: string;
  creator: string;
  description: string;
  aliasName: string;
  createTime: string;
  resourceVersion: string;
  isFedManaged: boolean;
}

export const getBaseInfo = <T extends Record<string, any>>(item: T): BaseInfo => ({
  uid: get(item, 'metadata.uid', ''),
  name: get(item, 'metadata.name', ''),
  creator: getResourceCreator<T>(item),
  description: getDescription<T>(item),
  aliasName: getAliasName<T>(item),
  createTime: get(item, 'metadata.creationTimestamp', ''),
  resourceVersion: get(item, 'metadata.resourceVersion', ''),
  isFedManaged: get(item, 'metadata.labels["kubefed.io/managed"]') === 'true',
});

export const getRoleBaseInfo = <T extends Record<string, any>>(
  item: T,
  module: 'workspaceroles' | 'globalroles' | 'clusterroles' | 'roles' | 'devopsroles' | string,
) => {
  const baseInfo = getBaseInfo<T>(item);
  const labels = get(item, 'metadata.labels', {});

  if (!get(labels, ['iam.kubesphere.io/role-template'])) {
    switch (module) {
      case 'workspaceroles': {
        const label = get(labels, ['kubesphere.io/workspace']);
        const name = baseInfo.name.slice(label.length + 1);
        if (globals.config.presetWorkspaceRoles.includes(name)) {
          baseInfo.description = t(`ROLE_WORKSPACE_${name.toUpperCase().replace(/-/g, '_')}`);
        }
        break;
      }
      case 'globalroles': {
        const name = baseInfo.name;
        if (globals.config.presetGlobalRoles.includes(name)) {
          baseInfo.description = t(`ROLE_${name.toUpperCase().replace(/-/g, '_')}`);
        }
        break;
      }
      case 'clusterroles': {
        const name = baseInfo.name;
        if (globals.config.presetClusterRoles.includes(name)) {
          baseInfo.description = t(`ROLE_${name.toUpperCase().replace(/-/g, '_')}`);
        }
        break;
      }
      case 'roles': {
        const name = baseInfo.name;
        if (globals.config.presetRoles.includes(name)) {
          baseInfo.description = t(`ROLE_PROJECT_${name.toUpperCase().replace(/-/g, '_')}`);
        }
        break;
      }
      case 'devopsroles': {
        const name = baseInfo.name;
        if (globals.config.presetRoles.includes(name)) {
          baseInfo.description = t(`ROLE_DEVOPS_${name.toUpperCase().replace(/-/g, '_')}`);
        }
        break;
      }
      default:
    }
  }

  return baseInfo;
};
