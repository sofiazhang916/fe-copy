// app/api/survey/form/delete-form/[form_id]/route.ts
import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function DELETE(
    request: Request,
    { params }: { params: { form_id: string } }
) {
    const form_id = params.form_id
    if (!form_id) {
        return NextResponse.json({ message: 'Missing form_id' }, { status: 400 })
    }

    // 1) proxy the delete upstream
    const upstream = await fetch(
        `https://sales.getatlasai.co/survey-service/form/delete-form/${form_id}`,
        { method: 'DELETE' }
    )
    if (!upstream.ok) {
        const err = await upstream.text().catch(() => upstream.statusText)
        return NextResponse.json({ message: err }, { status: upstream.status })
    }

    // 2) force Next.js to re-fetch your list & fields endpoints on the next call
    revalidatePath('/api/survey/template')
    // if you also cache or tag your /api/survey/fields route, revalidate that too
    // (or you can just always fetch that with `cache: 'no-store'` on the client)

    // 3) finally, respond success
    return NextResponse.json({ message: 'Deleted' }, { status: 200 })
}
