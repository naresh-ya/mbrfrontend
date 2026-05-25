# AgentCore Integration Setup Guide

## Overview

This guide explains how to run the Next.js frontend with AgentCore integration.

## Architecture

```
User → Next.js UI → /api/excel-agent → AgentCore Runtime → Excel Agent Container
```

## Prerequisites

1. **AWS Credentials** - You need AWS credentials with permissions to invoke AgentCore
2. **AgentCore Runtime** - Your Excel Agent must be deployed to AgentCore
3. **Node.js 20+** - Required for Next.js 15

## Setup Steps

### 1. Install Dependencies

```bash
npm install
```

Dependencies include:
- `aws4` - AWS request signing
- `@aws-sdk/client-sts` - AWS credentials
- `@aws-sdk/credential-providers` - Credential loading

### 2. Configure Environment Variables

Create `.env.local` file with your AWS credentials:

```bash
# AWS Configuration
AWS_REGION=eu-west-1
AWS_ACCESS_KEY_ID=your-access-key-here
AWS_SECRET_ACCESS_KEY=your-secret-key-here

# AgentCore Configuration
AGENTCORE_RUNTIME_ARN=arn:aws:bedrock-agentcore:eu-west-1:986995923613:runtime/excelagent-P9An674D9m
```

**Security Note:** Never commit `.env.local` to git!

### 3. Run Development Server

```bash
npm run dev
```

Server starts at: `http://localhost:9002`

### 4. Open Dashboard

Navigate to: `http://localhost:9002`

You should see the main dashboard with:
- Search box at the top
- Quick prompt cards
- KPI indicators below

**To use Excel Agent:**
1. Type your question in the search box (e.g., "What is the total of brands?")
2. Press Enter or click the send button (➤)
3. Chat messages will appear below the search box
4. The page scrolls automatically as chat grows
5. Pinned indicators stay visible below the chat

Alternative: Visit `http://localhost:9002/agent` for a dedicated full-page chat interface.

## Testing

### Test Query Examples

1. **Simple query**: "What is the total of brands?"
2. **Complex query**: "Show me the 3-month moving average"
3. **Segmentation**: "Can you check the Indian segmentation file?"

### Expected Flow

1. Type question in chat input
2. Click Send (or press Enter)
3. See "Processing..." status
4. Watch streaming response appear
5. Get final answer

## Files Created

```
src/
  ├── lib/
  │   └── agentcore-config.ts          # AgentCore configuration
  ├── services/
  │   └── excel-agent-service.ts       # Frontend service layer
  ├── components/
  │   └── excel-agent/
  │       └── excel-agent-chat.tsx     # Chat UI component
  ├── app/
  │   ├── agent/
  │   │   └── page.tsx                 # Agent page
  │   └── api/
  │       └── excel-agent/
  │           └── route.ts             # Server-side API route
```

## How It Works

### 1. User Interaction

User types query in `ExcelAgentChat` component and clicks Send.

### 2. Frontend Service Call

```typescript
// src/services/excel-agent-service.ts
const answer = await askExcelAgent(query, (event) => {
  // Handle streaming events
});
```

### 3. Next.js API Route

```typescript
// src/app/api/excel-agent/route.ts
// - Signs request with AWS credentials
// - Calls AgentCore endpoint
// - Streams response back
```

### 4. AgentCore Invocation

```
POST https://bedrock-agentcore-runtime.eu-west-1.amazonaws.com/runtimes/{runtimeId}/invocations

Headers:
  - Authorization: AWS4-HMAC-SHA256 (signed)
  - Content-Type: application/json
  - Accept: text/event-stream

Body:
  {
    "threadId": "thread-xxx",
    "runId": "run-xxx",
    "messages": [{"role": "user", "content": "query"}]
  }
```

### 5. Streaming Response

AgentCore returns Server-Sent Events (SSE):

```
data: {"type": "RUN_STARTED"}
data: {"type": "STEP_STARTED", "stepName": "domain_validation"}
data: {"type": "TEXT_MESSAGE_CONTENT", "delta": "The"}
data: {"type": "TEXT_MESSAGE_CONTENT", "delta": " total"}
data: {"type": "TEXT_MESSAGE_CONTENT", "delta": " is 150"}
data: {"type": "RUN_FINISHED"}
```

### 6. UI Updates

Chat component displays streaming text in real-time.

## Troubleshooting

### Error: "Failed to call Excel Agent"

**Cause:** AWS credentials invalid or AgentCore runtime not accessible

**Fix:**
1. Check `.env.local` has correct credentials
2. Verify AgentCore runtime ARN
3. Check AWS IAM permissions:
   - `bedrock-agentcore:InvokeRuntime`

### Error: "No response stream"

**Cause:** AgentCore returned non-streaming response

**Fix:**
1. Check AgentCore logs in AWS Console
2. Verify your agent container is running
3. Test with `test_agentcore_invoke.py` script

### Chat loads but no response

**Cause:** API route error

**Fix:**
1. Check browser console for errors
2. Check Next.js terminal for server errors
3. Verify `/api/excel-agent` endpoint is accessible

## Production Deployment (AWS Amplify)

### 1. Configure Build Settings

In Amplify console:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm install
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
      - .next/cache/**/*
```

### 2. Set Environment Variables

In Amplify Console → Environment variables:

```
AWS_REGION = eu-west-1
AGENTCORE_RUNTIME_ARN = arn:aws:bedrock-agentcore:eu-west-1:...
```

### 3. Use IAM Role (Recommended)

Instead of hardcoded credentials, attach IAM role to Amplify:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "bedrock-agentcore:InvokeRuntime",
      "Resource": "arn:aws:bedrock-agentcore:eu-west-1:986995923613:runtime/excelagent-*"
    }
  ]
}
```

## Next Steps

1. ✅ Test locally: `npm run dev` → `http://localhost:9002/agent`
2. ✅ Add link to agent page from main dashboard
3. ✅ Customize UI styling to match your design
4. ✅ Add authentication (if needed)
5. ✅ Deploy to AWS Amplify

## Support

For issues:
1. Check this guide
2. Review browser console errors
3. Check Next.js server logs
4. Test AgentCore with Python script first
