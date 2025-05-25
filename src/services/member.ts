export async function queryMembers(gymId?: string) {
  const url = gymId ? `/api/members?gymId=${gymId}` : '/api/members';
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch members');
  return response.json();
}
