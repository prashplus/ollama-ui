import React from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  Card,
  CardContent,
  Alert,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Send as SendIcon, SmartToy as BotIcon } from '@mui/icons-material';
import { Message as MessageType, ConnectionStatus } from '../types';
import Message from './Message';

interface ChatAreaProps {
  messages: MessageType[];
  prompt: string;
  setPrompt: (value: string) => void;
  isLoading: boolean;
  connectionStatus: ConnectionStatus;
  availableModels: any[];
  onSendMessage: () => void;
  onKeyPress: (event: React.KeyboardEvent<HTMLDivElement>) => void;
  selectedModel: string;
}

const ChatArea: React.FC<ChatAreaProps> = ({
  messages,
  prompt,
  setPrompt,
  isLoading,
  connectionStatus,
  availableModels,
  onSendMessage,
  onKeyPress,
  selectedModel,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const renderWelcomeMessage = () => (
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
                <Typography variant="body2">• "Create a React component with TypeScript"</Typography>
                <Typography variant="body2">• "Show me how to use async/await in JavaScript"</Typography>
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
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Paper sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: isMobile ? 'calc(100vh - 200px)' : '70vh',
        overflow: 'hidden',
      }}>
        {/* Messages Container */}
        <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
          {messages.length === 0 ? (
            renderWelcomeMessage()
          ) : (
            <Stack spacing={2}>
              {messages.map((message) => (
                <Message key={message.id} message={message} />
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
              onKeyPress={onKeyPress}
              placeholder="Type your message here... (Press Enter to send, Shift+Enter for new line)"
              disabled={isLoading}
              variant="outlined"
            />
            <Button
              onClick={onSendMessage}
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
  );
};

export default ChatArea;
