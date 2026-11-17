export interface User {
  id: number;
  username: string;
  token?: string;
}

export interface ManifestFile {
  name: string;
  version: string;
  url: string;
  hash: string;
  path: string;
}

export interface Manifest {
  version: string;
  java: ManifestFile;
  client: ManifestFile;
  mods: ManifestFile[];
  resourcepacks: ManifestFile[];
  shaderpacks: ManifestFile[];
}

export interface DownloadProgress {
  fileName: string;
  progress: number;
  status: string;
}

export interface LauncherConfig {
  cdn_url: string;
  server: {
    ip: string;
    port: number;
  };
  ram: {
    default: number;
    min: number;
    max: number;
  };
}
