const API = "/api/users";

export const getUsers = async () => {
  const res = await fetch("/api/users", {
    cache: "no-store", // 👈 disable caching temporarily
  });

  const data = await res.json();
  console.log("DATA:", data);

  return data;
};

export const createUser = async (data) => {
  const res = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};