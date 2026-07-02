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

// GET - 获取所有证据列表
export const GET: APIRoute = async ({ url }) => {
  try {
    const db = await getDb();
    const collection = db.collection<Evidence>('evidences');
    
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');

    const query: Record<string, unknown> = {};

    const skip = (page - 1) * limit;
    
    const [evidences, total] = await Promise.all([
      collection.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray(),
      collection.countDocuments(query)
    ]);

    return Response.json({
      success: true,
      data: evidences,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    });

  } catch (error: any) {
    console.error('获取证据列表失败:', error?.message || error);
    return Response.json({
      success: false,
      error: error?.message || '服务器内部错误'
    }, { status: 500 });
  }
};

// DELETE - 删除证据
export const DELETE: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return Response.json({
        success: false,
        error: '缺少记录ID'
      }, { status: 400 });
    }

    const db = await getDb();
    const collection = db.collection<Evidence>('evidences');

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return Response.json({
        success: false,
        error: '记录不存在或已删除'
      }, { status: 404 });
    }

    return Response.json({
      success: true,
      message: '删除成功'
    });

  } catch (error: any) {
    console.error('删除证据失败:', error?.message || error);
    return Response.json({
      success: false,
      error: error?.message || '服务器内部错误'
    }, { status: 500 });
  }
};

// POST - 创建新证据
export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { roomNumber, contact, description, images, agreedToDeclaration } = body;

    // 验证必填字段
    if (!roomNumber || !contact || !description || !agreedToDeclaration) {
      return Response.json({
        success: false,
        error: '请填写所有必填字段并同意真实性承诺'
      }, { status: 400 });
    }

    const db = await getDb();
    const collection = db.collection<Evidence>('evidences');

    const newEvidence: Omit<Evidence, '_id'> = {
      roomNumber,
      contact,
      description,
      images: images || [],
      agreedToDeclaration: true,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await collection.insertOne(newEvidence as Evidence);

    return Response.json({
      success: true,
      data: { id: result.insertedId, ...newEvidence }
    }, { status: 201 });

  } catch (error: any) {
    console.error('创建证据失败:', error?.message || error);
    return Response.json({
      success: false,
      error: error?.message || '服务器内部错误'
    }, { status: 500 });
  }
};
