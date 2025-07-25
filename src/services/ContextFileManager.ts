import RNFS from 'react-native-fs';
import { ContextDocument } from '../types/ContextTypes';
import { DEFAULT_MCP_CONFIG } from '../config/ContextConfig';

class ContextFileManager {
  private contextFilePath: string;
  private fileWatcher: any = null;

  constructor() {
    this.contextFilePath = `${RNFS.DocumentDirectoryPath}/${DEFAULT_MCP_CONFIG.contextFilePath}`;
  }

  /**
   * Check if context.md exists in documents directory
   */
  async checkContextFileExists(): Promise<boolean> {
    try {
      return await RNFS.exists(this.contextFilePath);
    } catch (error) {
      console.warn('Error checking context file existence:', error);
      return false;
    }
  }

  /**
   * Read context.md file and return processed document
   */
  async readContextFile(): Promise<ContextDocument | null> {
    try {
      const fileExists = await this.checkContextFileExists();
      if (!fileExists) {
        return null;
      }

      const content = await RNFS.readFile(this.contextFilePath, 'utf8');
      const stats = await RNFS.stat(this.contextFilePath);

      return {
        content,
        lastModified: new Date(stats.mtime),
        size: stats.size,
        chunks: [], // Will be processed by ContextProcessor
        isValid: content.trim().length > 0,
      };
    } catch (error) {
      console.warn('Error reading context file:', error);
      return null;
    }
  }

  /**
   * Stop watching the context file
   */
  stopWatching(): void {
    if (this.fileWatcher) {
      clearInterval(this.fileWatcher);
      this.fileWatcher = null;
    }
  }

  /**
   * Return the standard path for context.md
   */
  getContextFilePath(): string {
    return this.contextFilePath;
  }

  /**
   * Get file metadata
   */
  async getFileMetadata() {
    try {
      const exists = await this.checkContextFileExists();
      if (!exists) return null;

      const stats = await RNFS.stat(this.contextFilePath);
      return {
        size: stats.size,
        lastModified: new Date(stats.mtime),
        path: this.contextFilePath,
      };
    } catch (error) {
      console.warn('Error getting file metadata:', error);
      return null;
    }
  }
}

export default new ContextFileManager(); 