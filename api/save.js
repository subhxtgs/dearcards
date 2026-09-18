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
    const payload = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const id = randomUUID();

    const blob = await put(`letters/${id}.json`, JSON.stringify(payload), {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false
    });

    res.status(200).json({ url: blob.url });
  } catch (err) {
    // surface the real reason so this is debuggable instead of a generic failure
    console.error('save failed:', err);
    res.status(500).json({ error: 'Could not save the letter: ' + (err?.message || 'unknown error') });
  }
}
