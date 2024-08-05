import bucket from "./firebaseConfig";

export async function uploadImage(imageBuffer: Buffer, filename: string): Promise<string> {
  const file = bucket.file(filename);
  await file.save(imageBuffer, {
    metadata: { contentType: 'image/jpeg' }, // Ajusta el tipo MIME según sea necesario
    public: true, // Si deseas que la imagen sea pública
  });

  return file.publicUrl();
}

export async function getImageUrl(filename: string): Promise<string> {
  const file = bucket.file(filename);
  const [url] = await file.getSignedUrl({
    action: 'read',
    expires: '03-01-2500' // Ajusta la fecha de expiración según sea necesario
  });

  return url;
}
