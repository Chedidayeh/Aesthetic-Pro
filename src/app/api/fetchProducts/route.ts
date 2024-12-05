import { db } from '@/db';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);

  if (isNaN(page) || isNaN(limit) || page <= 0 || limit <= 0) {
    return NextResponse.json({ error: 'Invalid page or limit parameters' }, { status: 400 });
  }

  try {
    const offset = (page - 1) * limit;

    const products = await db.product.findMany({
      skip: offset,
      take: limit,
      orderBy: {
        totalViews: 'desc',
      },
      include: {
        store: true,
      },
    });

    const totalCount = await db.product.count();

    return NextResponse.json({ products, totalCount });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
