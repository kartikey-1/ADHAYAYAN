# अध्यYAN - Computer Science Learning Platform

A comprehensive Computer Science learning platform with AI-powered assistance. This is a static website that can be deployed to any static hosting service like Netlify, Vercel, or GitHub Pages.

## Features

- **AI Chat Assistant**: Powered by Google Gemini AI for Computer Science questions
- **Programming Resources**: HTML pages for different programming languages
- **PDF Resources**: Curated study materials and notes
- **Modern UI**: Beautiful, responsive design with smooth animations

## Setup Instructions

### For Local Development

1. Clone the repository
2. Serve the files using any static server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js (if you have http-server installed)
   npx http-server
   
   # Using PHP
   php -S localhost:8000
   ```
3. Open `http://localhost:8000` in your browser

### For Production Deployment

1. **Netlify**: Simply drag and drop the entire folder to Netlify
2. **Vercel**: Connect your GitHub repository to Vercel
3. **GitHub Pages**: Enable Pages in your repository settings

### API Key Setup

To use the AI chat feature:

1. Get a free Google AI API key from: https://makersuite.google.com/app/apikey
2. Click "Add API Key" in the chat interface
3. Enter your API key (it's stored locally in your browser)

## File Structure

```
├── index.html          # Main homepage
├── CHAT.html           # AI chat interface
├── CORE_SUB.html       # Core subjects page
├── Roadmap.html        # Learning roadmap
├── YT_VIDEO.html       # Video resources
├── [Language].html     # Programming language pages
├── pdf/                # Study materials
├── pic/                # Images and assets
└── styles.css          # Global styles
```

## Technologies Used

- HTML5, CSS3, JavaScript
- Google Gemini AI API
- Font Awesome icons
- Showdown.js for markdown rendering
- Responsive design with CSS Grid and Flexbox

## License

MIT License - see LICENSE file for details.