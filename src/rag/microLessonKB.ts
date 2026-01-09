// Micro-Lesson Knowledge Base
// ≤120 word lessons for daily learning sessions

import type { KnowledgeBase, RAGChunk } from './ragEngine';

const MICRO_LESSON_CHUNKS: RAGChunk[] = [
    // AI Fundamentals Lessons
    {
        id: 'lesson-1',
        content: 'Machine learning is a subset of AI where systems learn from data rather than being explicitly programmed. Instead of writing rules, you provide examples. The algorithm finds patterns and makes predictions. Three main types exist: supervised (labeled data), unsupervised (find hidden patterns), and reinforcement (learn through trial and error). Today, ML powers recommendations, speech recognition, and autonomous vehicles.',
        source: 'ML Fundamentals Course',
        metadata: { topic: 'ml-intro', module: 'fundamentals', difficulty: 1 }
    },
    {
        id: 'lesson-2',
        content: 'Neural networks mimic the brain\'s structure. Neurons receive inputs, apply weights, sum them, and pass through an activation function. Multiple layers create "deep" networks. The input layer receives data, hidden layers extract features, and the output layer produces predictions. Training adjusts weights using backpropagation—calculating errors and updating backwards through the network.',
        source: 'Neural Network Basics',
        metadata: { topic: 'neural-networks', module: 'fundamentals', difficulty: 2 }
    },
    {
        id: 'lesson-3',
        content: 'Supervised learning uses labeled examples to train models. Each input has a corresponding correct output. Classification predicts categories (spam/not spam), regression predicts numbers (house prices). The model learns by minimizing the difference between predictions and actual labels—this difference is called the loss. Common algorithms: linear regression, decision trees, random forests.',
        source: 'Supervised Learning Guide',
        metadata: { topic: 'supervised-learning', module: 'fundamentals', difficulty: 1 }
    },
    {
        id: 'lesson-4',
        content: 'Unsupervised learning finds patterns without labels. Clustering groups similar data points—K-means finds K cluster centers and assigns points to nearest center. Dimensionality reduction simplifies data while preserving structure—PCA finds principal components capturing maximum variance. Applications: customer segmentation, anomaly detection, data visualization.',
        source: 'Unsupervised Learning Essentials',
        metadata: { topic: 'unsupervised-learning', module: 'fundamentals', difficulty: 2 }
    },

    // Machine Learning Lessons
    {
        id: 'lesson-5',
        content: 'Overfitting occurs when a model memorizes training data instead of learning general patterns. It performs well on training data but poorly on new data. Signs: high training accuracy, low test accuracy. Solutions: more training data, simpler models, regularization (penalizing complexity), dropout (randomly disabling neurons), early stopping.',
        source: 'ML Best Practices',
        metadata: { topic: 'evaluation', module: 'machine-learning', difficulty: 2 }
    },
    {
        id: 'lesson-6',
        content: 'Feature engineering transforms raw data into model inputs. Numerical features may need scaling (0-1 range) or standardization (zero mean). Categorical features require encoding: one-hot creates binary columns, label encoding assigns numbers. Missing values can be imputed with mean, median, or predicted values. Good features dramatically improve model performance.',
        source: 'Feature Engineering Handbook',
        metadata: { topic: 'feature-engineering', module: 'machine-learning', difficulty: 2 }
    },
    {
        id: 'lesson-7',
        content: 'Cross-validation provides robust model evaluation. Instead of one train-test split, data is divided into K folds. The model trains on K-1 folds and validates on the remaining one, rotating through all folds. Final performance is the average across folds. This reduces variance in evaluation and detects overfitting more reliably than a single split.',
        source: 'Model Evaluation Techniques',
        metadata: { topic: 'evaluation', module: 'machine-learning', difficulty: 2 }
    },

    // Deep Learning Lessons
    {
        id: 'lesson-8',
        content: 'Convolutional Neural Networks (CNNs) excel at image tasks. Convolutional layers apply filters that detect features—edges, textures, shapes. Pooling layers reduce dimensions while keeping important information. Deeper layers detect increasingly complex patterns. A CNN might learn: edges → textures → parts → objects. This hierarchy mirrors human visual processing.',
        source: 'CNN Architecture Guide',
        metadata: { topic: 'cnn', module: 'deep-learning', difficulty: 3 }
    },
    {
        id: 'lesson-9',
        content: 'Recurrent Neural Networks (RNNs) handle sequential data by maintaining hidden state—memory of previous inputs. Each step combines new input with previous state. However, standard RNNs struggle with long sequences due to vanishing gradients. LSTM (Long Short-Term Memory) solves this with gates controlling information flow: forget, input, and output gates.',
        source: 'Sequence Models Explained',
        metadata: { topic: 'rnn', module: 'deep-learning', difficulty: 3 }
    },
    {
        id: 'lesson-10',
        content: 'Gradient descent optimizes neural networks by iteratively adjusting weights to minimize loss. The gradient points toward steepest increase—we move opposite. Learning rate controls step size: too large causes overshooting, too small means slow convergence. Variants like Adam adapt learning rates per parameter and use momentum to escape local minima.',
        source: 'Optimization in Deep Learning',
        metadata: { topic: 'optimization', module: 'deep-learning', difficulty: 3 }
    },

    // LLM & Transformers Lessons
    {
        id: 'lesson-11',
        content: 'Transformers process entire sequences simultaneously using self-attention. Each token attends to all others, weighing their relevance. Unlike RNNs, no sequential processing bottleneck exists. The attention formula: Attention(Q,K,V) = softmax(QK^T/√d)V. Queries ask "what am I looking for?", keys answer "what do I contain?", values provide the actual content.',
        source: 'Transformer Architecture Deep Dive',
        metadata: { topic: 'transformer-basics', module: 'llm-transformers', difficulty: 4 }
    },
    {
        id: 'lesson-12',
        content: 'Large Language Models predict the next token given context. Pre-trained on billions of text tokens, they learn grammar, facts, and reasoning patterns. Fine-tuning adapts them to specific tasks with smaller datasets. Instruction tuning teaches following commands. RLHF (Reinforcement Learning from Human Feedback) aligns outputs with human preferences.',
        source: 'LLM Training Pipeline',
        metadata: { topic: 'llm-fundamentals', module: 'llm-transformers', difficulty: 4 }
    },
    {
        id: 'lesson-13',
        content: 'Prompt engineering crafts inputs that elicit desired LLM outputs. Zero-shot: ask directly. Few-shot: provide examples first. Chain-of-thought: request step-by-step reasoning. System prompts set behavior guidelines. Temperature controls randomness: 0 is deterministic, higher values increase creativity. Effective prompts are specific, provide context, and define expected format.',
        source: 'Prompt Engineering Masterclass',
        metadata: { topic: 'prompt-engineering', module: 'llm-transformers', difficulty: 3 }
    },
    {
        id: 'lesson-14',
        content: 'RAG (Retrieval Augmented Generation) grounds LLMs in external knowledge. Documents are chunked, embedded into vectors, and stored in a vector database. At query time, relevant chunks are retrieved and added to the prompt. This reduces hallucinations, enables current information, and allows domain-specific knowledge without fine-tuning.',
        source: 'Building RAG Systems',
        metadata: { topic: 'rag', module: 'llm-transformers', difficulty: 4 }
    },

    // Applied AI Lessons
    {
        id: 'lesson-15',
        content: 'AI APIs enable rapid prototyping without training models. OpenAI, Anthropic, and Google provide hosted LLMs via REST APIs. Key considerations: rate limits, token costs, latency requirements. Best practices: implement caching for repeated queries, handle errors gracefully, use streaming for long responses, set appropriate timeouts.',
        source: 'AI API Integration Guide',
        metadata: { topic: 'building-apps', module: 'applied-ai', difficulty: 3 }
    },
    {
        id: 'lesson-16',
        content: 'AI agents are autonomous systems combining LLMs with tools. The ReAct pattern: Reason about next action, Act by calling tools, Observe results, repeat. Tools can be APIs, databases, code execution. Memory stores conversation history and learned facts. Planning decomposes complex goals into steps. Agents can research, code, browse, and complete multi-step tasks.',
        source: 'AI Agent Fundamentals',
        metadata: { topic: 'ai-agents', module: 'applied-ai', difficulty: 4 }
    },
    {
        id: 'lesson-17',
        content: 'AI bias reflects training data imbalances. Models can perpetuate or amplify societal biases in hiring, lending, or criminal justice. Mitigation strategies: diverse training data, bias audits, fairness metrics (demographic parity, equalized odds). Transparency about model limitations and human oversight for high-stakes decisions are essential for responsible deployment.',
        source: 'Responsible AI Practices',
        metadata: { topic: 'ethics-safety', module: 'applied-ai', difficulty: 2 }
    }
];

export const microLessonKB: KnowledgeBase = {
    name: 'Micro-Lesson Knowledge Base',
    chunks: MICRO_LESSON_CHUNKS
};

// Get lessons for a specific topic
export function getLessonsByTopic(topicId: string): RAGChunk[] {
    return MICRO_LESSON_CHUNKS.filter(c => c.metadata.topic === topicId);
}

// Get lessons by difficulty range
export function getLessonsByDifficulty(minDiff: number, maxDiff: number): RAGChunk[] {
    return MICRO_LESSON_CHUNKS.filter(
        c => (c.metadata.difficulty as number) >= minDiff &&
            (c.metadata.difficulty as number) <= maxDiff
    );
}
