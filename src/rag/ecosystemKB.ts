// Ecosystem Updates Knowledge Base
// Weekly AI news and updates filtered by learner relevance

import type { KnowledgeBase, RAGChunk } from './ragEngine';

const ECOSYSTEM_CHUNKS: RAGChunk[] = [
    {
        id: 'update-1',
        content: 'GPT-5 released with improved reasoning capabilities and 256K context window. Benchmarks show 40% improvement on complex reasoning tasks. API pricing unchanged. Developers should update prompts to leverage new capabilities.',
        source: 'AI Weekly Digest',
        metadata: { date: '2024-12-20', relevantModules: ['llm-transformers'], impact: 'high' }
    },
    {
        id: 'update-2',
        content: 'New open-source embedding model outperforms OpenAI ada-002 on retrieval benchmarks. E5-Mistral-7B achieves state-of-the-art on MTEB while running locally. Significant for RAG applications.',
        source: 'ML Research Updates',
        metadata: { date: '2024-12-18', relevantModules: ['llm-transformers', 'applied-ai'], impact: 'medium' }
    },
    {
        id: 'update-3',
        content: 'PyTorch 2.3 released with improved compilation and memory efficiency. torch.compile now supports more operations out of the box. Up to 2x speedup on transformer training workloads.',
        source: 'Framework Updates',
        metadata: { date: '2024-12-15', relevantModules: ['deep-learning'], impact: 'medium' }
    },
    {
        id: 'update-4',
        content: 'Anthropic introduces Claude 3.5 Sonnet with vision capabilities and improved code generation. Outperforms GPT-4 on code benchmarks. Available through API with competitive pricing.',
        source: 'AI Industry News',
        metadata: { date: '2024-12-12', relevantModules: ['llm-transformers', 'applied-ai'], impact: 'high' }
    },
    {
        id: 'update-5',
        content: 'Research breakthrough: Chain-of-Draft prompting reduces LLM costs by 90% while maintaining accuracy. Progressive detail refinement allows using smaller models for initial passes.',
        source: 'ML Research Updates',
        metadata: { date: '2024-12-10', relevantModules: ['llm-transformers'], impact: 'medium' }
    },
    {
        id: 'update-6',
        content: 'EU AI Act enforcement begins. High-risk AI systems now require conformity assessments. Affects hiring algorithms, credit scoring, and biometric systems. US companies with EU customers must comply.',
        source: 'AI Regulation Tracker',
        metadata: { date: '2024-12-08', relevantModules: ['applied-ai'], impact: 'high' }
    },
    {
        id: 'update-7',
        content: 'New multimodal model handles text, images, audio, and video in single architecture. Gemini Ultra successor shows emergent cross-modal reasoning. Available in limited preview.',
        source: 'AI Weekly Digest',
        metadata: { date: '2024-12-05', relevantModules: ['deep-learning', 'llm-transformers'], impact: 'low' }
    },
    {
        id: 'update-8',
        content: 'LangChain v0.3 released with simplified agent API and improved streaming. Breaking changes from v0.2 require migration. New debugging tools help trace agent decisions.',
        source: 'Framework Updates',
        metadata: { date: '2024-12-01', relevantModules: ['applied-ai'], impact: 'medium' }
    }
];

export const ecosystemKB: KnowledgeBase = {
    name: 'AI Ecosystem Updates',
    chunks: ECOSYSTEM_CHUNKS
};

// Get updates relevant to specific modules
export function getUpdatesByModules(moduleIds: string[]): RAGChunk[] {
    return ECOSYSTEM_CHUNKS.filter(chunk => {
        const relevantModules = chunk.metadata.relevantModules as string[];
        return moduleIds.some(m => relevantModules.includes(m));
    });
}

// Get high-impact updates only
export function getHighImpactUpdates(): RAGChunk[] {
    return ECOSYSTEM_CHUNKS.filter(c => c.metadata.impact === 'high');
}

// Get updates from last N days
export function getRecentUpdates(days: number): RAGChunk[] {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);

    return ECOSYSTEM_CHUNKS.filter(chunk => {
        const updateDate = new Date(chunk.metadata.date as string);
        return updateDate >= cutoff;
    });
}
