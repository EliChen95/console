// @ts-ignore
import debounce from 'debounce-promise';
import request from './request';
import { getDetailUrl } from './urlHelper';
import type { PathParams } from '../types';

export const emailValidator = debounce(async (rule: any, value: string) => {
  const resp: any = await request.get('kapis/iam.kubesphere.io/v1alpha2/users', {
    params: { email: value },
    // @ts-ignore
    headers: { 'x-check-exist': true },
  });

  if (resp.exist) return Promise.reject(t('EMAIL_EXISTS'));
  return Promise.resolve();
}, 500);

export const nameValidator = debounce(async (params: PathParams) => {
  const url = getDetailUrl(params);
  const resp: any = await request.get(url, {
    // @ts-ignore
    headers: { 'x-check-exist': true },
  });

  if (resp.exist) return Promise.reject(t('USERNAME_EXISTS'));
  return Promise.resolve();
}, 500);
