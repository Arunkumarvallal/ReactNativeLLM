import ContextFileManager from './ContextFileManager';
import ContextProcessor from './ContextProcessor';
import { ContextDocument, ContextChunk } from '../types/ContextTypes';
import { DEFAULT_MCP_CONFIG } from '../config/ContextConfig';

class MCPContextManager {
  private contextDocument: ContextDocument | null = null;
  private lastFileCheck: Date | null = null;
  private isInitialized = false;

  /**
   * Initialize the MCP context system
   */
  async initialize(): Promise<void> {
    try {
      console.log('Initializing MCP Context Manager...');
      console.log('Looking for context file at:', ContextFileManager.getContextFilePath());
      
      // Check if context file exists and load it
      await this.refreshContext();
      
      // Note: No longer using automatic file watching - manual refresh only
      console.log('📱 Context will be refreshed manually only');
      
      this.isInitialized = true;
      console.log('MCP Context Manager initialized successfully');
    } catch (error) {
      console.warn('Error initializing MCP Context Manager:', error);
    }
  }

  /**
   * Check if context.md file is available and valid
   */
  isContextAvailable(): boolean {
    return this.contextDocument !== null && 
           this.contextDocument.isValid && 
           this.contextDocument.chunks.length > 0;
  }

  /**
   * Main function: get relevant context for user's query
   * Returns null if no relevant context found or context is disabled
   */
  async getContextForQuery(userQuery: string): Promise<string | null> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      // Check if context is available
      if (!this.isContextAvailable()) {
        console.log('❌ Context not available - no file or invalid');
        return null;
      }

      console.log(`🔍 Processing query: "${userQuery}"`);
      console.log(`📚 Available chunks: ${this.contextDocument!.chunks.length}`);

      // Find relevant chunks
      const relevantChunks = ContextProcessor.extractRelevantChunks(
        userQuery, 
        this.contextDocument!.chunks
      );

      // If no relevant chunks found, return null
      if (relevantChunks.length === 0) {
        console.log('⚠️ No relevant context found for query:', userQuery);
        console.log('💡 Consider asking about: React Native, LLM, projects, preferences, or technical skills');
        return null;
      }

      // Build context prompt
      const contextPrompt = ContextProcessor.buildContextPrompt(userQuery, relevantChunks);
      
      console.log(`✅ Found ${relevantChunks.length} relevant context chunks for query`);
      console.log('📄 Context prompt length:', contextPrompt.length);
      console.log('🔍 Context prompt preview:', contextPrompt.substring(0, 300) + '...');
      return contextPrompt;
    } catch (error) {
      console.warn('Error getting context for query:', error);
      return null;
    }
  }

  /**
   * Refresh context from file (called when file changes)
   */
  async refreshContext(): Promise<void> {
    try {
      const contextDoc = await ContextFileManager.readContextFile();
      
      if (contextDoc) {
        // Process the content into chunks
        const chunks = ContextProcessor.processContextContent(contextDoc.content);
        
        this.contextDocument = {
          ...contextDoc,
          chunks
        };
        
        this.lastFileCheck = new Date();
        console.log(`Context refreshed: ${chunks.length} chunks processed`);
      } else {
        this.contextDocument = null;
        console.log('No context file found or file is empty');
      }
    } catch (error) {
      console.warn('Error refreshing context:', error);
      this.contextDocument = null;
    }
  }

  /**
   * Get context file metadata
   */
  async getContextMetadata() {
    try {
      const metadata = await ContextFileManager.getFileMetadata();
      return {
        ...metadata,
        chunksCount: this.contextDocument?.chunks.length || 0,
        lastProcessed: this.lastFileCheck,
        isAvailable: this.isContextAvailable()
      };
    } catch (error) {
      console.warn('Error getting context metadata:', error);
      return null;
    }
  }

  /**
   * Force reload context from file
   */
  async forceRefresh(): Promise<boolean> {
    try {
      await this.refreshContext();
      return this.isContextAvailable();
    } catch (error) {
      console.warn('Error force refreshing context:', error);
      return false;
    }
  }

  /**
   * Get context file path for user reference
   */
  getContextFilePath(): string {
    return ContextFileManager.getContextFilePath();
  }

  /**
   * Get current context statistics
   */
  getContextStats() {
    if (!this.isContextAvailable()) {
      return {
        available: false,
        chunksCount: 0,
        fileSize: 0,
        lastModified: null
      };
    }

    return {
      available: true,
      chunksCount: this.contextDocument!.chunks.length,
      fileSize: this.contextDocument!.size,
      lastModified: this.contextDocument!.lastModified,
      lastProcessed: this.lastFileCheck
    };
  }

  /**
   * Cleanup resources
   */
  cleanup(): void {
    try {
      ContextFileManager.stopWatching();
      this.contextDocument = null;
      this.isInitialized = false;
      console.log('MCP Context Manager cleaned up');
    } catch (error) {
      console.warn('Error cleaning up MCP Context Manager:', error);
    }
  }
}

export default new MCPContextManager(); 