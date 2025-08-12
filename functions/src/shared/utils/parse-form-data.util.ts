import busboy from 'busboy';
// import sharp from 'sharp';
import { IncomingHttpHeaders } from 'http2';
import { Readable } from 'stream';
import { fromBuffer as fileTypeFromBuffer } from 'file-type';

export interface IFileMetadata {
  originalName: string;
  reportedMime: string;
  detectedMime: string;
  extension?: string;
  size: number;
  width?: number;   // only for images
  height?: number;  // only for images
}

export interface IFormDataFile {
  buffer: Buffer;
  size: number;
  filename: string;
  encoding: string;
  mimeType: string;
  detectedType?: { mime: string; ext: string };
  metadata?: IFileMetadata;
}

export type IFormDataBody = Record<string, string | IFormDataFile>;

export function getFieldsFromFormData(
  headers: IncomingHttpHeaders,
  rawBody: Buffer
): Promise<IFormDataBody> {
  return new Promise((resolve, reject) => {
    const busboyInstance = busboy({ headers });
    const reqBody: IFormDataBody = {};

    busboyInstance.on(
      'file',
      async (
        fieldname: string,
        file: Readable,
        { filename, encoding, mimeType }: { filename: string; encoding: string; mimeType: string }
      ) => {
        const chunks: Buffer[] = [];
        let totalSize = 0;

        file.on('data', (data: Buffer) => {
          chunks.push(data);
          totalSize += data.length;
        });

        file.on('end', async () => {
          const buffer = Buffer.concat(chunks);

          // Detect file type from content
          const detectedType = await fileTypeFromBuffer(buffer);

          // Build metadata
          const metadata: IFileMetadata = {
            originalName: filename,
            reportedMime: mimeType,
            detectedMime: detectedType?.mime || mimeType,
            extension: detectedType?.ext,
            size: totalSize
          };

          // Add extra image info
          if (detectedType?.mime.startsWith('image/')) {
            // try {
            //   const imgMeta = await sharp(buffer).metadata();
            //   if (imgMeta.width) metadata.width = imgMeta.width;
            //   if (imgMeta.height) metadata.height = imgMeta.height;
            // } catch (err) {
            //   console.warn(`Image metadata extraction failed: ${err}`);
            // }
          }

          reqBody[fieldname] = {
            buffer,
            size: totalSize,
            filename,
            encoding,
            mimeType,
            detectedType,
            metadata
          };
        });

        file.on('error', (err) => reject(err));
      }
    );

    busboyInstance.on('field', (fieldname: string, value: string) => {
      reqBody[fieldname] = value;
    });

    busboyInstance.on('finish', () => resolve(reqBody));
    busboyInstance.on('error', (err) => reject(err));

    busboyInstance.end(rawBody);
  });
}
