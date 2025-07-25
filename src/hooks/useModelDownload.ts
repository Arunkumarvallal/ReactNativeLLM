import { useState, useEffect, useCallback } from 'react';
import { getModels, downloadModel, type AiModelSettings } from 'react-native-ai';
import RNFS from 'react-native-fs';
import { DOWNLOADED_MODELS_DIR, MODEL_CONFIG_PATH } from '../utils/constants';

interface DownloadStatus {
  downloaded: boolean;
  progress: number;
  downloading: boolean;
}

export const useModelDownload = () => {
  const [availableModels, setAvailableModels] = useState<AiModelSettings[]>([]);
  const [downloadStatus, setDownloadStatus] = useState<Record<string, DownloadStatus>>({});
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null);

  // Load available models and check download status
  useEffect(() => {
    getModels().then(async models => {
      setAvailableModels(models);
      
      // Check for local model existence using react-native-ai logic
      const status: Record<string, DownloadStatus> = {};
      await Promise.all(models.map(async (model) => {
        if (model.model_id) {
          const modelConfigFile = `${RNFS.DocumentDirectoryPath}/${MODEL_CONFIG_PATH(model.model_id)}`;
          const exists = await RNFS.exists(modelConfigFile);
          status[model.model_id] = {
            downloaded: exists,
            progress: exists ? 100 : 0,
            downloading: false,
          };
        }
      }));
      setDownloadStatus(status);
      
      // Auto-select the first downloaded model if none selected
      if (!selectedModelId) {
        const firstDownloaded = models.find(m => m.model_id && status[m.model_id]?.downloaded);
        if (firstDownloaded && firstDownloaded.model_id) {
          setSelectedModelId(firstDownloaded.model_id);
        }
      }
    });
  }, [selectedModelId]);

  const handleDownloadModel = useCallback((model: AiModelSettings) => {
    if (!model.model_id) return;
    
    const modelId = model.model_id;
    setDownloadStatus(prev => ({
      ...prev,
      [modelId]: { downloaded: false, progress: 0, downloading: true },
    }));

    downloadModel(modelId, {
      onStart: () => {},
      onProgress: (progress) => {
        setDownloadStatus(prev => ({
          ...prev,
          [modelId]: { ...prev[modelId], progress: progress.percentage, downloading: true },
        }));
      },
      onComplete: async () => {
        setDownloadStatus(prev => ({
          ...prev,
          [modelId]: { downloaded: true, progress: 100, downloading: false },
        }));
        setSelectedModelId(modelId);
        
        // Create a record file for tracking
        const recordDir = `${RNFS.DocumentDirectoryPath}/${DOWNLOADED_MODELS_DIR}`;
        const recordFile = `${recordDir}/${modelId}`;
        try {
          const dirExists = await RNFS.exists(recordDir);
          if (!dirExists) {
            await RNFS.mkdir(recordDir);
          }
          await RNFS.writeFile(recordFile, 'downloaded', 'utf8');
        } catch (e) {
          console.warn('Failed to record downloaded model:', e);
        }
      },
      onError: () => {
        setDownloadStatus(prev => ({
          ...prev,
          [modelId]: { downloaded: false, progress: 0, downloading: false },
        }));
      },
    });
  }, []);

  const atLeastOneDownloaded = Object.values(downloadStatus).some(status => status.downloaded);
  const canContinue = atLeastOneDownloaded && selectedModelId && downloadStatus[selectedModelId]?.downloaded;

  return {
    availableModels,
    downloadStatus,
    selectedModelId,
    setSelectedModelId,
    handleDownloadModel,
    atLeastOneDownloaded,
    canContinue,
  };
}; 