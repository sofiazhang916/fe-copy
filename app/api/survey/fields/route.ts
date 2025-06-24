// app/api/survey/fields/route.ts
import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = 'https://sales.getatlasai.co/survey-service/form';

export async function GET(req: NextRequest) {
  const formId = req.nextUrl.searchParams.get('form_id');
  if (!formId) {
    return NextResponse.json({ error: 'Missing form_id' }, { status: 400 });
  }

  const upstreamRes = await fetch(`${BASE_URL}/get-form-attributes/${formId}`, {
    headers: {
      Authorization: req.headers.get('authorization') || '',
      'Content-Type': 'application/json',
    },
  });

  let raw;
  try {
    raw = await upstreamRes.text();
  } catch (e) {
    return NextResponse.json({ error: 'Failed to read upstream response' }, { status: 502 });
  }

  if (!upstreamRes.ok) {
    console.error('[Upstream Error]', upstreamRes.status, raw);
    return NextResponse.json({ error: 'Upstream error', details: raw }, { status: upstreamRes.status });
  }

  let data;
  try {
    data = JSON.parse(raw);
  } catch (e) {
    return NextResponse.json({ error: 'Invalid JSON from upstream' }, { status: 502 });
  }

  return NextResponse.json({ content: data.content }, { status: 200 });
}
