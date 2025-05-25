export async function queryPayments() {
  const res = await fetch('/api/payments');
  if (!res.ok) throw new Error('Failed to fetch payments');
  return res.json();
}

export async function getPaymentById(id: string) {
  const res = await fetch(`/api/payments/${id}`);
  if (!res.ok) throw new Error('Failed to fetch payment');
  return res.json();
}

export async function createPayment(payload: any) {
  const res = await fetch('/api/payments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to create payment');
  return res.json();
}

export async function updatePayment(id: string, payload: any) {
  const res = await fetch(`/api/payments/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to update payment');
  return res.json();
}
