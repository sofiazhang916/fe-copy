import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = 'https://sales.getatlasai.co/survey-service/form';

export async function GET(req: NextRequest) {
  const formId = req.nextUrl.searchParams.get('form_id');
  if (!formId) {
    return NextResponse.json({ error: 'Missing form_id' }, { status: 400 });
  }

  const upstream = await fetch(`${BASE_URL}/view-all-responses/${formId}`, {
    headers: {
      Authorization: req.headers.get('authorization') || '',
    },
  });

  const data = await upstream.json();
  return NextResponse.json(data, { status: upstream.status });
}
