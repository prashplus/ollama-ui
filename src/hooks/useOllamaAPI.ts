import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { OllamaModel, ConnectionStatus } from '../types';

export const useOllamaAPI = () => {
  const [apiUrl, setApiUrl] = useState<string>('http://localhost:11434');
  const [availableModels, setAvailableModels] = useState<OllamaModel[]>([]);
  const [isLoadingModels, setIsLoadingModels] = useState<boolean>(false);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('checking');
  const [selectedModel, setSelectedModel] = useState<string>('');

  // Fetch available models from Ollama
  const fetchModels = useCallback(async (showLoading: boolean = true): Promise<void> => {
    if (showLoading) setIsLoadingModels(true);
    try {
      const response = await axios.get(`${apiUrl}/api/tags`, {
        timeout: 5000,
      });
      
      if (response.data && response.data.models) {
        setAvailableModels(response.data.models);
        setConnectionStatus('connected');
        
        // Auto-select first model if none selected
        if (!selectedModel && response.data.models.length > 0) {
          setSelectedModel(response.data.models[0].name);
        }
      } else {
        setAvailableModels([]);
        setConnectionStatus('disconnected');
      }
    } catch (error) {
      console.error('Error fetching models:', error);
      setAvailableModels([]);
      setConnectionStatus('disconnected');
    } finally {
      if (showLoading) setIsLoadingModels(false);
    }
  }, [apiUrl, selectedModel]);

  // Check Ollama connection status
  const checkConnection = useCallback(async (): Promise<void> => {
    setConnectionStatus('checking');
    try {
      await axios.get(`${apiUrl}/api/version`, {
        timeout: 3000,
      });
      setConnectionStatus('connected');
      fetchModels(false);
    } catch (error) {
      console.error('Connection check failed:', error);
      setConnectionStatus('disconnected');
    }
  }, [apiUrl, fetchModels]);

  // Load models when API URL changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      checkConnection();
    }, 500); // Debounce API URL changes

    return () => clearTimeout(timeoutId);
  }, [apiUrl, checkConnection]);

  // Generate message
  const generateMessage = async (prompt: string): Promise<string> => {
    if (!selectedModel) {
      throw new Error('Please select a model first. Click the refresh button (🔄) to load available models.');
    }

    try {
      const result = await axios.post(`${apiUrl}/api/generate`, {
        model: selectedModel,
        prompt: prompt,
        stream: false,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 60000, // Increased timeout for longer responses
      });

      return result.data.response || 'No response received';
    } catch (error) {
      console.error('Error calling Ollama API:', error);
      
      let errorText = 'Failed to connect to Ollama API.';
      
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
          errorText = `Cannot connect to Ollama at ${apiUrl}. Please ensure Ollama is running with 'ollama serve'.`;
        } else if (error.response?.status === 404) {
          errorText = `Model '${selectedModel}' not found. Please install it with 'ollama pull ${selectedModel}' or select a different model.`;
        } else if (error.response?.status === 500) {
          errorText = `Server error: ${error.response.data?.error || 'Internal server error'}`;
        } else if (error.code === 'ECONNABORTED') {
          errorText = 'Request timed out. The model might be taking too long to respond.';
        } else {
          errorText = `Error: ${error.message}`;
        }
      }
      
      // Update connection status if connection failed
      if (axios.isAxiosError(error) && (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK')) {
        setConnectionStatus('disconnected');
      }
      
      throw new Error(errorText);
    }
  };

  return {
    apiUrl,
    setApiUrl,
    availableModels,
    isLoadingModels,
    connectionStatus,
    selectedModel,
    setSelectedModel,
    fetchModels,
    checkConnection,
    generateMessage,
  };
};
