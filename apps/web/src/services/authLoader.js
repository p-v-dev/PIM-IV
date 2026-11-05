import { redirect } from 'react-router';
import { getSession } from './authService.js';

export function requireUser(role) {
  return async () => {
    const user = await getSession();
    if (!user) throw redirect('/login');
    if (role && user.role !== role) throw redirect('/');
    return user;
  };
}
