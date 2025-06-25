// app/api/sendEmail/route.ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  let payload: { to?: string; subject?: string; body?: string };
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid JSON payload" },
      { status: 400 }
    );
  }

  const { to, subject, body } = payload;
  if (!to || !subject || !body) {
    return NextResponse.json(
      { success: false, message: "Missing `to`, `subject` or `body`" },
      { status: 400 }
    );
  }

  // build a real multipart/form-data body
  const form = new FormData();
  form.append("email_to", to);
  form.append("email_subject", subject);
  form.append("email_body", body);

  const atlasToken = request.headers.get("authorization") ?? "";
  try {
    const res = await fetch(
      "https://sales.getatlasai.co/message-service/communication_api/v1/messages/sendSampleEmail",
      {
        method: "POST",
        headers: {
          // let fetch set Content-Type with boundary
          Authorization: atlasToken.startsWith("Bearer ")
            ? atlasToken
            : `Bearer ${atlasToken}`,
        },
        body: form,
      }
    );

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      console.error("External email API error:", JSON.stringify(data, null, 2));
      return NextResponse.json(
        {
          success: false,
          message: data.message || "Email send failed",
          detail: data.detail,
        },
        { status: res.status }
      );
    }

    return NextResponse.json(
      { success: true, message: "Email sent", data },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Error in sendEmail API:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Internal error" },
      { status: 500 }
    );
  }
}
