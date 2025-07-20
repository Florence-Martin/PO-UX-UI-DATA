// Jest setup file for Firebase mocking
import { jest } from "@jest/globals";

// Global Firebase mock setup
const mockCollection = jest.fn();
const mockDoc = jest.fn();
const mockGetDocs = jest.fn();
const mockGetDoc = jest.fn();
const mockAddDoc = jest.fn();
const mockSetDoc = jest.fn();
const mockUpdateDoc = jest.fn();
const mockDeleteDoc = jest.fn();
const mockServerTimestamp = jest.fn();

// Mock Firebase functions
jest.mock("firebase/firestore", () => ({
  collection: mockCollection,
  doc: mockDoc,
  getDocs: mockGetDocs,
  getDoc: mockGetDoc,
  addDoc: mockAddDoc,
  setDoc: mockSetDoc,
  updateDoc: mockUpdateDoc,
  deleteDoc: mockDeleteDoc,
  serverTimestamp: mockServerTimestamp,
  onSnapshot: jest.fn(),
  Timestamp: {
    now: () => ({ toDate: () => new Date() }),
    fromDate: (date: Date) => ({ toDate: () => date }),
  },
}));

// Mock Firebase app
jest.mock("../lib/firebase", () => ({
  db: {
    collection: mockCollection,
    doc: mockDoc,
  },
}));

// Export mocks for test files
export {
  mockAddDoc,
  mockCollection,
  mockDeleteDoc,
  mockDoc,
  mockGetDoc,
  mockGetDocs,
  mockServerTimestamp,
  mockSetDoc,
  mockUpdateDoc,
};
