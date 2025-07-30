import { useState } from 'react';
import {
  ThemeProvider,
  CssBaseline,
  Container,
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Chip,
  useTheme,
  useMediaQuery,
  Drawer,
} from '@mui/material';
import {
  Menu as MenuIcon,
} from '@mui/icons-material';
import { Message } from './types';
import { ChatArea, SettingsPanel } from './components';
import { useOllamaAPI } from './hooks/useOllamaAPI';
import { theme } from './utils/theme';

function App() {
  const [prompt, setPrompt] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState<boolean>(false);

  const {
    apiUrl,
    setApiUrl,
    availableModels,
    isLoadingModels,
    connectionStatus,
    selectedModel,
    setSelectedModel,
    fetchModels,
    generateMessage,
  } = useOllamaAPI();

  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));

  const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>): void => {
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

    const userMessage: Message = {
      id: Date.now(),
      text: prompt,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await generateMessage(prompt);
      
      const aiMessage: Message = {
        id: Date.now() + 1,
        text: response,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: Date.now() + 1,
        text: error instanceof Error ? error.message : 'An unknown error occurred',
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
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
            <SettingsPanel
              apiUrl={apiUrl}
              setApiUrl={setApiUrl}
              selectedModel={selectedModel}
              setSelectedModel={setSelectedModel}
              availableModels={availableModels}
              isLoadingModels={isLoadingModels}
              connectionStatus={connectionStatus}
              messagesLength={messages.length}
              onRefreshModels={() => fetchModels(true)}
              onClearChat={clearChat}
            />
          </Box>
        </Drawer>

        {/* Main Content */}
        <Container maxWidth="xl" sx={{ flexGrow: 1, py: 2, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', gap: 2, flexGrow: 1, flexDirection: isMobile ? 'column' : 'row' }}>
            {/* Settings Panel for Desktop/Tablet */}
            {!isMobile && (
              <Box sx={{ width: { lg: '300px', md: '280px' }, flexShrink: 0 }}>
                <SettingsPanel
                  apiUrl={apiUrl}
                  setApiUrl={setApiUrl}
                  selectedModel={selectedModel}
                  setSelectedModel={setSelectedModel}
                  availableModels={availableModels}
                  isLoadingModels={isLoadingModels}
                  connectionStatus={connectionStatus}
                  messagesLength={messages.length}
                  onRefreshModels={() => fetchModels(true)}
                  onClearChat={clearChat}
                />
              </Box>
            )}
            
            {/* Chat Area */}
            <ChatArea
              messages={messages}
              prompt={prompt}
              setPrompt={setPrompt}
              isLoading={isLoading}
              connectionStatus={connectionStatus}
              availableModels={availableModels}
              onSendMessage={callOllamaAPI}
              onKeyPress={handleKeyPress}
              selectedModel={selectedModel}
            />
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
