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
  hardwareDecoder?: boolean;
  startOnActive?: boolean;
  fpsNum?: number;
  fpsDen?: number;
  samplerate?: number;
  output?: OutputSettings;
}

export interface Dsk {
  id: string;
  url: string;
  position: string;
  top: number;
  left: number;
  width: number;
  height: number;
}
