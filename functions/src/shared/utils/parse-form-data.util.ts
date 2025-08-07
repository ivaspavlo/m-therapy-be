import busboy from 'busboy';
import { IncomingHttpHeaders } from 'http2';
import { Readable } from 'stream';

export interface IFormDataFile {
  buffer: Buffer;
  size: number;
  filename: string;
  encoding: string;
  mimeType: string;
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
      (
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

        file.on('end', () => {
          reqBody[fieldname] = {
            buffer: Buffer.concat(chunks),
            size: totalSize,
            filename,
            encoding,
            mimeType,
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
