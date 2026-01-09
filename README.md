# Cody OAI Router - Portable Executable

A simple proxy server for Sourcegraph's chat API that can be used as a drop-in replacement for OpenAI's API.

## Quick Start

### Windows
1. Double-click `cody-oai-router.exe`
2. A console window will open showing the server status
3. The server will start on `http://localhost:3000`

### Linux
1. Make the file executable: `chmod +x cody-oai-router-linux`
2. Run the file: `./cody-oai-router-linux`
3. The server will start on `http://localhost:3000`

## Configuration

The proxy can be configured in two ways:

### Option 1: Using a .env file (Recommended)
1. Copy `.env.example` to `.env` in the same directory as the executable
2. Edit `.env` with your configuration
3. Restart the executable

### Option 2: Using Environment Variables
Set environment variables before running the executable:

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
curl http://localhost:3000/chat/completions \
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

This is a personal project for local use. Please refer to the Sourcegraph terms of service for API usage guidelines.
