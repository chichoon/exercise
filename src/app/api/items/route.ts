import { NextResponse } from 'next/server';
import { getDb, Item } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid'; // We need uuid, I should install it or use crypto.randomUUID

export async function GET() {
    const db = await getDb();
    await db.read();
    return NextResponse.json(db.data.items);
}

export async function POST(request: Request) {
    const body = await request.json();
    const { title } = body;

    if (!title) {
        return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const db = await getDb();
    await db.read();

    const newItem: Item = {
        id: crypto.randomUUID(),
        title,
        createdAt: new Date().toISOString(),
    };

    db.data.items.push(newItem);
    await db.write();

    return NextResponse.json(newItem, { status: 201 });
}
