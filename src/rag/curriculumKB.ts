// Curriculum Knowledge Base
// Mock data for AI learning curriculum generation

import type { KnowledgeBase, RAGChunk } from './ragEngine';

const CURRICULUM_CHUNKS: RAGChunk[] = [
    // AI Fundamentals Module
    {
        id: 'curr-1',
        content: 'AI Fundamentals introduces core concepts of artificial intelligence including machine learning paradigms, neural network basics, and the distinction between narrow AI and general AI. Essential foundation for all AI learning paths.',
        source: 'AI Learning Roadmap Guide',
        metadata: { module: 'fundamentals', difficulty: 'beginner', persona: ['student', 'founder', 'early-career', 'developer'] }
    },
    {
        id: 'curr-2',
        content: 'Understanding supervised learning: labeled data, training process, loss functions, and model evaluation. Key algorithms include linear regression, logistic regression, and decision trees.',
        source: 'ML Foundations Textbook',
        metadata: { module: 'fundamentals', topic: 'supervised-learning', difficulty: 'beginner', persona: ['student', 'developer'] }
    },
    {
        id: 'curr-3',
        content: 'Unsupervised learning finds patterns in unlabeled data. Clustering algorithms like K-means and hierarchical clustering. Dimensionality reduction with PCA. Applications in customer segmentation and anomaly detection.',
        source: 'ML Foundations Textbook',
        metadata: { module: 'fundamentals', topic: 'unsupervised-learning', difficulty: 'beginner', persona: ['student', 'developer'] }
    },

    // Machine Learning Module
    {
        id: 'curr-4',
        content: 'Deep dive into neural networks: perceptrons, activation functions, backpropagation, and gradient descent optimization. Understanding how networks learn from data through weight updates.',
        source: 'Deep Learning Essentials',
        metadata: { module: 'machine-learning', topic: 'neural-networks', difficulty: 'intermediate', persona: ['developer', 'student'] }
    },
    {
        id: 'curr-5',
        content: 'Model evaluation and validation: train-test splits, cross-validation, bias-variance tradeoff. Metrics for classification (precision, recall, F1) and regression (MSE, MAE, R²).',
        source: 'ML Engineering Best Practices',
        metadata: { module: 'machine-learning', topic: 'evaluation', difficulty: 'intermediate', persona: ['developer', 'early-career'] }
    },
    {
        id: 'curr-6',
        content: 'Feature engineering transforms raw data into meaningful inputs. Techniques include normalization, encoding categorical variables, handling missing data, and creating interaction features.',
        source: 'Data Science Handbook',
        metadata: { module: 'machine-learning', topic: 'feature-engineering', difficulty: 'intermediate', persona: ['developer', 'early-career'] }
    },

    // Deep Learning Module
    {
        id: 'curr-7',
        content: 'Convolutional Neural Networks (CNNs) excel at image tasks. Architecture components: convolutional layers, pooling, and fully connected layers. Applications in computer vision, image classification, object detection.',
        source: 'Computer Vision with Deep Learning',
        metadata: { module: 'deep-learning', topic: 'cnn', difficulty: 'intermediate', persona: ['developer', 'student'] }
    },
    {
        id: 'curr-8',
        content: 'Recurrent Neural Networks (RNNs) process sequential data. LSTM and GRU architectures address vanishing gradients. Applications in time series, natural language processing, and speech recognition.',
        source: 'Sequential Deep Learning',
        metadata: { module: 'deep-learning', topic: 'rnn', difficulty: 'intermediate', persona: ['developer', 'student'] }
    },

    // LLMs & Transformers Module
    {
        id: 'curr-9',
        content: 'Transformer architecture revolutionized NLP. Self-attention mechanism enables parallel processing and long-range dependencies. Key concepts: queries, keys, values, multi-head attention, positional encoding.',
        source: 'Attention Is All You Need - Explained',
        metadata: { module: 'llm-transformers', topic: 'transformer-basics', difficulty: 'advanced', persona: ['developer', 'student'] }
    },
    {
        id: 'curr-10',
        content: 'Large Language Models (LLMs) like GPT, Claude, and LLaMA. Pre-training on massive text corpora, fine-tuning for specific tasks. Emergent capabilities and scaling laws.',
        source: 'LLM Engineering Guide',
        metadata: { module: 'llm-transformers', topic: 'llm-fundamentals', difficulty: 'advanced', persona: ['developer', 'founder', 'early-career'] }
    },
    {
        id: 'curr-11',
        content: 'Prompt engineering: crafting effective prompts for LLMs. Techniques include zero-shot, few-shot, chain-of-thought prompting. System prompts, temperature, and other parameters.',
        source: 'Prompt Engineering Guide',
        metadata: { module: 'llm-transformers', topic: 'prompt-engineering', difficulty: 'intermediate', persona: ['founder', 'developer', 'early-career'] }
    },
    {
        id: 'curr-12',
        content: 'Retrieval Augmented Generation (RAG) combines LLMs with external knowledge. Vector databases, embeddings, chunking strategies. Reduces hallucinations and enables domain-specific applications.',
        source: 'RAG System Design',
        metadata: { module: 'llm-transformers', topic: 'rag', difficulty: 'advanced', persona: ['developer', 'founder'] }
    },

    // Applied AI Module
    {
        id: 'curr-13',
        content: 'Building AI applications: API integration, model deployment, latency optimization. Production considerations: rate limiting, caching, error handling, cost management.',
        source: 'AI Application Development',
        metadata: { module: 'applied-ai', topic: 'building-apps', difficulty: 'intermediate', persona: ['developer', 'founder'] }
    },
    {
        id: 'curr-14',
        content: 'AI agents: autonomous systems that perceive, decide, and act. Agent architectures, tool use, memory systems. Frameworks like LangChain and AutoGPT.',
        source: 'AI Agent Design Patterns',
        metadata: { module: 'applied-ai', topic: 'ai-agents', difficulty: 'advanced', persona: ['developer', 'founder'] }
    },
    {
        id: 'curr-15',
        content: 'AI ethics and safety: bias in training data, fairness metrics, transparency requirements. Responsible AI development practices and governance frameworks.',
        source: 'Responsible AI Handbook',
        metadata: { module: 'applied-ai', topic: 'ethics-safety', difficulty: 'intermediate', persona: ['founder', 'early-career', 'student'] }
    }
];

export const curriculumKB: KnowledgeBase = {
    name: 'Curriculum Knowledge Base',
    chunks: CURRICULUM_CHUNKS
};

// Helper to get chunks by module
export function getChunksByModule(moduleId: string): RAGChunk[] {
    return CURRICULUM_CHUNKS.filter(c => c.metadata.module === moduleId);
}

// Helper to get modules list
export function getAvailableModules(): string[] {
    const modules = new Set(CURRICULUM_CHUNKS.map(c => c.metadata.module as string));
    return Array.from(modules);
}
