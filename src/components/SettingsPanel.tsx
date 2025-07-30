import React from 'react';
import {
  Paper,
  Stack,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Button,
  Box,
  Alert,
  Chip,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Link as LinkIcon,
  Refresh as RefreshIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { OllamaModel, ConnectionStatus } from '../types';

interface SettingsPanelProps {
  apiUrl: string;
  setApiUrl: (url: string) => void;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  availableModels: OllamaModel[];
  isLoadingModels: boolean;
  connectionStatus: ConnectionStatus;
  messagesLength: number;
  onRefreshModels: () => void;
  onClearChat: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  apiUrl,
  setApiUrl,
  selectedModel,
  setSelectedModel,
  availableModels,
  isLoadingModels,
  connectionStatus,
  messagesLength,
  onRefreshModels,
  onClearChat,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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
              onClick={onRefreshModels}
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
              onClick={onClearChat}
              disabled={messagesLength === 0}
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
};

export default SettingsPanel;
