import { randomBytes } from 'node:crypto';

export function generateRandomString(length: number) {
  if (length % 2 !== 0) {
    length++;
  }

  return randomBytes(length / 2).toString('hex');
}
