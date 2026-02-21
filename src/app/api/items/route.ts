import { NextResponse } from 'next/server';
import { getAllItems, addItem } from '@/lib/db';

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

    try {
        const newItem = await addItem(title);
        return NextResponse.json(newItem, { status: 201 });
    } catch (error) {
        console.error('Error adding item to Firestore:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
