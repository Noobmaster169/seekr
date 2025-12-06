# Claude API Model Testing

The extension is currently using: `claude-3-sonnet-20240229`

If this doesn't work, try these alternative models:

1. `claude-3-5-sonnet-20241022` (newest)
2. `claude-3-5-sonnet` (without date)
3. `claude-3-opus-20240229`
4. `claude-3-sonnet-20240229` (current)
5. `claude-3-haiku-20240307` (fastest/cheapest)

To check available models:
1. Go to https://console.anthropic.com/
2. Check your API key permissions
3. Look at the API documentation for available models

To test the API key directly:
```bash
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: YOUR_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d '{
    "model": "claude-3-sonnet-20240229",
    "max_tokens": 1024,
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

