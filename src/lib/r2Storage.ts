import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

const accountId = import.meta.env.VITE_R2_ACCOUNT_ID as string;
const accessKeyId = import.meta.env.VITE_R2_ACCESS_KEY_ID as string;
const secretAccessKey = import.meta.env.VITE_R2_SECRET_ACCESS_KEY as string;

const BUCKET_CONFIG: Record<string, { bucket: string; publicUrl: string }> = {
  gallery:    { bucket: import.meta.env.VITE_R2_BUCKET_GALLERY,    publicUrl: import.meta.env.VITE_R2_PUBLIC_URL_GALLERY },
  events:     { bucket: import.meta.env.VITE_R2_BUCKET_EVENTS,     publicUrl: import.meta.env.VITE_R2_PUBLIC_URL_EVENTS },
  sport:      { bucket: import.meta.env.VITE_R2_BUCKET_SPORT,      publicUrl: import.meta.env.VITE_R2_PUBLIC_URL_SPORT },
  facilities: { bucket: import.meta.env.VITE_R2_BUCKET_FACILITIES, publicUrl: import.meta.env.VITE_R2_PUBLIC_URL_FACILITIES },
  header:     { bucket: import.meta.env.VITE_R2_BUCKET_HEADER,     publicUrl: import.meta.env.VITE_R2_PUBLIC_URL_HEADER },
  logo:       { bucket: import.meta.env.VITE_R2_BUCKET_LOGO,       publicUrl: import.meta.env.VITE_R2_PUBLIC_URL_LOGO },
  layout:     { bucket: import.meta.env.VITE_R2_BUCKET_LAYOUT,     publicUrl: import.meta.env.VITE_R2_PUBLIC_URL_LAYOUT },
};

const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

/**
 * Upload a file to Cloudflare R2.
 * @param file   - The file to upload.
 * @param folder - The bucket key (e.g. 'gallery', 'events', 'sport', 'facilities', 'header').
 * @returns The public URL of the uploaded file.
 */
export async function uploadToR2(file: File, folder: string): Promise<string> {
  const config = BUCKET_CONFIG[folder];
  if (!config) throw new Error(`Unknown R2 bucket folder: "${folder}"`);
  const ext = file.name.split('.').pop();
  const key = `${Date.now()}.${ext}`;
  await r2Client.send(
    new PutObjectCommand({
      Bucket: config.bucket,
      Key: key,
      Body: file,
      ContentType: file.type,
    })
  );
  return `${config.publicUrl}/${key}`;
}

/**
 * Delete a file from Cloudflare R2 by its public URL.
 * Matches the URL against each bucket's public URL to find the right bucket.
 */
export async function deleteFromR2(url: string): Promise<void> {
  try {
    for (const { bucket, publicUrl } of Object.values(BUCKET_CONFIG)) {
      const base = publicUrl.endsWith('/') ? publicUrl : `${publicUrl}/`;
      if (url.startsWith(base)) {
        const key = url.slice(base.length);
        await r2Client.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
        return;
      }
    }
  } catch {
    // ignore deletion errors
  }
}
