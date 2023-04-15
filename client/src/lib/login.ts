export const registerUser = async (email: string, password: string) => {
  const result = await fetch("/api/register", {
    method: "POST",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  }).then((response) => response.status);

  return result;
};

export const loginUser = async (email: string, password: string) => {
  const result = await fetch("/api/login", {
    method: "POST",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  }).then((response) => response.status);

  return result;
};

export const checkLoggedIn = async () => {
  const result = await fetch("/api/islogged").then(
    (response) => response.status
  );

  return result;
};

export const unauthorize = async () => {
  const result = await fetch("/api/unauthorize").then(
    (response) => response.status
  );

  return result;
};
