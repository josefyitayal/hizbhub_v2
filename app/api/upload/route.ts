import { NextResponse } from 'next/server'
import type { UploadApiResponse } from 'cloudinary';
import cloudinary from '@/lib/cloudinary'

export const dynamic = 'force-dynamic' // Avoid Edge timeout

export async function POST(req: Request) {
    try {
        const formData = await req.formData()
        const file = formData.get('file')

        if (!file || !(file instanceof Blob)) {
            return NextResponse.json({ error: 'Invalid or missing file' }, { status: 400 })
        }

        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        const upload = await new Promise<UploadApiResponse>((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: 'websites', resource_type: 'auto' },
                (error, result) => {
                    if (error) return reject(error)
                    resolve(result as UploadApiResponse)
                }
            )

            stream.write(buffer)
            stream.end()
        })

        return NextResponse.json({ url: upload.secure_url })
    } catch (err) {
        console.error('[UPLOAD_ERROR]', err)
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
    }
}
