import type { APIRoute } from 'astro';
import { MongoClient, ObjectId } from 'mongodb';
import type { Evidence } from '../../lib/types';

// 数据库连接配置
const MONGODB_URI = import.meta.env.MONGODB_URI || process.env.MONGODB_URI;
const DB_NAME = import.meta.env.DB_NAME || process.env.DB_NAME || 'property-evidence';

let client: MongoClient | null = null;

async function getDb() {
  if (!client) {
    if (!MONGODB_URI) {
      throw new Error('未配置 MONGODB_URI 环境变量，请在 .env 文件中设置');
    }
    
    console.log('正在连接 MongoDB...');
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('MongoDB 连接成功！');
  }
  
  return client.db(DB_NAME);
}

// 清理不符合规则的数据
export const POST: APIRoute = async ({ request }) => {
  try {
    const db = await getDb();
    const collection = db.collection<Evidence>('evidences');

    // 获取所有数据
    const allData = await collection.find({}).toArray();
    
    // 验证规则
    const roomNumberRegex = /^[0-9-]+$/;  // 房号：只允许数字和横杠，至少2位
    const phoneRegex = /^1[3-9]\d{9}$/;   // 手机号：中国大陆11位手机号
    
    // 找出不符合规则的记录ID
    const invalidIds: string[] = [];
    const invalidDetails: Array<{ id: string; roomNumber: string; contact: string; reason: string }> = [];

    for (const item of allData) {
      const reasons: string[] = [];
      
      // 检查房号
      if (!item.roomNumber || !roomNumberRegex.test(item.roomNumber) || item.roomNumber.length < 2) {
        reasons.push(`房号格式错误: "${item.roomNumber}"`);
      }
      
      // 检查手机号
      if (!item.contact || !phoneRegex.test(item.contact)) {
        reasons.push(`手机号格式错误: "${item.contact}"`);
      }

      if (reasons.length > 0) {
        invalidIds.push(item._id.toString());
        invalidDetails.push({
          id: item._id.toString(),
          roomNumber: item.roomNumber,
          contact: item.contact,
          reason: reasons.join('; ')
        });
      }
    }

    // 如果没有需要删除的数据
    if (invalidIds.length === 0) {
      return Response.json({
        success: true,
        message: '所有数据均符合规则，无需清理',
        deletedCount: 0,
        totalChecked: allData.length,
        invalidRecords: []
      });
    }

    // 删除不符合规则的记录
    const objectIds = invalidIds.map(id => new ObjectId(id));
    const deleteResult = await collection.deleteMany({ _id: { $in: objectIds } });

    return Response.json({
      success: true,
      message: `成功清理 ${deleteResult.deletedCount} 条不符合规则的数据`,
      deletedCount: deleteResult.deletedCount,
      totalChecked: allData.length,
      invalidRecords: invalidDetails
    });

  } catch (error: any) {
    console.error('清理数据失败:', error?.message || error);
    return Response.json({
      success: false,
      error: error?.message || '服务器内部错误'
    }, { status: 500 });
  }
};
