# Tools Support JOS

A modern Next.js application designed to provide helpful tools for academic publishing, particularly focused on formatting metadata for Open Journal Systems (OJS).

## Project Overview

This application offers user-friendly tools to streamline academic publishing workflows:

- **Metadata Conversion Tool**: Convert author information, keywords, and references from common formats (.docx, .pdf) to OJS-compatible formats
- **API Documentation**: Comprehensive Swagger documentation for all API endpoints
- **Modern UI**: Clean, accessible interface built with Shadcn UI components

## Features

- ⚡ **Next.js 15 App Router**: Leveraging the latest Next.js features for optimal performance
- 🎨 **Shadcn UI Components**: Beautiful, accessible UI components
- 📝 **TypeScript**: Full type safety throughout the codebase
- 🚀 **Server Components**: Optimized rendering with React Server Components
- 🔄 **API Routes with Swagger**: Well-documented API endpoints
- 🎯 **Responsive Design**: Mobile-friendly interface
- 🛠️ **Modern Development Setup**: ESLint, Prettier, and TypeScript for code quality

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with Shadcn UI
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Package Manager**: [pnpm](https://pnpm.io/)
- **Documentation**: Swagger UI for API documentation
- **Editor Integration**: TinyMCE for rich text editing

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 10+ (recommended package manager)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>

# Navigate to project directory
cd tools-support-jos

# Install dependencies
pnpm install
```

### Development

```bash
# Start development server with Turbopack
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

### Build for Production

```bash
# Create production build
pnpm build

# Start production server
pnpm start
```

### Linting and Formatting

```bash
# Run ESLint
pnpm lint

# Fix ESLint issues
pnpm lint:fix

# Check formatting with Prettier
pnpm format

# Fix formatting issues
pnpm format:fix
```

## Project Structure

```
├── app/                   # App Router directories
│   ├── api/               # API routes with Swagger documentation
│   │   ├── animals/       # Animal API endpoints
│   │   ├── docs/          # API documentation
│   │   └── hello/         # Hello world API example
│   ├── docs/              # Documentation pages
│   ├── tools/             # Tools section
│   │   └── metadata/      # Metadata conversion tools
│   │       ├── components/# Tool-specific components
│   │       └── utils.ts   # Utility functions for metadata processing
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Shared components
│   ├── ui/                # UI components from Shadcn
│   └── app-sidebar.tsx    # Application sidebar navigation
├── lib/                   # Utilities and helpers
├── public/                # Static assets
└── memory-bank/           # Project documentation and context
```

## Metadata Tools

The main feature of this application is the metadata conversion tool designed for academic publishing:

### Author Information

- Parse and format author names and affiliations from various formats
- Generate properly formatted author metadata for OJS submission

### Keywords

- Extract and format keywords from documents
- Prepare keywords in the format required by academic publishing platforms

### References

- Format bibliographic references according to academic standards
- Ensure compatibility with citation systems

## API Documentation

The application includes Swagger documentation for all API endpoints, accessible at `/api/docs`.

## Contributing

1. **Branching:**

   - Main branch for production
   - Dev branch for development
   - Feature branches for new features

2. **Commit Messages:**

   - Use clear, descriptive commit messages
   - Follow conventional commits format

3. **Code Style:**
   - Follow ESLint and Prettier configurations
   - Use TypeScript's strict mode
   - Document complex logic with comments

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
