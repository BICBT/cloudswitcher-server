import { OutputSettings } from 'obs-node';

export type SourceType = 'Live' | 'Media';

export interface Scene {
  id: string;
  name: string;
  sources: Source[];
}

export interface Source {
  id: string;
  name: string;
  type: SourceType;
  url: string;
  previewUrl: string;
  md5?: string;
  startOnActive?: boolean;
  output?: OutputSettings;
}
