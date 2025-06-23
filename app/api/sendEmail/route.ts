import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    
    const response = await fetch("https://sales.getatlasai.co/message-service/communication_api/v1/messages/sendSampleEmail", {
      method: 'POST',
      body: formData
    })

    const data = await response.text()
    
    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: response.status }
      )
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error in sendEmail API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 