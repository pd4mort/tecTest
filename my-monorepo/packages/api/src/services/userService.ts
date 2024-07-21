import { User } from '../models/userModel';

const users: User[] = [{ id: '1', name: 'John Doe' }];

export function findUserById(id: string): User | undefined {
  return users.find(user => user.id === id);
}

export function createUser(user: User): void {
  users.push(user);
}
