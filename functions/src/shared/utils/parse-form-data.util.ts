import busboy from 'busboy';
import sharp from 'sharp';
import { IncomingHttpHeaders } from 'http2';
import { fromBuffer as fileTypeFromBuffer } from 'file-type';

export interface IFormDataFile {
  buffer: Buffer; // needed for saving/processing
  size: number; // for max size validation
  filename: string; // original name from client
  mimeType: string; // reported by form
  detectedMime?: string; // trustable MIME from content
  extension?: string; // from detected type
  width?: number; // only for image dimension validation
  height?: number; // only for image dimension validation
}

export interface IBookingReq {
  paymentFile: IFormDataFile;
  bookings: string[];
  email: string;
  phone: string;
  comment?: string;
  lang?: string;
  name?: string;
}

export function parseBookingFormData(
  headers: IncomingHttpHeaders,
  rawBody: Buffer,
  arrayFields?: string[]
): Promise<IBookingReq> {
  return new Promise((resolve, reject) => {
    const busboyInstance = busboy({ headers });
    const filePromises: Promise<void>[] = [];
    const reqBody: any = {};

    busboyInstance.on('file', (fieldname, file, { filename, mimeType }) => {
      const chunks: Buffer[] = [];
      let totalSize = 0;

      // Create promise for each file
      const filePromise = new Promise<void>((res, rej) => {
        file.on('data', (data: Buffer) => {
          chunks.push(data);
          totalSize += data.length;
        });

        file.on('end', async () => {
          try {
            const buffer = Buffer.concat(chunks);

            // Detect file type from content
            const detectedType = await fileTypeFromBuffer(buffer);

            // Prepare file object
            const fileData: IFormDataFile = {
              buffer,
              size: totalSize,
              filename,
              mimeType,
              extension: detectedType?.ext,
              detectedMime: detectedType?.mime
            };

            // If it's an image, get dimensions
            if (detectedType?.mime?.startsWith('image/')) {
              try {
                const imgMeta = await sharp(buffer).metadata();
                if (imgMeta.width) fileData.width = imgMeta.width;
                if (imgMeta.height) fileData.height = imgMeta.height;
              } catch (err) {
                console.warn(`Image metadata extraction failed: ${err}`);
              }
            }

            reqBody[fieldname] = fileData;
            res();
          } catch (err) {
            rej(err);
          }
        });

        file.on('error', (err) => rej(err));
      });

      filePromises.push(filePromise);
    });

    busboyInstance.on('field', (fieldname, value) => {
      if (arrayFields?.includes(fieldname)) {
        reqBody[fieldname] = JSON.parse(value);
      } else {
        reqBody[fieldname] = value;
      }
    });

    busboyInstance.on('finish', async () => {
      try {
        await Promise.all(filePromises); // wait for all async file processing
        resolve(reqBody as IBookingReq);
      } catch (err) {
        reject(err);
      }
    });

    busboyInstance.on('error', (err) => reject(err));

    busboyInstance.end(rawBody);
  });
}
