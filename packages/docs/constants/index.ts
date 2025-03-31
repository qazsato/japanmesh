export const MAP_STYLE = {
  LIGHT: 'https://api.protomaps.com/styles/v4/white/ja.json?key=afde32549db516d8',
  DARK: 'https://api.protomaps.com/styles/v4/black/ja.json?key=afde32549db516d8'
}

export const MESH_LEVELS = [
  {
    id: 80000,
    minZoom: 4,
    maxZoom: 8,
    level: '80km',
    name: '80倍地域メッシュ(第1次地域区画)',
  },
  {
    id: 10000,
    minZoom: 8,
    maxZoom: 11,
    level: '10km',
    name: '10倍地域メッシュ(第2次地域区画)',
  },
  {
    id: 5000,
    minZoom: 11,
    maxZoom: 12,
    level: '5km',
    name: '5倍地域メッシュ',
  },
  {
    id: 2000,
    minZoom: 12,
    maxZoom: 13,
    level: '2km',
    name: '2倍地域メッシュ',
  },
  {
    id: 1000,
    minZoom: 13,
    maxZoom: 14,
    level: '1km',
    name: '基準地域メッシュ(第3次地域区画)',
  },
  {
    id: 500,
    minZoom: 14,
    maxZoom: 15,
    level: '500m',
    name: '2分の1地域メッシュ',
  },
  {
    id: 250,
    minZoom: 15,
    maxZoom: 16,
    level: '250m',
    name: '4分の1地域メッシュ',
  },
  {
    id: 125,
    minZoom: 16,
    maxZoom: 18,
    level: '125m',
    name: '8分の1地域メッシュ',
  }
]