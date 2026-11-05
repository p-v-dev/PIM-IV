const TOKEN_KEY = 'eduquest-token';

export function getToken() {
  return sessionStorage.getItem(TOKEN_KEY);
}

export function logout() {
  sessionStorage.removeItem(TOKEN_KEY);
}

export async function getSession(token = getToken()) {
  if (!token) return null;

  const response = await fetch('/auth/me', {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  if (response.status === 401 || response.status === 403) {
    logout();
    return null;
  }
  if (!response.ok) throw new Error('Nao foi possivel verificar sua sessao. Tente novamente.');

  const user = await response.json();
  if (!user?.id || !['student', 'teacher'].includes(user.role)) {
    logout();
    return null;
  }
  return user;
}

export async function login(email, password, role) {
  logout();
  const response = await fetch('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email.trim(), password }),
  });
  if (response.status === 401) throw new Error('E-mail ou senha invalidos, ou conta desativada.');
  if (!response.ok) throw new Error('Nao foi possivel entrar. Confira os dados e tente novamente.');

  const { accessToken } = await response.json();
  if (typeof accessToken !== 'string' || !accessToken) throw new Error('Resposta de autenticacao invalida.');
  const user = await getSession(accessToken);
  if (!user) throw new Error('Acesso permitido somente para alunos e professores com conta ativa.');
  if (user.role !== role) throw new Error('Sua conta nao corresponde ao perfil selecionado.');

  // ponytail: sessao por aba; cookies HttpOnly exigiriam outro contrato de autenticacao.
  sessionStorage.setItem(TOKEN_KEY, accessToken);
  return user;
}
