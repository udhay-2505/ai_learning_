// Text Similarity Utilities (for mock RAG)

/**
 * Simple word-based Jaccard similarity
 */
export function jaccardSimilarity(text1: string, text2: string): number {
    const words1 = new Set(text1.toLowerCase().split(/\s+/).filter(w => w.length > 2));
    const words2 = new Set(text2.toLowerCase().split(/\s+/).filter(w => w.length > 2));

    let intersection = 0;
    for (const word of words1) {
        if (words2.has(word)) {
            intersection++;
        }
    }

    const union = words1.size + words2.size - intersection;
    return union > 0 ? intersection / union : 0;
}

/**
 * Cosine similarity using term frequency
 */
export function cosineSimilarity(text1: string, text2: string): number {
    const tf1 = getTermFrequency(text1);
    const tf2 = getTermFrequency(text2);

    const allTerms = new Set([...Object.keys(tf1), ...Object.keys(tf2)]);

    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;

    for (const term of allTerms) {
        const v1 = tf1[term] ?? 0;
        const v2 = tf2[term] ?? 0;
        dotProduct += v1 * v2;
        norm1 += v1 * v1;
        norm2 += v2 * v2;
    }

    const denominator = Math.sqrt(norm1) * Math.sqrt(norm2);
    return denominator > 0 ? dotProduct / denominator : 0;
}

function getTermFrequency(text: string): Record<string, number> {
    const words = text.toLowerCase().split(/\s+/).filter(w => w.length > 2);
    const freq: Record<string, number> = {};

    for (const word of words) {
        freq[word] = (freq[word] ?? 0) + 1;
    }

    return freq;
}

/**
 * Combined similarity score
 */
export function combinedSimilarity(text1: string, text2: string): number {
    const jaccard = jaccardSimilarity(text1, text2);
    const cosine = cosineSimilarity(text1, text2);
    return (jaccard + cosine) / 2;
}
