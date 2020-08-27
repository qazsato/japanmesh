const MESH = {
  // 第１次地域区画
  LEVEL1: {
    DISIT: 4, // コード桁数
    DIVISION: {
      // メッシュ分割数
      X: 32,
      Y: 39,
    },
    DISTANCE: {
      // 緯度経度の間隔(単位:度) (緯度: 40分, 経度: 1度)
      LAT: 40 / 60,
      LNG: 1,
    },
    SECTION: {
      // 日本の国土にかかる第１次地域区画
      X: {
        MIN: 22,
        MAX: 53,
      },
      Y: {
        MIN: 30,
        MAX: 68,
      },
      LAT: {
        // 緯度 (Y)
        MIN: 20,
      },
      LNG: {
        // 経度 (X)
        MIN: 122,
      },
    },
  },
  // 第２次地域区画
  LEVEL2: {
    DISIT: 6,
    DIVISION: {
      X: 8,
      Y: 8,
    },
    // 緯度: ５分, 経度: ７分30秒
    DISTANCE: {
      LAT: 5 / 60,
      LNG: 7 / 60 + 30 / 60 / 60,
    },
  },
  // 基準地域メッシュ(第３次地域区画)
  LEVEL3: {
    DISIT: 8,
    DIVISION: {
      X: 10,
      Y: 10,
    },
    // 緯度: 30秒, 経度: 45秒
    DISTANCE: {
      LAT: 30 / 60 / 60,
      LNG: 45 / 60 / 60,
    },
  },
  // ２分の１地域メッシュ
  LEVEL4: {
    DISIT: 9,
    DIVISION: {
      X: 2,
      Y: 2,
    },
    // 緯度: 15秒, 経度: 22.5秒
    DISTANCE: {
      LAT: 40 / 60,
      LNG: 1,
    },
  },
  // ４分の１地域メッシュ
  LEVEL5: {
    DISIT: 10,
    DIVISION: {
      X: 2,
      Y: 2,
    },
    // 緯度: 7.5秒, 経度: 11.25秒
    DISTANCE: {
      LAT: 7.5 / 60 / 60,
      LNG: 11.25 / 60 / 60,
    },
  },
  // ８分の１地域メッシュ
  LEVEL6: {
    DISIT: 11,
    DIVISION: {
      X: 2,
      Y: 2,
    },
    // 緯度: 3.75秒, 経度: 5.625秒
    DISTANCE: {
      LAT: 3.75 / 60 / 60,
      LNG: 5.625 / 60 / 60,
    },
  },
}

function getCodeByLevel(code, level) {
  switch (level) {
    case 1:
      return code.slice(0, MESH.LEVEL1.DISIT)
    case 2:
      return code.slice(0, MESH.LEVEL2.DISIT)
    case 3:
      return code.slice(0, MESH.LEVEL3.DISIT)
    case 4:
      return code.slice(0, MESH.LEVEL4.DISIT)
    case 5:
      return code.slice(0, MESH.LEVEL5.DISIT)
    case 6:
      return code.slice(0, MESH.LEVEL6.DISIT)
    default:
      return code
  }
}

function toCode(lat, lng, level) {
  // （１）緯度よりｐ，ｑ，ｒ，ｓ，ｔを算出
  const p = Math.floor(lat * 60 / 40)
  const a = lat * 60 % 40
  const q = Math.floor(a / 5)
  const b = a % 5
  const r = Math.floor(b * 60 / 30)
  const c = b * 60 % 30
  const s = Math.floor(c / 15)
  const d = c % 15
  const t = Math.floor(d / 7.5)
  // （２）経度よりｕ，ｖ，ｗ，ｘ，ｙを算出
  const u = Math.floor(lng - 100)
  const f = lng - 100 - u
  const v = Math.floor(f * 60 / 7.5)
  const g = f * 60 % 7.5
  const w = Math.floor(g * 60 / 45)
  const h = g * 60 % 45
  const x = Math.floor(h / 22.5)
  const i = h % 22.5
  const y = Math.floor(i / 11.25)
  // （３）ｓ，ｘよりｍを算出，ｔ，ｙよりｎを算出
  const m = (s * 2) + (x + 1)
  const n = (t * 2) + (y + 1)
  // （４）ｐ，ｑ，ｒ，ｕ，ｖ，ｗ，ｍ、ｎより地域メッシュ・コードを算出
  let code = `${p}${u}${q}${v}${r}${w}${m}${n}`
  if (level) {
    code = getCodeByLevel(code, level)
  }
  return code
}

function toGeoJSON(code) {
  const lv1X = code.slice(2, 4)
  const lv1Y = code.slice(0, 2)

  let minX, maxX, minY, maxY

  if (code.length >= MESH.LEVEL1.DISIT) {
    minX = MESH.LEVEL1.SECTION.LNG.MIN + (lv1X - MESH.LEVEL1.SECTION.X.MIN) * MESH.LEVEL1.DISTANCE.LNG
    maxX = minX + MESH.LEVEL1.DISTANCE.LNG
    minY = MESH.LEVEL1.SECTION.LAT.MIN + (lv1Y - MESH.LEVEL1.SECTION.Y.MIN) * MESH.LEVEL1.DISTANCE.LAT
    maxY = minY + MESH.LEVEL1.DISTANCE.LAT
  }

  if (code.length >= MESH.LEVEL2.DISIT) {
    const lv2X = code.slice(5, 6)
    const lv2Y = code.slice(4, 5)
    minX += lv2X * MESH.LEVEL2.DISTANCE.LNG
    maxX = minX + MESH.LEVEL2.DISTANCE.LNG
    minY += lv2Y * MESH.LEVEL2.DISTANCE.LAT
    maxY = minY + MESH.LEVEL2.DISTANCE.LAT
  }

  if (code.length >= MESH.LEVEL3.DISIT) {
    const lv3X = code.slice(7, 8)
    const lv3Y = code.slice(6, 7)
    minX += lv3X * MESH.LEVEL3.DISTANCE.LNG;
    maxX = minX + MESH.LEVEL3.DISTANCE.LNG;
    minY += lv3Y * MESH.LEVEL3.DISTANCE.LAT;
    maxY = minY + MESH.LEVEL3.DISTANCE.LAT;
  }

  if (code.length >= MESH.LEVEL4.DISIT) {
    const lv4Num = code.slice(8, 9)
    const lv4X = (lv4Num === 1 || lv4Num === 3) ? 0 : 1
    const lv4Y = (lv4Num === 1 || lv4Num === 2) ? 0 : 1
    minX += lv4X * MESH.LEVEL4.DISTANCE.LNG;
    maxX = minX + MESH.LEVEL4.DISTANCE.LNG;
    minY += lv4Y * MESH.LEVEL4.DISTANCE.LAT;
    maxY = minY + MESH.LEVEL4.DISTANCE.LAT;
  }

  if (code.length >= MESH.LEVEL5.DISIT) {
    const lv5Num = code.slice(9, 10)
    const lv5X = (lv5Num === 1 || lv5Num === 3) ? 0 : 1
    const lv5Y = (lv5Num === 1 || lv5Num === 2) ? 0 : 1
    minX += lv5X * MESH.LEVEL5.DISTANCE.LNG;
    maxX = minX + MESH.LEVEL5.DISTANCE.LNG;
    minY += lv5Y * MESH.LEVEL5.DISTANCE.LAT;
    maxY = minY + MESH.LEVEL5.DISTANCE.LAT;
  }

  if (code.length >= MESH.LEVEL6.DISIT) {
    const lv6Num = code.slice(10, 11)
    const lv6X = (lv6Num === 1 || lv6Num === 3) ? 0 : 1
    const lv6Y = (lv6Num === 1 || lv6Num === 2) ? 0 : 1
    minX += lv6X * MESH.LEVEL6.DISTANCE.LNG;
    maxX = minX + MESH.LEVEL6.DISTANCE.LNG;
    minY += lv6Y * MESH.LEVEL6.DISTANCE.LAT;
    maxY = minY + MESH.LEVEL6.DISTANCE.LAT;
  }
  return JSON.stringify(createGeoJSON(minX, maxX, minY, maxY))
}

function createGeoJSON(minX, maxX, minY, maxY) {
  const ne = [maxX, maxY]
  const nw = [minX, maxY]
  const sw = [minX, minY]
  const se = [maxX, minY]
  // 北東 -> 北西 -> 南西 -> 南東 -> 北東
  const coordinates = [[ne, nw, sw, se, ne]]
  return {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'Polygon',
      coordinates,
    },
  }
}

module.exports = {
  toCode,
  toGeoJSON,
}