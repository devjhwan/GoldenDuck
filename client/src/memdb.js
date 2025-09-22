const SERVER_API = process.env.SERVER_API;

//
// Customer type for reference:
// {
//   id: number,
//   name: string,
//   email: string,
//   password: string
// }
//

// Get all customers
function getAll() {
  return fetch(SERVER_API)
    .then(res => {
      if (!res.ok) throw new Error("Failed to fetch customers");
      return res.json();
    });
}

// Get customer by id
function get(id) {
  return fetch(`${SERVER_API}/${id}`)
    .then(res => {
      if (!res.ok) return null;
      return res.json();
    });
}

// Delete customer by id
function deleteById(id) {
  return fetch(`${SERVER_API}/${id}`, { method: "DELETE" })
    .then(res => {
      if (!res.ok) throw new Error("Failed to delete customer");
    });
}

// Add new customer
function post(item) {
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
function put(id, item) {
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

// Export functions for use in other files
module.exports = {
  getAll,
  get,
  deleteById,
  post,
  put
};