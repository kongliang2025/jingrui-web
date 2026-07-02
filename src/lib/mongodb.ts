import { MongoClient, Db } from 'mongodb';

// 数据库连接配置 - 从环境变量读取
const MONGODB_URI = process.env.MONGODB_URI || '';
const DB_NAME = process.env.DB_NAME || 'property-evidence';

// 全局变量缓存连接（用于热启动复用）
let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

/**
 * 获取 MongoDB 数据库连接（Vercel Serverless 优化版）
 * 
 * 特点：
 * 1. 支持连接复用（热启动）
 * 2. 自动检测并处理断开的连接
 * 3. 专为 Vercel 无服务器函数优化
 */
export async function getDatabase(): Promise<Db> {
  // 验证环境变量
  if (!MONGODB_URI) {
    throw new Error('未配置 MONGODB_URI 环境变量');
  }

  // 如果有缓存的连接，先测试是否可用
  if (cachedClient && cachedDb) {
    try {
      // ping 测试连接是否存活
      await cachedDb.admin().ping();
      return cachedDb;
    } catch (error) {
      console.log('⚠️ MongoDB 连接已失效，正在重建...');
      // 连接已关闭，清理缓存
      try {
        await cachedClient.close().catch(() => {});
      } catch (e) {
        // 忽略关闭错误
      }
      cachedClient = null;
      cachedDb = null;
    }
  }

  // 创建新连接
  try {
    const client = new MongoClient(MONGODB_URI, {
      // Serverless 环境优化配置
      maxPoolSize: 10,              // 最大连接数
      minPoolSize: 0,               // 最小连接数（Serverless 设为 0 避免空闲连接浪费）
      maxIdleTimeMS: 10000,         // 空闲连接 10 秒后关闭
      connectTimeoutMS: 10000,      // 连接超时 10 秒
      socketTimeoutMS: 30000,       // Socket 超时 30 秒
      serverSelectionTimeoutMS: 5000, // 服务器选择超时 5 秒
      
      // 重试策略
      retryWrites: true,            // 自动重试写入
      retryReads: true,             // 自动重试读取
    });

    console.log('🔗 正在连接 MongoDB...');
    await client.connect();
    
    const db = client.db(DB_NAME);
    
    // 缓存连接以供后续请求复用（热启动）
    cachedClient = client;
    cachedDb = db;
    
    console.log('✅ MongoDB 连接成功！');
    return db;

  } catch (error) {
    console.error('❌ MongoDB 连接失败:', error);
    // 清理失败的连接状态
    cachedClient = null;
    cachedDb = null;
    throw error;
  }
}

/**
 * 安全关闭数据库连接（通常不需要调用）
 * 在 Serverless 环境中，让系统自动管理连接生命周期
 */
export async function closeDatabase(): Promise<void> {
  if (cachedClient) {
    try {
      await cachedClient.close();
      console.log('🔒 MongoDB 连接已关闭');
    } catch (e) {
      // 忽略关闭错误
    } finally {
      cachedClient = null;
      cachedDb = null;
    }
  }
}
