// RAG Engine - Core Query Interface
// Mock implementation with similarity scoring

export interface RAGChunk {
    id: string;
    content: string;
    source: string;
    metadata: Record<string, unknown>;
    embedding?: number[]; // Optional for mock
}

export interface RAGQuery {
    query: string;
    filters?: Record<string, unknown>;
    topK?: number;
}

export interface RAGResult {
    chunks: Array<{
        content: string;
        score: number;
        source: string;
        id: string;
    }>;
}

export interface KnowledgeBase {
    name: string;
    chunks: RAGChunk[];
}

// Simple text similarity (Jaccard-like for mock purposes)
function calculateSimilarity(query: string, content: string): number {
    const queryWords = new Set(query.toLowerCase().split(/\s+/));
    const contentWords = new Set(content.toLowerCase().split(/\s+/));

    let intersection = 0;
    for (const word of queryWords) {
        if (contentWords.has(word)) {
            intersection++;
        }
    }

    const union = queryWords.size + contentWords.size - intersection;
    return union > 0 ? intersection / union : 0;
}

// Query a knowledge base
export function queryKnowledgeBase(
    kb: KnowledgeBase,
    query: RAGQuery
): RAGResult {
    const topK = query.topK ?? 5;

    // Score all chunks
    const scored = kb.chunks.map((chunk) => ({
        content: chunk.content,
        score: calculateSimilarity(query.query, chunk.content),
        source: chunk.source,
        id: chunk.id,
        metadata: chunk.metadata,
    }));

    // Apply filters if provided
    let filtered = scored;
    if (query.filters) {
        filtered = scored.filter((chunk) => {
            const chunkMeta = kb.chunks.find((c) => c.id === chunk.id)?.metadata ?? {};
            return Object.entries(query.filters!).every(
                ([key, value]) => chunkMeta[key] === value
            );
        });
    }

    // Sort by score and take top K
    const topChunks = filtered
        .sort((a, b) => b.score - a.score)
        .slice(0, topK);

    return { chunks: topChunks };
}

// Compress chunks into a coherent summary (≤120 words for micro lessons)
export function compressChunks(
    chunks: RAGResult['chunks'],
    maxWords: number = 120
): string {
    if (chunks.length === 0) return '';

    // Take highest scored chunk and trim to word limit
    const bestChunk = chunks[0];
    const words = bestChunk.content.split(/\s+/);

    if (words.length <= maxWords) {
        return bestChunk.content;
    }

    return words.slice(0, maxWords).join(' ') + '...';
}

// Format source attribution
export function formatSources(chunks: RAGResult['chunks']): string {
    const uniqueSources = [...new Set(chunks.map((c) => c.source))];
    return uniqueSources.join(', ');
}
