import { openDB } from 'idb';
import type { QuizAttempt, User } from '../types';

const DB_NAME = 'quiz-app-db';
const DB_VERSION = 1;

export async function initDB() {
  const db = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('users')) {
        db.createObjectStore('users', { keyPath: 'userId' });
      }
      if (!db.objectStoreNames.contains('attempts')) {
        db.createObjectStore('attempts', { keyPath: 'id' });
      }
    },
  });
  return db;
}

export async function saveUser(user: User) {
  const db = await initDB();
  await db.put('users', user);
}

export async function getUser(userId: string) {
  const db = await initDB();
  return db.get('users', userId);
}

export async function saveAttempt(attempt: QuizAttempt) {
  const db = await initDB();
  await db.put('attempts', attempt);
}

export async function getAttempts(userId: string) {
  const db = await initDB();
  const attempts = await db.getAll('attempts');
  return attempts.filter((attempt) => attempt.userId === userId);
}