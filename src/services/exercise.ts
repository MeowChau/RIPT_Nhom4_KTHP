import { request } from 'umi';

export async function queryExercises(params?: Record<string, any>) {
  return request('/api/exercises', {
    params,
  });
}

export async function getExercise(id: string) {
  return request(`/api/exercises/${id}`);
}

export async function addExercise(data: Record<string, any>) {
  return request('/api/exercises', {
    method: 'POST',
    data,
  });
}

export async function updateExercise(id: string, data: Record<string, any>) {
  return request(`/api/exercises/${id}`, {
    method: 'PUT',
    data,
  });
}

export async function removeExercise(id: string) {
  return request(`/api/exercises/${id}`, {
    method: 'DELETE',
  });
}