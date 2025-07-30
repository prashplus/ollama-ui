import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

interface IOllamaResponsePart {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
}

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface OllamaModel {
  name: string;
  modified_at: string;
  size: number;
  digest: string;
}

function App() {
  const [prompt, setPrompt] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [apiUrl, setApiUrl] = useState<string>('http://localhost:11434');
  const [availableModels, setAvailableModels] = useState<OllamaModel[]>([]);
  const [isLoadingModels, setIsLoadingModels] = useState<boolean>(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking');

  // Fetch available models from Ollama
  const fetchModels = async (showLoading: boolean = true): Promise<void> => {
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
  };

  // Check Ollama connection status
  const checkConnection = async (): Promise<void> => {
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
  };

  // Load models on component mount and when API URL changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      checkConnection();
    }, 500); // Debounce API URL changes

    return () => clearTimeout(timeoutId);
  }, [apiUrl]);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setPrompt(event.target.value);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      callOllamaAPI();
    }
  };

  const clearChat = (): void => {
    setMessages([]);
  };

  const callOllamaAPI = async (): Promise<void> => {
    if (!prompt.trim()) return;
    
    if (!selectedModel) {
      const errorMessage: Message = {
        id: Date.now() + 1,
        text: 'Please select a model first. Click the refresh button (🔄) to load available models.',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
      return;
    }

    const userMessage: Message = {
      id: Date.now(),
      text: prompt,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

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

      const aiMessage: Message = {
        id: Date.now() + 1,
        text: result.data.response || 'No response received',
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
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
      
      const errorMessage: Message = {
        id: Date.now() + 1,
        text: errorText,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
      
      // Update connection status if connection failed
      if (axios.isAxiosError(error) && (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK')) {
        setConnectionStatus('disconnected');
      }
    } finally {
      setIsLoading(false);
      setPrompt('');
    }
  };

  return (
    <div className="ollama-container">
      <header className="ollama-header">
        <h1>🦙 Ollama Chat UI</h1>
        <p>Interact with your local Ollama models</p>
      </header>

      <div className="ollama-settings">
        <div className="setting-group">
          <label htmlFor="api-url">API URL:</label>
          <input
            id="api-url"
            type="text"
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
            className="setting-input"
            placeholder="http://localhost:11434"
          />
        </div>
        <div className="setting-group">
          <label htmlFor="model-select">
            Model: 
            <span className={`connection-status ${connectionStatus}`}>
              {connectionStatus === 'connected' && '🟢 Connected'}
              {connectionStatus === 'disconnected' && '🔴 Disconnected'}
              {connectionStatus === 'checking' && '🟡 Checking...'}
            </span>
          </label>
          <div className="model-select-container">
            <select
              id="model-select"
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="setting-select"
              disabled={isLoadingModels || availableModels.length === 0}
            >
              {availableModels.length === 0 ? (
                <option value="">No models available</option>
              ) : (
                availableModels.map((model) => (
                  <option key={model.name} value={model.name}>
                    {model.name}
                  </option>
                ))
              )}
            </select>
            <button 
              onClick={() => fetchModels(true)} 
              className="refresh-models-button"
              disabled={isLoadingModels}
              title="Refresh model list"
            >
              {isLoadingModels ? '⏳' : '🔄'}
            </button>
          </div>
          {connectionStatus === 'disconnected' && (
            <div className="connection-error">
              <p>⚠️ Cannot connect to Ollama. Please ensure:</p>
              <ul>
                <li>Ollama is installed and running</li>
                <li>Run <code>ollama serve</code> in terminal</li>
                <li>API URL is correct: {apiUrl}</li>
              </ul>
            </div>
          )}
        </div>
        <button onClick={clearChat} className="clear-button" disabled={messages.length === 0}>
          Clear Chat
        </button>
      </div>

      <div className="ollama-chat">
        <div className="messages-container">
          {messages.length === 0 ? (
            <div className="welcome-message">
              <h3>Welcome to Ollama Chat!</h3>
              {connectionStatus === 'connected' && availableModels.length > 0 ? (
                <>
                  <p>Start a conversation with your AI assistant. Type your message below and press Enter or click Send.</p>
                  <div className="example-prompts">
                    <p><strong>Try asking:</strong></p>
                    <ul>
                      <li>"Explain quantum computing in simple terms"</li>
                      <li>"Write a Python function to reverse a string"</li>
                      <li>"What are the benefits of renewable energy?"</li>
                    </ul>
                  </div>
                </>
              ) : connectionStatus === 'disconnected' ? (
                <>
                  <p>⚠️ Cannot connect to Ollama. Please set up Ollama first:</p>
                  <div className="example-prompts">
                    <p><strong>Setup Steps:</strong></p>
                    <ul>
                      <li>1. Install Ollama from <a href="https://ollama.com" target="_blank" rel="noopener noreferrer">ollama.com</a></li>
                      <li>2. Open terminal and run: <code>ollama serve</code></li>
                      <li>3. Install a model: <code>ollama pull llama3</code></li>
                      <li>4. Click the refresh button (🔄) above to reload models</li>
                    </ul>
                  </div>
                </>
              ) : (
                <p>🔄 Checking connection to Ollama...</p>
              )}
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`message ${message.isUser ? 'user-message' : 'ai-message'}`}
              >
                <div className="message-content">
                  <div className="message-text">{message.text}</div>
                  <div className="message-timestamp">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="message ai-message">
              <div className="message-content">
                <div className="loading-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <div className="message-text">AI is thinking...</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="ollama-input-area">
        <textarea
          value={prompt}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          className="ollama-textarea"
          placeholder="Type your message here... (Press Enter to send, Shift+Enter for new line)"
          rows={3}
          disabled={isLoading}
        />
        <button 
          onClick={callOllamaAPI} 
          className="ollama-send-button"
          disabled={isLoading || !prompt.trim() || !selectedModel || connectionStatus === 'disconnected'}
        >
          {isLoading ? '⏳' : '📤'} {isLoading ? 'Sending...' : 'Send'}
        </button>
      </div>

      <footer className="ollama-footer">
        <p>
          Built with ❤️ using React & TypeScript | 
          <a href="https://ollama.com" target="_blank" rel="noopener noreferrer"> Learn more about Ollama</a>
        </p>
      </footer>
    </div>
  );
}

export default App;
