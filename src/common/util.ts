import * as crypto from 'crypto';
import * as fs from 'fs';
import * as https from 'https';
import * as stream from 'stream';
import * as path from 'path';
import * as os from 'os';

export async function md5(path: string): Promise<string | undefined> {
  const md5 = crypto.createHash('md5');
  if (!fs.existsSync(path)) {
    return;
  }
  return new Promise((resolve, reject) => {
    const stream = fs.createReadStream(path);
    stream.on('data', (data) => {
      md5.update(data);
    });
    stream.on('end', () => {
      resolve(md5.digest('hex'));
    });
    stream.on('error', error => {
      reject(error);
    });
  });
}

export async function downloadFile(url: string, filePath: string): Promise<void> {
  const fileName = path.basename(filePath);
  // create temporary folder
  const tempFolder = await fs.promises.mkdtemp(path.join(os.tmpdir()));
  // download to temporary file
  const tempFilePath = path.join(tempFolder, fileName);
  const tempFile = fs.createWriteStream(tempFilePath);
  return new Promise((resolve, reject) => {
    https.get(url, response => {
      stream.pipeline(response, tempFile, error => {
        if (error) {
          reject(error);
        } else {
          // copy temp file to target
          fs.rename(tempFilePath, filePath, error => {
            if (error) {
              reject(error);
            } else {
              resolve();
            }
          });
        }
      });
    });
  });
}
