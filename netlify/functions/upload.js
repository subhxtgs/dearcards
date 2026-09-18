import { put } from '@vercel/blob';
import { randomUUID } from 'node:crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    res.status(500).json({
      error: 'Blob storage is not connected to this project. In Vercel: Storage > create/connect a Blob store, then redeploy.'
    });
    return;
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const { image } = body;
    if (!image) {
      res.status(400).json({ error: 'No image provided.' });
      return;
    }

    const match = /^data:(image\/\w+);base64,(.+)$/.exec(image);
    if (!match) {
      res.status(400).json({ error: 'Invalid image data.' });
      return;
    }

    const contentType = match[1];
    const buffer = Buffer.from(match[2], 'base64');
    const ext = contentType.split('/')[1] || 'jpg';

    const blob = await put(`memories/${randomUUID()}.${ext}`, buffer, {
      access: 'public',
      contentType,
      addRandomSuffix: false
    });

    res.status(200).json({ url: blob.url });
  } catch (err) {
    console.error('upload failed:', err);
    res.status(500).json({ error: 'Could not upload the photo: ' + (err?.message || 'unknown error') });
  }
}
