const authorizedFetch = async <Type>(url: RequestInfo, init?: RequestInit) => {
  const result = await fetch(url, init);
  if (result.status == 401) {
    await fetch("/api/user/token");
    return await fetch(url, init);
  }
  return result;
};

export const registerUser = async (email: string, password: string) => {
  const result = await fetch("/api/user/register", {
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
  const result = await fetch("/api/user/login", {
    method: "POST",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: email,
      password: password,
    }),
  }).then((response) => response.status);

  return result;
};

export const checkLoggedIn = async () => {
  const result = await authorizedFetch("/api/user/islogged").then(
    (response) => response.status
  );

  return result;
};

export const unauthorize = async () => {
  const result = await fetch("/api/user/unauthorize").then(
    (response) => response.status
  );

  return result;
};

export const terminateAllSessions = async () => {
  const result = await fetch("/api/user/terminatesessions").then(
    response => response.status
  );

  return result == 200;
}
