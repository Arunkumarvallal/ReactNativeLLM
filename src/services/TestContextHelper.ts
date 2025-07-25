import RNFS from 'react-native-fs';
import { DEFAULT_MCP_CONFIG } from '../config/ContextConfig';

const TEST_CONTEXT_CONTENT = `# My Personal Knowledge Base

## About Me
I'm a React Native developer working on an LLM chat application. I have 3 years of experience with React and I'm learning about AI integration and mobile development.

## Current Project
I'm building ReactNativeLLM - a mobile app that allows users to chat with AI models locally on their device. The app features:
- Model selection and downloading
- Local AI model execution  
- Dark/light theme support
- Context integration from markdown files

## Technical Stack
- React Native with TypeScript
- react-native-ai for local LLM inference
- Phosphor React Native for icons
- React Navigation for navigation
- Gifted Chat for messaging UI

## Preferences
- I prefer clean, minimal user interfaces
- I like using semantic variable names
- I always add proper error handling
- I prefer functional components with hooks over class components

## Goals
- Learn about MCP (Model Context Protocol) integration
- Improve the user experience of mobile AI apps
- Understand local AI model optimization
- Build production-ready React Native applications

## Notes
When building the context feature, remember to:
- Keep the UI simple and intuitive
- Handle file errors gracefully
- Provide clear feedback to users
- Make the feature optional and toggleable`;

export class TestContextHelper {
  static async createTestContextFile(): Promise<boolean> {
    try {
      const contextFilePath = `${RNFS.DocumentDirectoryPath}/${DEFAULT_MCP_CONFIG.contextFilePath}`;
      console.log('📝 Creating test context file at:', contextFilePath);
      
      await RNFS.writeFile(contextFilePath, TEST_CONTEXT_CONTENT, 'utf8');
      console.log('✅ Test context file created successfully!');
      return true;
    } catch (error) {
      console.error('❌ Error creating test context file:', error);
      return false;
    }
  }

  static async deleteTestContextFile(): Promise<boolean> {
    try {
      const contextFilePath = `${RNFS.DocumentDirectoryPath}/${DEFAULT_MCP_CONFIG.contextFilePath}`;
      const exists = await RNFS.exists(contextFilePath);
      
      if (exists) {
        await RNFS.unlink(contextFilePath);
        console.log('🗑️ Test context file deleted successfully!');
        return true;
      } else {
        console.log('ℹ️ No context file to delete');
        return true;
      }
    } catch (error) {
      console.error('❌ Error deleting test context file:', error);
      return false;
    }
  }

  static async checkContextFileExists(): Promise<boolean> {
    try {
      const contextFilePath = `${RNFS.DocumentDirectoryPath}/${DEFAULT_MCP_CONFIG.contextFilePath}`;
      return await RNFS.exists(contextFilePath);
    } catch (error) {
      console.error('❌ Error checking context file:', error);
      return false;
    }
  }

  static getContextFilePath(): string {
    return `${RNFS.DocumentDirectoryPath}/${DEFAULT_MCP_CONFIG.contextFilePath}`;
  }
} 