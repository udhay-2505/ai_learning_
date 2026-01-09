// Ecosystem Curator Agent (RAG-backed, Scheduled)
// Weekly ingestion and relevance filtering of AI updates

import { useLearnerStore } from '../store/learnerStore';
import { useCurriculumStore } from '../store/curriculumStore';
import { emit } from '../services/eventBus';
import { scheduleRecurring, WEEKLY_INTERVAL, cancelTask } from '../services/scheduler';
import { queryKnowledgeBase, ecosystemKB, getHighImpactUpdates } from '../rag';
import { saveSetting, loadSetting } from '../services/persistence';

interface EcosystemUpdate {
    id: string;
    content: string;
    source: string;
    impact: 'high' | 'medium' | 'low';
    relevantToLearner: boolean;
    date: string;
}

interface EcosystemState {
    updates: EcosystemUpdate[];
    lastFetchDate: string | null;
}

const TASK_ID = 'ecosystem-curator';
const STATE_KEY = 'ecosystem-state';

async function getState(): Promise<EcosystemState> {
    const saved = await loadSetting<EcosystemState>(STATE_KEY);
    return saved ?? { updates: [], lastFetchDate: null };
}

async function saveState(state: EcosystemState): Promise<void> {
    await saveSetting(STATE_KEY, state);
}

export const ecosystemCuratorAgent = {
    name: 'EcosystemCuratorAgent',

    async initialize(): Promise<void> {
        // Schedule weekly updates (for demo: run more frequently)
        scheduleRecurring(TASK_ID, async () => {
            await this.fetchUpdates();
        }, WEEKLY_INTERVAL);
        console.log('[EcosystemCurator] Scheduled weekly updates');
    },

    async fetchUpdates(): Promise<EcosystemUpdate[]> {
        console.log('[EcosystemCurator] Fetching ecosystem updates...');

        const profile = useLearnerStore.getState().profile;
        const curriculum = useCurriculumStore.getState().curriculum;

        if (!curriculum) {
            console.log('[EcosystemCurator] No curriculum, skipping');
            return [];
        }

        // Get current module IDs for relevance filtering
        const currentModules = curriculum.modules
            .filter(m => m.unlocked)
            .map(m => m.id);

        // Query RAG for relevant updates
        const queryString = currentModules.join(' ') + ' ' + profile.motivation;
        const ragResult = queryKnowledgeBase(ecosystemKB, {
            query: queryString,
            topK: 5,
        });

        // Also get high-impact updates regardless of query match
        const highImpact = getHighImpactUpdates();

        // Merge and dedupe
        const allChunkIds = new Set<string>();
        const allChunks = [...ragResult.chunks];

        for (const chunk of ragResult.chunks) {
            allChunkIds.add(chunk.id);
        }

        for (const chunk of highImpact) {
            if (!allChunkIds.has(chunk.id)) {
                allChunks.push({
                    id: chunk.id,
                    content: chunk.content,
                    source: chunk.source,
                    score: 0.5, // Default score for high-impact
                });
            }
        }

        // Transform to EcosystemUpdate format
        const updates: EcosystemUpdate[] = allChunks.slice(0, 3).map(chunk => {
            const original = ecosystemKB.chunks.find(c => c.id === chunk.id);
            return {
                id: chunk.id,
                content: chunk.content,
                source: chunk.source,
                impact: (original?.metadata.impact as 'high' | 'medium' | 'low') ?? 'medium',
                relevantToLearner: chunk.score > 0.3,
                date: (original?.metadata.date as string) ?? new Date().toISOString(),
            };
        });

        // Save state
        await saveState({
            updates,
            lastFetchDate: new Date().toISOString(),
        });

        // Emit event if there are relevant updates
        if (updates.some(u => u.relevantToLearner)) {
            await emit({
                type: 'ecosystem_update',
                payload: {
                    updates: updates.map(u => u.content),
                    relevantToRoadmap: true,
                }
            });
        }

        console.log(`[EcosystemCurator] Fetched ${updates.length} updates`);
        return updates;
    },

    async getLatestUpdates(): Promise<EcosystemUpdate[]> {
        const state = await getState();
        return state.updates;
    },

    async getRelevantUpdates(): Promise<EcosystemUpdate[]> {
        const state = await getState();
        return state.updates.filter(u => u.relevantToLearner);
    },

    stop(): void {
        cancelTask(TASK_ID);
        console.log('[EcosystemCurator] Stopped');
    }
};
