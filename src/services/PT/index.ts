import { request } from 'umi';

const BASE_URL = '/api/personalTrainers';

/**
 * Lấy danh sách PT
 * @param params Tham số lọc
 */
export async function getPTs(params?: PT.QueryParams) {
  return request<PT.PersonalTrainer[]>(BASE_URL, {
    method: 'GET',
    params,
  });
}