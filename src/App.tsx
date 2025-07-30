import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
  AppBar,
  Toolbar,
  Typography,
  Box,
  Paper,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  IconButton,
  Chip,
  Alert,
  Stack,
  Grid,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  Drawer,
} from '@mui/material';
import {
  Send as SendIcon,
  Refresh as RefreshIcon,
  Clear as ClearIcon,
  SmartToy as BotIcon,
  Person as PersonIcon,
  Menu as MenuIcon,
  Settings as SettingsIcon,
  Computer as ComputerIcon,
  Link as LinkIcon,
} from '@mui/icons-material';

// Create a custom theme with responsive design
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#667eea',
      light: '#9ca5f0',
      dark: '#4054d6',
    },
    secondary: {
      main: '#764ba2',
      light: '#a575d1',
      dark: '#4a2673',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
  },
});

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
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState<boolean>(false);

  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const isTablet = useMediaQuery(muiTheme.breakpoints.between('sm', 'lg'));

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

  const getConnectionStatusChip = () => {
    const statusConfig = {
      connected: { label: 'Connected', color: 'success' as const, icon: '🟢' },
      disconnected: { label: 'Disconnected', color: 'error' as const, icon: '🔴' },
      checking: { label: 'Checking...', color: 'warning' as const, icon: '🟡' },
    };
    
    const config = statusConfig[connectionStatus];
    return (
      <Chip
        label={`${config.icon} ${config.label}`}
        color={config.color}
        size="small"
        sx={{ ml: 1 }}
      />
    );
  };

  const SettingsPanel = () => (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Stack spacing={3}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SettingsIcon /> Settings
        </Typography>
        
        <TextField
          fullWidth
          label="API URL"
          value={apiUrl}
          onChange={(e) => setApiUrl(e.target.value)}
          placeholder="http://localhost:11434"
          InputProps={{
            startAdornment: <LinkIcon sx={{ mr: 1, color: 'action.active' }} />,
          }}
          size={isMobile ? 'small' : 'medium'}
        />

        <Box>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
            <FormControl fullWidth size={isMobile ? 'small' : 'medium'}>
              <InputLabel>Model</InputLabel>
              <Select
                value={selectedModel}
                label="Model"
                onChange={(e) => setSelectedModel(e.target.value)}
                disabled={isLoadingModels || availableModels.length === 0}
              >
                {availableModels.length === 0 ? (
                  <MenuItem value="">No models available</MenuItem>
                ) : (
                  availableModels.map((model) => (
                    <MenuItem key={model.name} value={model.name}>
                      {model.name}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>
            
            <IconButton
              onClick={() => fetchModels(true)}
              disabled={isLoadingModels}
              title="Refresh model list"
              color="primary"
            >
              <RefreshIcon />
            </IconButton>
          </Stack>
          
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {getConnectionStatusChip()}
            <Button
              onClick={clearChat}
              disabled={messages.length === 0}
              startIcon={<ClearIcon />}
              color="error"
              variant="outlined"
              size={isMobile ? 'small' : 'medium'}
            >
              Clear Chat
            </Button>
          </Box>
        </Box>

        {connectionStatus === 'disconnected' && (
          <Alert severity="error" sx={{ mt: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
              ⚠️ Cannot connect to Ollama. Please ensure:
            </Typography>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li>Ollama is installed and running</li>
              <li>Run <code>ollama serve</code> in terminal</li>
              <li>API URL is correct: {apiUrl}</li>
            </ul>
          </Alert>
        )}
      </Stack>
    </Paper>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* App Bar */}
        <AppBar position="static" sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          <Toolbar>
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={() => setMobileDrawerOpen(true)}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1 }}>
              <Typography variant={isMobile ? 'h6' : 'h4'} component="h1" sx={{ fontWeight: 700 }}>
                🦙 Ollama Chat UI
              </Typography>
            </Box>
            {!isMobile && getConnectionStatusChip()}
          </Toolbar>
        </AppBar>

        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          anchor="left"
          open={mobileDrawerOpen}
          onClose={() => setMobileDrawerOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 300 },
          }}
        >
          <Box sx={{ p: 2 }}>
            <SettingsPanel />
          </Box>
        </Drawer>

        {/* Main Content */}
        <Container maxWidth="xl" sx={{ flexGrow: 1, py: 2, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', gap: 2, flexGrow: 1, flexDirection: isMobile ? 'column' : 'row' }}>
            {/* Settings Panel for Desktop/Tablet */}
            {!isMobile && (
              <Box sx={{ width: { lg: '300px', md: '280px' }, flexShrink: 0 }}>
                <SettingsPanel />
              </Box>
            )}
            
            {/* Chat Area */}
            <Box sx={{ flexGrow: 1 }}>
              <Paper sx={{ display: 'flex', flexDirection: 'column', height: isMobile ? 'calc(100vh - 200px)' : '70vh' }}>
                {/* Messages Container */}
                <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
                  {messages.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <Typography variant="h5" gutterBottom color="primary" sx={{ fontWeight: 600 }}>
                        Welcome to Ollama Chat! 🦙
                      </Typography>
                      
                      {connectionStatus === 'connected' && availableModels.length > 0 ? (
                        <Card sx={{ mt: 3, maxWidth: 600, mx: 'auto' }}>
                          <CardContent>
                            <Typography variant="body1" paragraph>
                              Start a conversation with your AI assistant. Type your message below and press Enter or click Send.
                            </Typography>
                            <Box sx={{ textAlign: 'left' }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                                Try asking:
                              </Typography>
                              <Stack spacing={1}>
                                <Typography variant="body2">• "Explain quantum computing in simple terms"</Typography>
                                <Typography variant="body2">• "Write a Python function to reverse a string"</Typography>
                                <Typography variant="body2">• "What are the benefits of renewable energy?"</Typography>
                              </Stack>
                            </Box>
                          </CardContent>
                        </Card>
                      ) : connectionStatus === 'disconnected' ? (
                        <Card sx={{ mt: 3, maxWidth: 600, mx: 'auto' }}>
                          <CardContent>
                            <Alert severity="warning" sx={{ mb: 2 }}>
                              ⚠️ Cannot connect to Ollama. Please set up Ollama first:
                            </Alert>
                            <Box sx={{ textAlign: 'left' }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                                Setup Steps:
                              </Typography>
                              <Stack spacing={1}>
                                <Typography variant="body2">
                                  1. Install Ollama from{' '}
                                  <a href="https://ollama.com" target="_blank" rel="noopener noreferrer">
                                    ollama.com
                                  </a>
                                </Typography>
                                <Typography variant="body2">2. Open terminal and run: <code>ollama serve</code></Typography>
                                <Typography variant="body2">3. Install a model: <code>ollama pull llama3</code></Typography>
                                <Typography variant="body2">4. Click the refresh button (🔄) to reload models</Typography>
                              </Stack>
                            </Box>
                          </CardContent>
                        </Card>
                      ) : (
                        <Typography variant="body1" color="text.secondary">
                          🔄 Checking connection to Ollama...
                        </Typography>
                      )}
                    </Box>
                  ) : (
                    <Stack spacing={2}>
                      {messages.map((message) => (
                        <Box
                          key={message.id}
                          sx={{
                            display: 'flex',
                            justifyContent: message.isUser ? 'flex-end' : 'flex-start',
                          }}
                        >
                          <Paper
                            elevation={2}
                            sx={{
                              p: 2,
                              maxWidth: '70%',
                              minWidth: isMobile ? '60%' : '200px',
                              backgroundColor: message.isUser 
                                ? 'primary.main' 
                                : 'background.paper',
                              color: message.isUser ? 'primary.contrastText' : 'text.primary',
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                              {message.isUser ? <PersonIcon /> : <BotIcon />}
                              <Box sx={{ flexGrow: 1 }}>
                                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                                  {message.text}
                                </Typography>
                                <Typography 
                                  variant="caption" 
                                  sx={{ 
                                    display: 'block', 
                                    mt: 1, 
                                    opacity: 0.7,
                                    textAlign: 'right'
                                  }}
                                >
                                  {message.timestamp.toLocaleTimeString()}
                                </Typography>
                              </Box>
                            </Box>
                          </Paper>
                        </Box>
                      ))}
                      
                      {isLoading && (
                        <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                          <Paper elevation={2} sx={{ p: 2, backgroundColor: 'background.paper' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <BotIcon />
                              <Typography variant="body1">AI is thinking...</Typography>
                            </Box>
                          </Paper>
                        </Box>
                      )}
                    </Stack>
                  )}
                </Box>

                {/* Input Area */}
                <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
                  <Stack direction={isMobile ? 'column' : 'row'} spacing={1}>
                    <TextField
                      fullWidth
                      multiline
                      rows={isMobile ? 2 : 3}
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          callOllamaAPI();
                        }
                      }}
                      placeholder="Type your message here... (Press Enter to send, Shift+Enter for new line)"
                      disabled={isLoading}
                      variant="outlined"
                    />
                    <Button
                      onClick={callOllamaAPI}
                      disabled={isLoading || !prompt.trim() || !selectedModel || connectionStatus === 'disconnected'}
                      variant="contained"
                      endIcon={<SendIcon />}
                      sx={{ 
                        minWidth: isMobile ? 'auto' : '120px',
                        height: isMobile ? '48px' : 'auto'
                      }}
                    >
                      {isLoading ? 'Sending...' : 'Send'}
                    </Button>
                  </Stack>
                </Box>
              </Paper>
            </Box>
          </Box>
        </Container>

        {/* Footer */}
        <Box 
          component="footer" 
          sx={{ 
            py: 2, 
            px: 2, 
            backgroundColor: 'background.paper', 
            borderTop: 1, 
            borderColor: 'divider',
            textAlign: 'center'
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Built with ❤️ using React, TypeScript & Material-UI |{' '}
            <a href="https://ollama.com" target="_blank" rel="noopener noreferrer">
              Learn more about Ollama
            </a>
          </Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
