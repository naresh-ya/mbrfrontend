/**
 * AgentCore Configuration
 * Update these values based on your AgentCore deployment
 */

// Helper function to build AgentCore endpoint from ARN
function buildAgentCoreEndpoint(runtimeArn: string, region: string, qualifier: string): string {
  // URL-encode the full ARN as required by AgentCore
  const escapedArn = encodeURIComponent(runtimeArn);
  let url = `https://bedrock-agentcore.${region}.amazonaws.com/runtimes/${escapedArn}/invocations`;

  // Only add qualifier if explicitly set and not empty
  if (qualifier && qualifier.trim()) {
    url += `?qualifier=${qualifier}`;
  }

  return url;
}

// Configuration for iSynesis Insights AgentCore (main insights backend)
export const AGENTCORE_CONFIG = {
  // iSynesis Insights AgentCore runtime ARN
  runtimeArn: process.env.AGENTCORE_RUNTIME_ARN ||
    'arn:aws:bedrock-agentcore:eu-west-1:986995923613:runtime/isynesis_insights_agentcore_v2-4WwPTUEtrz',

  // AWS Region
  region: process.env.AWS_REGION || 'eu-west-1',

  // Extract runtime ID from ARN
  get runtimeId() {
    return this.runtimeArn.split('/').pop() || '';
  },

  // AgentCore endpoint URL
  get endpoint() {
    if (process.env.AGENTCORE_ENDPOINT) {
      return process.env.AGENTCORE_ENDPOINT;
    }
    return buildAgentCoreEndpoint(this.runtimeArn, this.region, this.qualifier);
  },

  // Endpoint qualifier (empty by default - set via AGENTCORE_ENDPOINT_QUALIFIER env var)
  qualifier: process.env.AGENTCORE_ENDPOINT_QUALIFIER || '',
};

// Configuration for Excel Agent AgentCore
export const EXCEL_AGENT_CONFIG = {
  // Excel Agent AgentCore runtime ARN
  runtimeArn: process.env.AGENTCORE_EXCEL_ARN ||
    'arn:aws:bedrock-agentcore:eu-west-1:986995923613:runtime/excelagent-P9An674D9m',

  // AWS Region
  region: process.env.AWS_REGION || 'eu-west-1',

  // Extract runtime ID from ARN
  get runtimeId() {
    return this.runtimeArn.split('/').pop() || '';
  },

  // AgentCore endpoint URL
  get endpoint() {
    if (process.env.AGENTCORE_EXCEL_ENDPOINT) {
      return process.env.AGENTCORE_EXCEL_ENDPOINT;
    }
    return buildAgentCoreEndpoint(this.runtimeArn, this.region, this.qualifier);
  },

  // Endpoint qualifier (empty by default - set via AGENTCORE_ENDPOINT_QUALIFIER env var)
  qualifier: process.env.AGENTCORE_ENDPOINT_QUALIFIER || '',
};
