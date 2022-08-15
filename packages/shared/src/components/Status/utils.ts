import { findKey } from 'lodash';

import type { ColorAlias, StatusProps } from './types';

const COLOR_ALIAS: ColorAlias = {
  blue: ['draft', 'pending-review', 'to-be-reviewed', 'creating'],
  success: [
    'success',
    'succeeded',
    'successful',
    'ready',
    'running',
    'jobrunning',
    'active',
    'normal',
    'bound',
    'available',
    'healthy',
    'ok',
    'working',
    'passed',
    'published',
  ],
  warning: [
    'warning',
    'updating',
    'upgrading',
    'syncing',
    'building',
    'notrunning',
    'waiting',
    'terminating',
    'released',
    'unfinished',
    'firing',
    'major',
    'deleting',
    'in-review',
  ],
  error: [
    'error',
    'deleting',
    'deleted',
    'lost',
    'unschedulable',
    'failed',
    'critical',
    'rejected',
  ],
  default: [
    'default',
    'stopped',
    'disabled',
    'pending',
    'unknown',
    'draining',
    'terminated',
    'completed',
    'minor',
    'paused',
    'inactive',
    'suspended',
  ],
};

export function getColor(options?: Pick<StatusProps, 'type' | 'color'>): StatusProps['color'] {
  const color = options?.color;
  const type = options?.type;

  if (color) {
    return color;
  }

  if (typeof type === 'string') {
    const lowerCaseType = type.toLowerCase();
    const key = findKey(COLOR_ALIAS, alias => (alias as string[]).includes(lowerCaseType));

    if (key) {
      return key;
    }
  }

  return 'default';
}
