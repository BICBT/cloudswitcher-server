import * as path from 'path';
import * as fs from 'fs';
import { createHttpServer } from './common/http';
import { routes } from './route';
import { PORT } from './common/constant';
import * as obs from 'obs-node';
import { cacheFolder, dsk, scenes, settings } from './common/config';
import { Source } from './common/types';
import { downloadFile, md5 } from './common/util';

async function cacheMedia(source: Source): Promise<string> {
  const cachePath = path.join(cacheFolder, 'media', source.id);
  console.log(`Downloading file from ${source.url} to ${cachePath}`);
  if (fs.existsSync(cachePath) && await md5(cachePath) === source.md5) {
    console.log(`Skip download file because md5 matched.`);
    return cachePath;
  }
  const parent = path.dirname(cachePath);
  if (!fs.existsSync(parent)) {
    fs.mkdirSync(parent, { recursive: true });
  }
  await downloadFile(source.url, cachePath);
  console.log(`Downloaded file from ${source.url} to ${cachePath}`);
  return cachePath;
}

(async () => {
  const httpOptions = {
    routes: routes,
    port: Number(PORT)
  };

  obs.startup(settings);

  for (const scene of scenes) {
    obs.addScene(scene.id);
    for (const source of scene.sources) {
      obs.addSource(scene.id, source.id, {
        isFile: source.type === 'Media',
        type: 'MediaSource',
        url: source.type === 'Media' ? await cacheMedia(source) : source.url,
        hardwareDecoder: false,
        startOnActive: source.startOnActive ?? false,
        output: source.output,
      });
    }
  }

  dsk.forEach(d => {
    obs.addDSK(d.id, d.position as obs.Position, d.url, d.left, d.top, d.width, d.height);
  });

  createHttpServer(httpOptions)
    .catch(error => console.log(`Failed to create http server: ${error}`));

})();
