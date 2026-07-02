import type { APIRoute } from 'astro';

// 健康检查接口 - 用于调试
export const GET: APIRoute = async () => {
  const MONGODB_URI = import.meta.env.MONGODB_URI || process.env.MONGODB_URI;
  
  return Response.json({
    success: true,
    message: 'API 正常工作',
    timestamp: new Date().toISOString(),
    env: {
      hasMongoUri: !!MONGODB_URI,
      mongoUriPrefix: MONGODB_URI?.substring(0, 30) + '...'
    }
  });
};
