# 🦙 Ollama UI

[![CI](https://github.com/prashplus/ollama-ui/actions/workflows/ci.yml/badge.svg)](https://github.com/prashplus/ollama-ui/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://badges.frapsoft.com/typescript/code/typescript.svg?v=101)](https://github.com/ellerbrock/typescript-badges/)
[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)

A modern, responsive React TypeScript web interface for interacting with [Ollama](https://ollama.com) AI models. Features a beautiful chat interface, model selection, and real-time conversation capabilities.

![Ollama UI Preview](https://via.placeholder.com/800x500/667eea/ffffff?text=Ollama+UI+Preview)

## ✨ Features

- 🎨 **Modern UI/UX** - Beautiful, responsive design with gradient themes
- 💬 **Chat Interface** - Real-time conversation with AI models
- 🔧 **Model Selection** - Easy switching between different Ollama models
- ⚙️ **Configurable** - Customizable API endpoint and settings
- 📱 **Responsive** - Works seamlessly on desktop and mobile devices
- 🎯 **TypeScript** - Full type safety and developer experience
- ⚡ **Fast** - Optimized React components with efficient rendering
- 🧪 **Well Tested** - Comprehensive test suite with CI/CD pipeline

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [Ollama](https://ollama.com) installed and running locally
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/prashplus/ollama-ui.git
   cd ollama-ui
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm start
   # or
   yarn start
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Setting Up Ollama

1. **Install Ollama** (if not already installed)
   ```bash
   # macOS
   brew install ollama
   
   # Linux
   curl -fsSL https://ollama.com/install.sh | sh
   
   # Windows - Download from https://ollama.com/download
   ```

2. **Start Ollama server**
   ```bash
   ollama serve
   ```

3. **Pull a model** (e.g., Llama 3)
   ```bash
   ollama pull llama3
   ```

## 🎛️ Configuration

### Default Settings

- **API URL**: `http://localhost:11434` (Ollama's default port)
- **Default Model**: `llama3`

### Supported Models

- Llama 3 / 3.1
- Code Llama
- Mistral
- Phi-3
- Any other model installed in your Ollama instance

### Environment Variables

Create a `.env` file in the root directory to customize default settings:

```env
REACT_APP_OLLAMA_API_URL=http://localhost:11434
REACT_APP_DEFAULT_MODEL=llama3
```

## 🛠️ Development

### Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run test suite
- `npm run test:ci` - Run tests with coverage for CI
- `npm run lint` - Lint code
- `npm run lint:fix` - Fix linting issues
- `npm run format` - Format code with Prettier
- `npm run type-check` - Run TypeScript type checking

### Project Structure

```
ollama-ui/
├── public/                 # Static assets
├── src/
│   ├── components/        # React components (future)
│   ├── hooks/            # Custom React hooks (future)
│   ├── types/            # TypeScript type definitions (future)
│   ├── utils/            # Utility functions (future)
│   ├── App.tsx           # Main application component
│   ├── App.css           # Application styles
│   └── index.tsx         # Application entry point
├── .github/
│   └── workflows/        # GitHub Actions CI/CD
├── package.json
└── README.md
```

## 🧪 Testing

The project includes a comprehensive test suite using Jest and React Testing Library.

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:ci

# Run tests in watch mode
npm test -- --watch
```

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

The build artifacts will be stored in the `build/` directory.

### Deploy to GitHub Pages

```bash
npm run deploy
```

### Deploy to Other Platforms

The built application can be deployed to any static hosting service:

- **Vercel**: Connect your GitHub repo for automatic deployments
- **Netlify**: Drag and drop the `build/` folder
- **AWS S3**: Upload build files to an S3 bucket
- **Docker**: Use the included Dockerfile (if added)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Workflow

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Use TypeScript for all new code
- Follow the existing code style
- Run `npm run lint` and `npm run format` before committing
- Add tests for new features

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Ollama](https://ollama.com) - For the amazing local AI platform
- [React](https://reactjs.org/) - The web framework that powers this UI
- [TypeScript](https://www.typescriptlang.org/) - For type safety and better DX

## 📞 Support

- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/prashplus/ollama-ui/issues)
- 💡 **Feature Requests**: [GitHub Discussions](https://github.com/prashplus/ollama-ui/discussions)
- 📧 **Email**: [prash@example.com](mailto:prash@example.com)
- 🌐 **Blog**: [http://prashplus.blogspot.com](http://prashplus.blogspot.com)

## 🗺️ Roadmap

- [ ] **Model Management** - Install/remove models directly from UI
- [ ] **Conversation History** - Save and restore chat sessions
- [ ] **Custom Themes** - Dark/light mode and custom color schemes
- [ ] **Export Conversations** - Download chats as text/markdown
- [ ] **Streaming Responses** - Real-time response streaming
- [ ] **Plugin System** - Extensible architecture for custom features
- [ ] **Multi-language Support** - Internationalization (i18n)
- [ ] **Voice Input/Output** - Speech-to-text and text-to-speech

---

<div align="center">

**Built with ❤️ by [Prashant Piprotar](https://github.com/prashplus)**

⭐ Star this repository if you find it helpful!

</div>