import { NextResponse } from 'next/server';

export async function DELETE(request: Request) {
    try {
        const url = new URL(request.url);
        const form_id = url.searchParams.get('form_id');
        const token = request.headers.get('authorization') || '';

        if (!form_id) {
            return NextResponse.json({ message: 'form_id missing' }, { status: 400 });
        }

        // Forward to external delete-form endpoint
        const res = await fetch(
            `https://sales.getatlasai.co/survey-service/form/delete-form?form_id=${form_id}`,
            {
                method: 'DELETE',
                headers: { Authorization: token },
            }
        );

        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch (err: any) {
        console.error('Delete-form API error:', err);
        return NextResponse.json(
            { message: err.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
