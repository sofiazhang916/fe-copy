import { NextRequest, NextResponse } from 'next/server'

const BASE_URL = 'https://sales.getatlasai.co/profile-service/api/v1'

export async function GET(req: NextRequest) {
    console.log("API hit:", req.url)
    const { searchParams } = new URL(req.url)

    const type = searchParams.get('type')
    const doctorId = searchParams.get('doctor_id')
    const date = searchParams.get('date')
    const start = searchParams.get('start')
    const end = searchParams.get('end')
    const month = searchParams.get('month')
    const year = searchParams.get('year')

    console.log({ type, doctorId, date, start, end, month, year })

    let fetchUrl = ''

    switch (type) {
        case 'day':
            fetchUrl = `${BASE_URL}/calendar/view-daily-calendar/?doctor_id=${doctorId}&date=${date}`
            break
        case 'week':
            fetchUrl = `${BASE_URL}/calendar/view-weekly-calendar/?doctor_id=${doctorId}&start_date=${start}&end_date=${end}`
            break
        case 'month':
            fetchUrl = `${BASE_URL}/calendar/view-monthly-calendar/?doctor_id=${doctorId}&month=${searchParams.get('month')}&year=${searchParams.get('year')}`
            break
        case 'list':
            fetchUrl = `${BASE_URL}/appointment/view-appointments-list/${doctorId}`
            break
        default:
            return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
    }

    try {
        const token = req.headers.get('authorization') || ''
        console.log("[API] Fetching calendar data from:", fetchUrl)
        const res = await fetch(fetchUrl, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                ...(token && { Authorization: token }),
            },
        })

        if (!res.ok) {
            const text = await res.text()
            console.error(`Upstream fetch failed [${res.status}]:`, text)
            return NextResponse.json({ error: 'Upstream request failed', status: res.status }, { status: res.status })
        }

        const data = await res.json()
        return NextResponse.json(data)
    } catch (error) {
        console.error('API proxy error:', error)
        return NextResponse.json({ error: 'Failed to fetch from upstream' }, { status: 500 })
    }
}
