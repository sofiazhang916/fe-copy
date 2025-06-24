import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = 'https://sales.getatlasai.co/survey-service/form';

export async function GET(req: NextRequest) {
//   const doctorId = req.nextUrl.searchParams.get('doctor_id');
  const doctorId = 'b979d98e-8011-7080-ec48-3e9d0ce6908f';
  if (!doctorId) {
    return NextResponse.json({ error: 'Missing doctor_id' }, { status: 400 });
  }

  const upstream = await fetch(`${BASE_URL}/view-workspace-forms/${doctorId}`, {
    headers: {
      Authorization: req.headers.get('authorization') || '',
    },
  });

  const data = await upstream.json();
  return NextResponse.json(data, { status: upstream.status });
}
