import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = 'https://sales.getatlasai.co/survey-service/form';

export async function GET(req: NextRequest) {
  const formId = req.nextUrl.searchParams.get('form_id');
  const responseId = req.nextUrl.searchParams.get('response_id');

  if (!formId || !responseId) {
    return NextResponse.json({ error: 'Missing form_id or response_id' }, { status: 400 });
  }

  const upstream = await fetch(`${BASE_URL}/view-response?form_id=${formId}&response_id=${responseId}`, {
    headers: {
      Authorization: req.headers.get('authorization') || '',
    },
  });

  const data = await upstream.json();
  return NextResponse.json(data, { status: upstream.status });
}
