import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const token = request.headers.get('authorization') || '';

        const res = await fetch(
            'https://sales.getatlasai.co/survey-service/form/create-form',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token,
                },
                body: JSON.stringify(body),
            }
        );

        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch (err: any) {
        console.error('Create-form API error:', err);
        return NextResponse.json(
            { message: err.message || 'Internal server error' },
            { status: 500 }
        );
    }
}