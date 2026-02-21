import { NextResponse } from 'next/server';
import { getAllItems, getDbForDate, Item } from '@/lib/db';

export async function GET() {
    const items = await getAllItems();
    return NextResponse.json(items);
}

export async function POST(request: Request) {
    const body = await request.json();
    const { title } = body;

    if (!title) {
        return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const now = new Date();
    const newItem: Item = {
        id: crypto.randomUUID(),
        title,
        createdAt: now.toISOString(),
    };

    const db = await getDbForDate(now);
    await db.read();
    db.data.items.push(newItem);
    await db.write();

    return NextResponse.json(newItem, { status: 201 });
}
