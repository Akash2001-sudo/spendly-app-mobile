type SessionUser = {
  token: string;
};

let currentUser: SessionUser | null = null;

export const setSessionUser = (user: SessionUser | null) => {
  currentUser = user;
};

export const getSessionToken = () => currentUser?.token ?? null;
