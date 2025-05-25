export async function queryGyms() {
  const response = await fetch('/api/gyms');
  if (!response.ok) throw new Error('Failed to fetch gyms');
  return response.json();
}
