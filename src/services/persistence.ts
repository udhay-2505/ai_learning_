// IndexedDB Persistence Service
// Handles all persistent storage for learner profile and curriculum

import { openDB } from 'idb';
import type { DBSchema, IDBPDatabase } from 'idb';
import type { LearnerProfile } from '../types/learner';
import type { Curriculum } from '../types/curriculum';

interface LearnifyDB extends DBSchema {
    learnerProfile: {
        key: string;
        value: LearnerProfile;
    };
    curriculum: {
        key: string;
        value: Curriculum;
    };
    settings: {
        key: string;
        value: unknown;
    };
}

const DB_NAME = 'learnify-db';
const DB_VERSION = 1;

let dbInstance: IDBPDatabase<LearnifyDB> | null = null;

async function getDB(): Promise<IDBPDatabase<LearnifyDB>> {
    if (dbInstance) return dbInstance;

    dbInstance = await openDB<LearnifyDB>(DB_NAME, DB_VERSION, {
        upgrade(db) {
            // Create stores if they don't exist
            if (!db.objectStoreNames.contains('learnerProfile')) {
                db.createObjectStore('learnerProfile');
            }
            if (!db.objectStoreNames.contains('curriculum')) {
                db.createObjectStore('curriculum');
            }
            if (!db.objectStoreNames.contains('settings')) {
                db.createObjectStore('settings');
            }
        },
    });

    return dbInstance;
}

// Learner Profile Operations
export async function saveLearnerProfile(profile: LearnerProfile): Promise<void> {
    const db = await getDB();
    await db.put('learnerProfile', profile, 'current');
}

export async function loadLearnerProfile(): Promise<LearnerProfile | null> {
    const db = await getDB();
    const profile = await db.get('learnerProfile', 'current');
    return profile ?? null;
}

export async function clearLearnerProfile(): Promise<void> {
    const db = await getDB();
    await db.delete('learnerProfile', 'current');
}

// Curriculum Operations
export async function saveCurriculum(curriculum: Curriculum): Promise<void> {
    const db = await getDB();
    await db.put('curriculum', curriculum, 'current');
}

export async function loadCurriculum(): Promise<Curriculum | null> {
    const db = await getDB();
    const curriculum = await db.get('curriculum', 'current');
    return curriculum ?? null;
}

export async function clearCurriculum(): Promise<void> {
    const db = await getDB();
    await db.delete('curriculum', 'current');
}

// Settings Operations
export async function saveSetting(key: string, value: unknown): Promise<void> {
    const db = await getDB();
    await db.put('settings', value, key);
}

export async function loadSetting<T>(key: string): Promise<T | null> {
    const db = await getDB();
    const value = await db.get('settings', key);
    return (value as T) ?? null;
}

// Full Reset (for testing)
export async function clearAllData(): Promise<void> {
    const db = await getDB();
    await db.clear('learnerProfile');
    await db.clear('curriculum');
    await db.clear('settings');
}
