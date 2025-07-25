import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Circle } from 'react-native-progress';
import { DownloadIcon, CheckCircleIcon } from 'phosphor-react-native';
import { useTheme } from '../theme/ThemeContext';
import type { AiModelSettings } from 'react-native-ai';

interface ModelSelectionProps {
  models: AiModelSettings[];
  downloadStatus: Record<string, { downloaded: boolean; progress: number; downloading: boolean }>;
  selectedModelId: string | null;
  onDownloadModel: (model: AiModelSettings) => void;
  onCancelDownload: (model: AiModelSettings) => void;
  onDeleteModel: (model: AiModelSettings) => void;
  onModelSelected: (modelId: string) => void;
}

// Utility to check if a color is dark
function isColorDark(hex: string) {
  // Remove # if present
  hex = hex.replace('#', '');
  // Convert 3-digit to 6-digit
  if (hex.length === 3) {
    hex = hex.split('').map(x => x + x).join('');
  }
  const r = parseInt(hex.substring(0,2), 16);
  const g = parseInt(hex.substring(2,4), 16);
  const b = parseInt(hex.substring(4,6), 16);
  // Perceived luminance
  const luminance = (0.299*r + 0.587*g + 0.114*b) / 255;
  return luminance < 0.5;
}

export const ModelSelection: React.FC<ModelSelectionProps> = ({
  models = [],
  downloadStatus = {},
  selectedModelId,
  onDownloadModel,
  onCancelDownload,
  onDeleteModel,
  onModelSelected,
}) => {
  const { theme } = useTheme();
  return (
    <View style={styles.listContainer}>
      {models.filter(m => !!m.model_id).map((model) => {
        const modelId = model.model_id as string;
        const status = downloadStatus[modelId] || { downloaded: false, progress: 0, downloading: false };
        const isSelected = selectedModelId === modelId;
        return (
          <TouchableOpacity
            key={modelId}
            onPress={() => {
              if (status.downloaded) onModelSelected(modelId);
            }}
            disabled={!status.downloaded}
            style={[
              styles.modelRow,
              isSelected
                ? [{
                      backgroundColor:
                        isColorDark(theme.background)
                          ? '#23243f'
                          : '#ffffff',
                      shadowColor: '#000',
                      shadowOpacity: 0.18,
                      shadowRadius: 8,
                      shadowOffset: { width: 0, height: 4 },
                      elevation: 8,
                    }]
                : [{ backgroundColor: theme.secondaryBackground }],
              {
                elevation: 3,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.12,
                shadowRadius: 6,
                opacity: status.downloaded ? 1 : 0.5,
              },
            ]}
          >
            <View style={styles.modelInfo}>
              <Text style={[styles.modelName, { color: theme.text }]}>{modelId}</Text>
              <View style={styles.iconContainer}>
                {status.downloaded && (
                    <CheckCircleIcon
                      size={20}
                      color={theme.accent}
                      weight="fill"
                    />
                )}
                {status.downloading && (
                  <Circle
                    size={22}
                    progress={status.progress / 100}
                    showsText={true}
                    color={theme.progressBar}
                    unfilledColor={theme.progressBackground}
                    borderWidth={0}
                    thickness={2}
                    formatText={() => `${Math.round(status.progress)}%`}
                  />
                )}
                {!status.downloaded && !status.downloading && (
                  <TouchableOpacity onPress={() => onDownloadModel(model)}>
                    <DownloadIcon
                      size={20}
                      color={theme.downloadIcon}
                      weight="bold"
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    width: '100%',
    paddingHorizontal: 10,
    paddingVertical: 0,
    marginVertical: 10,
  },
  modelRow: {
    width: '100%',
    borderRadius: 8,
    marginBottom: 8,
    padding: 10,
  },
  modelInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
    marginRight: 4,
    gap: 8,
  },
  modelName: {
    fontSize: 13,
    fontWeight: '500',
  },
});
