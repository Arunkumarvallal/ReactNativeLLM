import { useState, useEffect, useCallback } from 'react';
import MCPContextManager from '../services/MCPContextManager';
import { TestContextHelper } from '../services/TestContextHelper';

interface UseContextManagerProps {
  initialContextEnabled?: boolean;
}

export const useContextManager = (props?: UseContextManagerProps) => {
  const [contextAvailable, setContextAvailable] = useState<boolean>(false);
  const [contextEnabled, setContextEnabled] = useState<boolean>(props?.initialContextEnabled ?? true);

  // Initialize context manager and check availability
  useEffect(() => {
    const initializeContext = async () => {
      try {
        await MCPContextManager.initialize();
        setContextAvailable(MCPContextManager.isContextAvailable());
      } catch (error) {
        console.warn('Error initializing context manager:', error);
      }
    };

    initializeContext();

    // Cleanup on unmount
    return () => {
      MCPContextManager.cleanup();
    };
  }, []);

  // Handler for creating test context file
  const handleCreateTestContext = useCallback(async () => {
    try {
      console.log('🧪 Creating test context file...');
      const success = await TestContextHelper.createTestContextFile();
      if (success) {
        // Refresh context manager
        await MCPContextManager.forceRefresh();
        setContextAvailable(MCPContextManager.isContextAvailable());
        console.log('🎉 Test context created and loaded!');
      }
    } catch (error) {
      console.error('Error creating test context:', error);
    }
  }, []);

  // Handler for manually refreshing context
  const handleRefreshContext = useCallback(async () => {
    try {
      console.log('🔄 Manually refreshing context...');
      await MCPContextManager.forceRefresh();
      setContextAvailable(MCPContextManager.isContextAvailable());
      console.log('✅ Context refreshed successfully!');
    } catch (error) {
      console.error('Error refreshing context:', error);
    }
  }, []);

  // Get context for query
  const getContextForQuery = useCallback(async (query: string): Promise<string | null> => {
    if (!contextEnabled || !contextAvailable) {
      return null;
    }
    return MCPContextManager.getContextForQuery(query);
  }, [contextEnabled, contextAvailable]);

  return {
    contextAvailable,
    contextEnabled,
    setContextEnabled,
    handleCreateTestContext,
    handleRefreshContext,
    getContextForQuery,
  };
}; 