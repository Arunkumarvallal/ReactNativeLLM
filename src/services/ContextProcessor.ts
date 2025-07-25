import { v4 as uuid } from 'uuid';
import { ContextChunk } from '../types/ContextTypes';
import { CONTEXT_CONSTANTS } from '../config/ContextConfig';

class ContextProcessor {

  /**
   * Process context.md content into usable chunks
   */
  processContextContent(content: string): ContextChunk[] {
    try {
      const chunks: ContextChunk[] = [];
      
      // Split content by markdown headers for better semantic chunking
      const sections = this.splitByMarkdownHeaders(content);
      
      sections.forEach(section => {
        const sectionChunks = this.createChunksFromSection(section);
        chunks.push(...sectionChunks);
      });

      return chunks;
    } catch (error) {
      console.warn('Error processing context content:', error);
      return [];
    }
  }

  /**
   * Split content by markdown headers
   */
  private splitByMarkdownHeaders(content: string): Array<{title: string, content: string}> {
    const sections: Array<{title: string, content: string}> = [];
    const lines = content.split('\n');
    let currentSection = { title: '', content: '' };
    
    for (const line of lines) {
      // Check if line is a markdown header
      if (line.match(/^#{1,6}\s+/)) {
        // Save previous section if it has content
        if (currentSection.content.trim()) {
          sections.push({ ...currentSection });
        }
        // Start new section
        currentSection = {
          title: line.replace(/^#{1,6}\s+/, '').trim(),
          content: line + '\n'
        };
      } else {
        currentSection.content += line + '\n';
      }
    }
    
    // Add the last section
    if (currentSection.content.trim()) {
      sections.push(currentSection);
    }
    
    // If no headers found, treat entire content as one section
    if (sections.length === 0) {
      sections.push({ title: 'Content', content });
    }
    
    return sections;
  }

  /**
   * Create chunks from a section
   */
  private createChunksFromSection(section: {title: string, content: string}): ContextChunk[] {
    const chunks: ContextChunk[] = [];
    const words = section.content.split(/\s+/);
    const chunkSize = CONTEXT_CONSTANTS.CHUNK_SIZE;
    const overlap = CONTEXT_CONSTANTS.CHUNK_OVERLAP;
    
    for (let i = 0; i < words.length; i += chunkSize - overlap) {
      const chunkWords = words.slice(i, i + chunkSize);
      const chunkContent = chunkWords.join(' ').trim();
      
      if (chunkContent.length > 0) {
        chunks.push({
          id: uuid(),
          content: chunkContent,
          keywords: this.extractKeywords(chunkContent),
          section: section.title || undefined,
        });
      }
    }
    
    return chunks;
  }

  /**
   * Extract keywords from content using simple text processing
   */
  private extractKeywords(content: string): string[] {
    try {
      // Remove markdown syntax and normalize
      const cleanContent = content
        .replace(/[#*`_\[\]()]/g, ' ')
        .toLowerCase()
        .replace(/[^\w\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      // Split into words and filter
      const words = cleanContent.split(' ')
        .filter(word => 
          word.length >= CONTEXT_CONSTANTS.MIN_KEYWORD_LENGTH &&
          !this.isStopWord(word)
        );

      // Get unique words and return top keywords
      const uniqueWords = [...new Set(words)];
      return uniqueWords.slice(0, 20); // Limit to top 20 keywords
    } catch (error) {
      console.warn('Error extracting keywords:', error);
      return [];
    }
  }

  /**
   * Simple stop word check
   */
  private isStopWord(word: string): boolean {
    const stopWords = [
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
      'from', 'up', 'about', 'into', 'through', 'during', 'before', 'after', 'above', 'below',
      'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
      'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those'
    ];
    return stopWords.includes(word.toLowerCase());
  }

  /**
   * Find chunks relevant to user's query using keyword matching
   */
  extractRelevantChunks(userQuery: string, chunks: ContextChunk[]): ContextChunk[] {
    const queryKeywords = this.extractKeywords(userQuery);
    console.log('Query keywords:', queryKeywords);
    
    const scoredChunks = chunks.map(chunk => {
      const score = this.calculateSimpleRelevanceScore(queryKeywords, chunk);
      return { ...chunk, relevanceScore: score };
    });

    console.log('All chunk scores:', scoredChunks.map(c => ({ 
      section: c.section, 
      score: c.relevanceScore,
      keywords: c.keywords.slice(0, 5) // First 5 keywords
    })));

    let relevantChunks = scoredChunks
      .filter(chunk => chunk.relevanceScore > 0.05)
      .sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0))
      .slice(0, CONTEXT_CONSTANTS.MAX_CHUNKS_PER_QUERY);

    // Fallback: if no relevant chunks found, include the top scoring chunks anyway
    if (relevantChunks.length === 0 && scoredChunks.length > 0) {
      console.log('⚠️ No chunks met relevance threshold, including top chunks anyway');
      relevantChunks = scoredChunks
        .sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0))
        .slice(0, Math.min(2, CONTEXT_CONSTANTS.MAX_CHUNKS_PER_QUERY)); // Include top 2 chunks
    }

    console.log('Selected relevant chunks:', relevantChunks.length);
    console.log('Chunk details:', relevantChunks.map(c => ({
      section: c.section,
      score: c.relevanceScore,
      contentPreview: c.content.substring(0, 100) + '...'
    })));
    return relevantChunks;
  }

  /**
   * Calculate simple relevance score based on keyword overlap
   */
  private calculateSimpleRelevanceScore(queryKeywords: string[], chunk: ContextChunk): number {
    if (queryKeywords.length === 0 || chunk.keywords.length === 0) {
      return 0;
    }

    const commonKeywords = queryKeywords.filter(keyword =>
      chunk.keywords.some(chunkKeyword =>
        chunkKeyword.toLowerCase().includes(keyword.toLowerCase()) ||
        keyword.toLowerCase().includes(chunkKeyword.toLowerCase())
      )
    );

    return commonKeywords.length / queryKeywords.length;
  }

  /**
   * Calculate relevance score between query and chunk
   */
  calculateRelevanceScore(query: string, chunk: ContextChunk): number {
    try {
      const queryKeywords = this.extractKeywords(query);
      return this.calculateSimpleRelevanceScore(queryKeywords, chunk);
    } catch (error) {
      console.warn('Error calculating relevance score:', error);
      return 0;
    }
  }

  /**
   * Build context prompt with relevant chunks
   */
  buildContextPrompt(userQuery: string, relevantChunks: ContextChunk[]): string {
    try {
      if (relevantChunks.length === 0) {
        return '';
      }

      const contextSections = relevantChunks.map(chunk => {
        const section = chunk.section ? `**${chunk.section}:**\n` : '';
        return `${section}${chunk.content}`;
      });

      return `[CONTEXT ACTIVE] You have access to the following information about the user:

${contextSections.join('\n\n')}

Please use this information to provide personalized and relevant responses. When the user asks about themselves, their projects, preferences, or anything related to the above information, incorporate these details naturally into your response. Start your response by acknowledging you have this context information.`;
    } catch (error) {
      console.warn('Error building context prompt:', error);
      return '';
    }
  }
}

export default new ContextProcessor(); 