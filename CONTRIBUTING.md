# Contributing to Ollama UI

Thank you for your interest in contributing to Ollama UI! We welcome contributions from everyone.

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Git
- A code editor (VS Code recommended)

### Setting up the development environment

1. **Fork the repository**
   ```bash
   # Click the "Fork" button on GitHub, then clone your fork
   git clone https://github.com/your-username/ollama-ui.git
   cd ollama-ui
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run tests**
   ```bash
   npm test
   ```

## 📝 How to Contribute

### Reporting Bugs

Before creating bug reports, please check if the issue already exists in the [issue tracker](https://github.com/prashplus/ollama-ui/issues).

When creating a bug report, please include:

- **Clear title and description**
- **Steps to reproduce** the issue
- **Expected behavior**
- **Actual behavior**
- **Screenshots** (if applicable)
- **Environment details** (OS, browser, Node.js version)
- **Error messages** or console logs

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- **Clear title and description**
- **Use case** - explain why this feature would be useful
- **Detailed description** of the proposed feature
- **Mockups or examples** (if applicable)

### Pull Requests

1. **Create a new branch** for your feature or bug fix:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

2. **Make your changes** following our coding standards

3. **Add tests** for new functionality

4. **Run the test suite**:
   ```bash
   npm test
   npm run lint
   npm run type-check
   ```

5. **Commit your changes** with a clear commit message:
   ```bash
   git commit -m "feat: add new chat export feature"
   # or
   git commit -m "fix: resolve message timestamp formatting issue"
   ```

6. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request** from your fork to the main repository

## 🎨 Coding Standards

### TypeScript

- Use TypeScript for all new code
- Provide proper type annotations
- Avoid `any` types when possible
- Use interfaces for object shapes

### React

- Use functional components with hooks
- Follow the existing component structure
- Use meaningful component and variable names
- Keep components focused and small

### Styling

- Use the existing CSS class naming convention
- Keep styles modular and component-specific
- Ensure responsive design
- Test on different screen sizes

### Code Formatting

We use Prettier for code formatting. Run before committing:

```bash
npm run format
```

### Linting

We use ESLint for code quality. Fix linting issues:

```bash
npm run lint:fix
```

## 🧪 Testing

- Write tests for new features
- Update tests when modifying existing features
- Ensure all tests pass before submitting PR
- Aim for good test coverage

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:ci

# Run tests in watch mode
npm test -- --watch
```

## 📁 Project Structure

```
src/
├── components/     # Reusable React components (future)
├── hooks/         # Custom React hooks (future)
├── types/         # TypeScript type definitions (future)
├── utils/         # Utility functions (future)
├── App.tsx        # Main application component
├── App.css        # Application styles
└── index.tsx      # Application entry point
```

## 🔄 Development Workflow

1. **Check issues** - Look for existing issues or create a new one
2. **Discuss** - Comment on the issue to discuss the approach
3. **Code** - Implement your changes
4. **Test** - Add tests and ensure all tests pass
5. **Document** - Update documentation if needed
6. **Submit** - Create a pull request

## 📋 Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Examples:
```
feat: add streaming response support
fix: resolve message rendering issue
docs: update installation instructions
style: improve button hover effects
refactor: extract message component
test: add tests for API error handling
chore: update dependencies
```

## 🎯 Areas for Contribution

We welcome contributions in these areas:

- **Bug fixes** - Help us squash bugs!
- **Feature development** - Implement new features from our roadmap
- **Documentation** - Improve docs, add examples
- **Testing** - Increase test coverage
- **Performance** - Optimize components and API calls
- **Accessibility** - Make the app more accessible
- **UI/UX** - Improve the user interface and experience
- **Mobile** - Enhance mobile responsiveness

## 🤔 Questions?

If you have questions about contributing:

- Check existing [GitHub Issues](https://github.com/prashplus/ollama-ui/issues)
- Start a [GitHub Discussion](https://github.com/prashplus/ollama-ui/discussions)
- Reach out to [@prashplus](https://github.com/prashplus)

## 📜 Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct:

- **Be respectful** and inclusive
- **Be constructive** in feedback
- **Focus on what's best** for the community
- **Show empathy** towards other contributors

## 🙏 Recognition

Contributors will be recognized in:

- The project's README.md
- GitHub's contributor graph
- Release notes for significant contributions

Thank you for contributing to Ollama UI! 🎉
