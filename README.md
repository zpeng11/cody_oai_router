# Cody OAI Router - Portable Executable

A simple proxy server for Sourcegraph's chat API that can be used as a drop-in replacement for OpenAI's API.

## Quick Start

### Windows
1. Double-click `cody-oai-router.exe`
2. A console window will open showing the server status
3. The server will start on `http://127.0.0.1:3000`

### Linux
1. Make the file executable: `chmod +x cody-oai-router-linux`
2. Run the file: `./cody-oai-router-linux`
3. The server will start on `http://127.0.0.1:3000`

## Configuration

The proxy can be configured in two ways:

### Option 1: Using a .env file (Recommended)
1. Copy `.env.example` to `.env` in the same directory as the executable
2. Edit `.env` with your configuration
3. Restart the executable

### Option 2: Using Environment Variables
Set environment variables before running the executable:

**Windows (System GUI):**
1. Right-click "This PC" → "Properties"
2. Click "Advanced system settings"
3. Click "Environment Variables"
4. Under "User variables" or "System variables", click "New"
5. Add `SOURCEGRAPH_API_TOKEN` for token and `SOURCEGRAPH_BASE_URL` for enterprise url
6. Click OK to save
7. Restart the executable

**Windows (Command Prompt):**
```cmd
set SOURCEGRAPH_API_TOKEN=your_token_here
cody-oai-router.exe
```

**Windows (PowerShell):**
```powershell
$env:SOURCEGRAPH_API_TOKEN="your_token_here"
.\cody-oai-router.exe
```

**Linux/Mac:**
```bash
export SOURCEGRAPH_API_TOKEN="your_token_here"
./cody-oai-router-linux
```

## Configuration Options

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Port number for the proxy server |
| `SOURCEGRAPH_BASE_URL` | `https://sourcegraph.com` | Sourcegraph instance URL |
| `SOURCEGRAPH_END_POINT` | `/.api/llm/chat/completions` | API endpoint path |
| `SOURCEGRAPH_API_TOKEN` | *required* | Your Sourcegraph API token |

### Getting Your API Token

1. Visit https://sourcegraph.com/settings/tokens
2. Create a new token with appropriate permissions
3. Copy the token and use it in your configuration

## Usage

Once the server is running, it provides an OpenAI-compatible API endpoint:

```bash
curl http://127.0.0.1:3000/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4",
    "messages": [
      {"role": "user", "content": "Hello!"}
    ]
  }'
```

## Features

- ✅ OpenAI API compatible endpoint
- ✅ Handles streaming responses
- ✅ 60-second timeout for upstream requests
- ✅ Request logging with duration tracking
- ✅ Connection pooling for better performance
- ✅ No Node.js installation required

## Stopping the Server

Simply close the console window or press `Ctrl+C` in the terminal.

## Troubleshooting

### Server won't start
- Check that port 3000 is not in use by another application
- Verify your SOURCEGRAPH_API_TOKEN is set correctly
- Check the console output for error messages

### Connection errors
- Verify your internet connection
- Check that SOURCEGRAPH_BASE_URL is accessible
- Ensure your API token has correct permissions

### Request timeouts
- The proxy has a 60-second timeout for upstream requests
- Increase timeout if needed (requires code modification)

## Logs

The proxy outputs logs to the console including:
- Request timestamp
- HTTP method and path
- Response status code
- Request duration in milliseconds

Example:
```
[2025-01-09T12:00:00.000Z] POST /chat/completions 200 1234ms
```

## System Requirements

- **Windows**: Windows 7 or later
- **Linux**: Any modern Linux distribution
- **Network**: Internet connection to reach Sourcegraph API
- **RAM**: Minimal (typically < 50MB)
- **Disk**: ~47MB for the executable

## Building a Release (For Developers)

If you want to build your own executable from the source code:

### Prerequisites
- Node.js 18 or later
- npm or yarn

### Build Steps

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file with your configuration (see Configuration section above)

3. Build for Windows:
```bash
npm run pkg:win
```
Output: `dist/cody-oai-router.exe`

4. Build for Linux:
```bash
npm run pkg:linux
```
Output: `dist/cody-oai-router-linux`

5. Build for both platforms:
```bash
npm run build:all
```

### How It Works

The build process uses [pkg](https://github.com/vercel/pkg), which:
- Bundles the Node.js runtime with your application
- Packages all dependencies into a single executable
- Produces standalone binaries that run without Node.js installed
- Supports Windows, Linux, and macOS

## Design Philosophy (The Simple Ideas Behind This Router)

This router follows these core principles:

### 1. Minimal Transformation
Instead of building complex request/response transformations, this router only converts what's necessary:
- `system` role → wrapped as `<SYSTEM_PROMPT>content</SYSTEM_PROMPT>` in a `user` message
- `tool` role → wrapped as `<TOOL_RESULT>content</TOOL_RESULT>` in a `user` message
- All other roles pass through unchanged

This keeps it simple and predictable.

### 2. Stateless Forwarding
The router doesn't store any state between requests. Each request is independent, making it:
- Easy to debug
- No memory leaks
- Can handle multiple simultaneous connections

### 3. Performance Over Features
Optimized for speed:
- Connection pooling (reuses HTTP connections)
- 60-second timeout prevents hanging
- Only forwards necessary headers (reduces request size)
- Simple logging without expensive operations

### 4. Drop-in Compatibility
Designed to work with existing OpenAI clients:
- Same endpoint structure: `/chat/completions`
- Same request/response format
- Streaming and non-streaming both supported
- Most tools and IDEs will work without modification

### 5. Local-First Security
- Binds to `127.0.0.1` by default (only accepts local connections)
- Doesn't forward client headers to upstream (reduces attack surface)
- API token stays on your machine
- No external dependencies or cloud services

### 6. Portable by Design
- Single executable, no installation required
- Works offline (once Sourcegraph is reachable)
- Configuration via environment variables or `.env` file
- No user interface needed—just run and forget

## Notes

- The executable is built with Node.js 18 for stability and compatibility
- File size is approximately 47MB (includes Node.js runtime)
- No additional dependencies or installations required

## Security Notes

- Keep your `SOURCEGRAPH_API_TOKEN` secure
- Don't commit `.env` files to version control
- The proxy runs locally on your machine by default
- Consider using a firewall to restrict access if running on a public server

## Getting Help

If you encounter issues:
1. Check the console output for error messages
2. Verify your configuration in `.env` or environment variables
3. Ensure your Sourcegraph API token is valid
4. Check your network connection to Sourcegraph

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

This is a personal project for local use. Please refer to the Sourcegraph terms of service for API usage guidelines.
