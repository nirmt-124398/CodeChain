# CodeChain

AI-powered retail creative automation using Google Gemini. Generate SEO-optimized product descriptions and banner images with platform-specific validation.

## Features

- **AI Text Generation** - Product descriptions via Gemini 2.5 Flash
- **AI Image Generation** - Product banners via Gemini Imagen
- **Platform Validation** - Amazon, Flipkart, Meta specs
- **Asset Management** - Preview and download generated creatives

## Quick Start

### Prerequisites
- Node.js 18+
- [Google Gemini API Key](https://aistudio.google.com/app/apikey)

### Installation

```bash
# Install dependencies
cd backend && npm install
cd ../frontend && npm install

# Configure API key
echo "GEMINI_API_KEY=your_api_key_here" > backend/.env
```

### Run

```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend  
cd frontend && npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Usage

1. Enter product name and features
2. Select target platform (Amazon/Flipkart/Meta)
3. Click "Generate Creatives"
4. Review and download assets

## Tech Stack

- **Frontend**: Next.js, React
- **Backend**: Express.js, Google Gemini AI
- **Storage**: Local file system (`backend/uploads/`)

## License

MIT
