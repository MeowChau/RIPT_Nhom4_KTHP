export async function queryPTs() {
  const res = await fetch('/api/personalTrainers');
  if (!res.ok) throw new Error('Failed to fetch personal trainers');
  return res.json();
}

export async function getPTById(id: string) {
  const res = await fetch(`/api/personalTrainers/${id}`);
  if (!res.ok) throw new Error('Failed to fetch personal trainer');
  return res.json();
}

export async function createPT(payload: any) {
  const res = await fetch('/api/personalTrainers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to create personal trainer');
  return res.json();
}

export async function updatePT(id: string, payload: any) {
  const res = await fetch(`/api/personalTrainers/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to update personal trainer');
  return res.json();
}

// Thêm hàm deletePT để xóa PT
export async function deletePT(id: string) {
  const res = await fetch(`/api/personalTrainers/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete personal trainer');
  return res.json();
}
