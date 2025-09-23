const SERVER_API: string = import.meta.env.VITE_SERVER_API;

export type Customer = {
  id: number;
  name: string;
  email: string;
  password: string;
};

export function getPaged(page: number, limit: number = 10): Promise<{ data: Customer[]; total: number }> {
  return fetch(`${SERVER_API}?_page=${page}&_limit=${limit}`, {
    headers: { Accept: 'application/json' }
  })
    .then(res => {
      if (!res.ok) throw new Error("Failed to fetch paged customers");
      return Promise.all([res.json(), res.headers.get('X-Total-Count')]);
    })
    .then(([data, total]) => ({
      data,
      total: Number(total) || 0
    }));
}

// Get customer by id
export function get(id: number): Promise<Customer | null> {
  return fetch(`${SERVER_API}/${id}`)
    .then(res => {
      if (!res.ok) return null;
      return res.json();
    });
}

export function getLastCustomer(): Promise<Customer | null> {
  return fetch(`${SERVER_API}?_sort=id&_order=desc&_limit=1`, {
    headers: { Accept: 'application/json' }
  })
    .then(res => {
      if (!res.ok) throw new Error("Failed to fetch last customer");
      return res.json();
    })
    .then((data: Customer[]) => data.length > 0 ? data[0] : null);
}

// Delete customer by id
export function deleteById(id: number): Promise<void> {
  return fetch(`${SERVER_API}/${id}`, { method: "DELETE" })
    .then(res => {
      if (!res.ok) throw new Error("Failed to delete customer");
    });
}

// Add new customer
export function post(item: Omit<Customer, "id">): Promise<Customer> {
  return fetch(SERVER_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item),
  })
    .then(res => {
      if (!res.ok) throw new Error("Failed to add customer");
      return res.json();
    });
}

// Update customer
export function put(id: number, item: Customer): Promise<Customer> {
  return fetch(`${SERVER_API}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item),
  })
    .then(res => {
      if (!res.ok) throw new Error("Failed to update customer");
      return res.json();
    });
}