import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Tooltip,
  Chip,
  useTheme,
} from '@mui/material';
import {
  ContentCopy as CopyIcon,
  Check as CheckIcon,
} from '@mui/icons-material';
import { getLanguageClass } from '../utils/codeFormatter';

interface CodeBlockProps {
  language: string;
  code: string;
  inline?: boolean;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ language, code, inline = false }) => {
  const [copied, setCopied] = useState(false);
  const theme = useTheme();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  if (inline) {
    return (
      <Box
        component="code"
        sx={{
          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.04)',
          color: theme.palette.mode === 'dark' ? '#e06c75' : '#c7254e',
          padding: '2px 4px',
          borderRadius: '3px',
          fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
          fontSize: '0.875em',
          border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
        }}
      >
        {code}
      </Box>
    );
  }

  return (
    <Paper
      elevation={1}
      sx={{
        my: 2,
        overflow: 'hidden',
        backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : '#f8f8f8',
        border: `1px solid ${theme.palette.divider}`,
      }}
    >
      {/* Header with language and copy button */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: 2,
          py: 1,
          backgroundColor: theme.palette.mode === 'dark' ? '#2d2d2d' : '#e8e8e8',
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Chip
          label={language || 'text'}
          size="small"
          variant="outlined"
          sx={{
            fontSize: '0.75rem',
            height: '20px',
            textTransform: 'lowercase',
          }}
        />
        <Tooltip title={copied ? 'Copied!' : 'Copy code'}>
          <IconButton
            size="small"
            onClick={handleCopy}
            sx={{
              color: copied ? theme.palette.success.main : theme.palette.text.secondary,
            }}
          >
            {copied ? <CheckIcon fontSize="small" /> : <CopyIcon fontSize="small" />}
          </IconButton>
        </Tooltip>
      </Box>

      {/* Code content */}
      <Box
        sx={{
          p: 2,
          overflow: 'auto',
          maxHeight: '400px',
        }}
      >
        <Typography
          component="pre"
          sx={{
            fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
            fontSize: '0.875rem',
            lineHeight: 1.4,
            margin: 0,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            color: theme.palette.text.primary,
          }}
          className={getLanguageClass(language)}
        >
          {code}
        </Typography>
      </Box>
    </Paper>
  );
};

export default CodeBlock;
