import type { APIRoute } from 'astro';
import { getDatabase } from '../../lib/mongodb';
import type { Evidence } from '../../lib/types';

// GET - 获取所有证据列表
export const GET: APIRoute = async ({ url }) => {
  try {
    const db = await getDatabase();
    const collection = db.collection<Evidence>('evidences');
    
    // 支持分页和状态筛选
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const status = url.searchParams.get('status');

    const query: Record<string, unknown> = {};
    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;
    
    const [evidences, total] = await Promise.all([
      collection
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      collection.countDocuments(query)
    ]);

    return new Response(JSON.stringify({
      success: true,
      data: evidences,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('获取证据列表失败:', error);
    return new Response(JSON.stringify({
      success: false,
      error: '服务器内部错误'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};

// POST - 创建新证据
export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { roomNumber, contact, description, images, agreedToDeclaration } = body;

    // 验证必填字段
    if (!roomNumber || !contact || !description || !agreedToDeclaration) {
      return new Response(JSON.stringify({
        success: false,
        error: '请填写所有必填字段并同意真实性承诺'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    const db = await getDatabase();
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

    return new Response(JSON.stringify({
      success: true,
      data: {
        id: result.insertedId,
        ...newEvidence
      }
    }), {
      status: 201,
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('创建证据失败:', error);
    return new Response(JSON.stringify({
      success: false,
      error: '服务器内部错误'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
