const SERVER_API: string = import.meta.env.VITE_SERVER_API;

export type Customer = {
  id: number;
  name: string;
  email: string;
  password: string;
};

// Get all customers
export function getAll(): Promise<Customer[]> {
  return fetch(SERVER_API)
    .then(res => {
      if (!res.ok) throw new Error("Failed to fetch customers");
      return res.json();
    });
}

// Get customer by id
export function get(id: number): Promise<Customer | null> {
  return fetch(`${SERVER_API}/${id}`)
    .then(res => {
      if (!res.ok) return null;
      return res.json();
    });
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