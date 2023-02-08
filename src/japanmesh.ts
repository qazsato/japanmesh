import {
  AREA_MESH_LEVELS,
  INTEGRATION_AREA_MESH_LEVELS,
  MESH,
  LEVEL_80000_CODES,
} from './constants'

import LatLngBounds from './geo/LatLngBounds'

function isValidCode(code: string) {
  // 桁数チェック
  if (
    code.length !== MESH.LEVEL_80000.DIGIT &&
    code.length !== MESH.LEVEL_10000.DIGIT &&
    code.length !== MESH.LEVEL_5000.DIGIT &&
    code.length !== MESH.LEVEL_2000.DIGIT &&
    code.length !== MESH.LEVEL_1000.DIGIT &&
    code.length !== MESH.LEVEL_500.DIGIT &&
    code.length !== MESH.LEVEL_250.DIGIT &&
    code.length !== MESH.LEVEL_125.DIGIT
  ) {
    return false
  }

  // 第1次地域区画
  if (!LEVEL_80000_CODES.includes(code.slice(0, MESH.LEVEL_80000.DIGIT))) {
    return false
  }

  if (code.length >= MESH.LEVEL_10000.DIGIT) {
    // 第2次地域区画 (x, y は 0~7 の範囲となる)
    const lv10000Y = Number(code[4])
    const lv10000X = Number(code[5])
    if (
      lv10000Y < MESH.LEVEL_10000.RANGE.MIN ||
      lv10000Y > MESH.LEVEL_10000.RANGE.MAX ||
      lv10000X < MESH.LEVEL_10000.RANGE.MIN ||
      lv10000X > MESH.LEVEL_10000.RANGE.MAX
    ) {
      return false
    }
  }

  if (isIntegrationAreaMesh(code)) {
    if (code.length === MESH.LEVEL_5000.DIGIT) {
      // 5倍地域メッシュ (x, y は 1~4 の範囲となる)
      const lv5000XY = Number(code[6])
      if (
        lv5000XY < MESH.LEVEL_5000.RANGE.MIN ||
        lv5000XY > MESH.LEVEL_5000.RANGE.MAX
      ) {
        return false
      }
    } else if (code.length === MESH.LEVEL_2000.DIGIT) {
      // 2倍地域メッシュ (x, y は 0~8 の範囲の偶数となる)
      const lv2000Y = Number(code[6])
      const lv2000X = Number(code[7])
      const range = [0, 2, 4, 6, 8]
      if (!range.includes(lv2000Y) || !range.includes(lv2000X)) {
        return false
      }
    }
  } else {
    if (code.length >= MESH.LEVEL_1000.DIGIT) {
      // 基準地域メッシュ(第3次地域区画) (x, y は 0~9 の範囲となる)
      const lv1000Y = Number(code[6])
      const lv1000X = Number(code[7])
      if (
        lv1000Y < MESH.LEVEL_1000.RANGE.MIN ||
        lv1000Y > MESH.LEVEL_1000.RANGE.MAX ||
        lv1000X < MESH.LEVEL_1000.RANGE.MIN ||
        lv1000X > MESH.LEVEL_1000.RANGE.MAX
      ) {
        return false
      }
    }

    if (code.length >= MESH.LEVEL_500.DIGIT) {
      // 2分の1地域メッシュ (x, y は 1~4 の範囲となる)
      const lv500XY = Number(code[8])
      if (
        lv500XY < MESH.LEVEL_500.RANGE.MIN ||
        lv500XY > MESH.LEVEL_500.RANGE.MAX
      ) {
        return false
      }
    }

    if (code.length >= MESH.LEVEL_250.DIGIT) {
      // 4分の1地域メッシュ (x, y は 1~4 の範囲となる)
      const lv250XY = Number(code[9])
      if (
        lv250XY < MESH.LEVEL_250.RANGE.MIN ||
        lv250XY > MESH.LEVEL_250.RANGE.MAX
      ) {
        return false
      }
    }

    if (code.length >= MESH.LEVEL_125.DIGIT) {
      // 8分の1地域メッシュ (x, y は 1~4 の範囲となる)
      const lv125XY = Number(code[10])
      if (
        lv125XY < MESH.LEVEL_125.RANGE.MIN ||
        lv125XY > MESH.LEVEL_125.RANGE.MAX
      ) {
        return false
      }
    }
  }

  return true
}

function getLevel(code: string) {
  if (isValidCode(code) === false) {
    throw new Error(`'${code}' is invalid mesh code.`)
  }
  const digit = code.length
  if (digit === MESH.LEVEL_80000.DIGIT) {
    return MESH.LEVEL_80000.LEVEL
  } else if (digit === MESH.LEVEL_10000.DIGIT) {
    return MESH.LEVEL_10000.LEVEL
  } else if (digit === MESH.LEVEL_5000.DIGIT) {
    return MESH.LEVEL_5000.LEVEL
  } else if (digit === MESH.LEVEL_2000.DIGIT && code[code.length - 1] === '5') {
    return MESH.LEVEL_2000.LEVEL
  } else if (digit === MESH.LEVEL_1000.DIGIT) {
    return MESH.LEVEL_1000.LEVEL
  } else if (digit === MESH.LEVEL_500.DIGIT) {
    return MESH.LEVEL_500.LEVEL
  } else if (digit === MESH.LEVEL_250.DIGIT) {
    return MESH.LEVEL_250.LEVEL
  } else {
    return MESH.LEVEL_125.LEVEL
  }
}

/**
 * 緯度経度から地域メッシュコードを取得する。
 * 算出式 : https://www.stat.go.jp/data/mesh/pdf/gaiyo1.pdf
 */
function toCode(lat: number, lng: number, level = MESH.LEVEL_125.LEVEL) {
  if (AREA_MESH_LEVELS.includes(level) === false) {
    throw new Error(`invalid level. available : ${AREA_MESH_LEVELS.join(', ')}`)
  }

  if (INTEGRATION_AREA_MESH_LEVELS.includes(level)) {
    const code = toCodeForIntegrationAreaMesh(lat, lng, level)
    if (isValidCode(code) === false) {
      throw new Error(`lat: ${lat} and lng: ${lng} are invalid location.`)
    }
    return code
  }

  // （１）緯度よりｐ，ｑ，ｒ，ｓ，ｔを算出
  const p = Math.floor((lat * 60) / 40)
  const a = (lat * 60) % 40
  const q = Math.floor(a / 5)
  const b = a % 5
  const r = Math.floor((b * 60) / 30)
  const c = (b * 60) % 30
  const s = Math.floor(c / 15)
  const d = c % 15
  const t = Math.floor(d / 7.5)
  // 以下、８分の１地域メッシュ算出のため拡張
  const ee = d % 7.5
  const uu = Math.floor(ee / 3.75)

  // （２）経度よりｕ，ｖ，ｗ，ｘ，ｙを算出
  const u = Math.floor(lng - 100)
  const f = lng - 100 - u
  const v = Math.floor((f * 60) / 7.5)
  const g = (f * 60) % 7.5
  const w = Math.floor((g * 60) / 45)
  const h = (g * 60) % 45
  const x = Math.floor(h / 22.5)
  const i = h % 22.5
  const y = Math.floor(i / 11.25)
  // 以下、８分の１地域メッシュ算出のため拡張
  const jj = i % 11.25
  const zz = Math.floor(jj / 5.625)

  // （３）ｓ，ｘよりｍを算出，ｔ，ｙよりｎを算出
  const m = s * 2 + (x + 1)
  const n = t * 2 + (y + 1)
  // 以下、８分の１地域メッシュ算出のため拡張
  const oo = uu * 2 + (zz + 1)

  // （４）ｐ，ｑ，ｒ，ｕ，ｖ，ｗ，ｍ、ｎ、ooより地域メッシュ・コードを算出
  const code = `${p}${u}${q}${v}${r}${w}${m}${n}${oo}`

  if (isValidCode(code) === false) {
    throw new Error(`lat: ${lat} and lng: ${lng} are invalid location.`)
  }

  switch (level) {
    case MESH.LEVEL_80000.LEVEL:
      return code.slice(0, MESH.LEVEL_80000.DIGIT)
    case MESH.LEVEL_1000.LEVEL:
      return code.slice(0, MESH.LEVEL_1000.DIGIT)
    case MESH.LEVEL_500.LEVEL:
      return code.slice(0, MESH.LEVEL_500.DIGIT)
    case MESH.LEVEL_250.LEVEL:
      return code.slice(0, MESH.LEVEL_250.DIGIT)
    default:
      return code
  }
}

/**
 * 緯度経度から地域メッシュコードを取得する。統合地域メッシュ用。
 * 算出式 : https://www.stat.go.jp/data/mesh/pdf/gaiyo1.pdf
 * @param {number} lat
 * @param {number} lng
 * @param {number} level
 */
function toCodeForIntegrationAreaMesh(lat: number, lng: number, level: number) {
  // （１）緯度よりｐ，ｑを算出
  const p = Math.floor((lat * 60) / 40)
  const a = (lat * 60) % 40
  const q = Math.floor(a / 5)
  const b = a % 5

  // （２）経度よりｕ，ｖを算出
  const u = Math.floor(lng - 100)
  const f = lng - 100 - u
  const v = Math.floor((f * 60) / 7.5)
  const g = (f * 60) % 7.5

  let code = `${p}${u}${q}${v}`

  if (level === MESH.LEVEL_5000.LEVEL) {
    const r = Math.floor((b * 60) / 150)
    const w = Math.floor((g * 60) / 225)
    code += r + (w + 1)
  } else if (level === MESH.LEVEL_2000.LEVEL) {
    const r = Math.floor((b * 60) / 60) * 2
    const w = Math.floor((g * 60) / 90) * 2
    code += `${r}${w}5`
  }

  return code
}

function toLatLngBounds(code: string) {
  const coordinate = toCoordinate(code)
  const ne = coordinate[0] // 北東
  const sw = coordinate[2] // 南西
  return new LatLngBounds(ne[1], ne[0], sw[1], sw[0])
}

function toGeoJSON(code: string, properties: object = {}) {
  const coordinate = toCoordinate(code)
  return createGeoJSON(coordinate, properties)
}

function toCoordinate(code: string): number[][] {
  if (isValidCode(code) === false) {
    throw new Error(`'${code}' is invalid mesh code.`)
  }
  const lv80000X = Number(code.slice(2, 4))
  const lv80000Y = Number(code.slice(0, 2))

  let minX = 0
  let maxX = 0
  let minY = 0
  let maxY = 0

  if (code.length >= MESH.LEVEL_80000.DIGIT) {
    minX =
      MESH.LEVEL_80000.SECTION.LNG.MIN +
      (lv80000X - MESH.LEVEL_80000.SECTION.X.MIN) *
        MESH.LEVEL_80000.DISTANCE.LNG
    maxX = minX + MESH.LEVEL_80000.DISTANCE.LNG
    minY =
      MESH.LEVEL_80000.SECTION.LAT.MIN +
      (lv80000Y - MESH.LEVEL_80000.SECTION.Y.MIN) *
        MESH.LEVEL_80000.DISTANCE.LAT
    maxY = minY + MESH.LEVEL_80000.DISTANCE.LAT
  }

  if (code.length >= MESH.LEVEL_10000.DIGIT) {
    const lv10000X = Number(code[5])
    const lv10000Y = Number(code[4])
    minX += lv10000X * MESH.LEVEL_10000.DISTANCE.LNG
    maxX = minX + MESH.LEVEL_10000.DISTANCE.LNG
    minY += lv10000Y * MESH.LEVEL_10000.DISTANCE.LAT
    maxY = minY + MESH.LEVEL_10000.DISTANCE.LAT
  }

  if (isIntegrationAreaMesh(code)) {
    if (code.length === MESH.LEVEL_5000.DIGIT) {
      const lv5000XY = Number(code[6])
      const lv5000X = lv5000XY === 1 || lv5000XY === 3 ? 0 : 1
      const lv5000Y = lv5000XY === 1 || lv5000XY === 2 ? 0 : 1
      minX += lv5000X * MESH.LEVEL_5000.DISTANCE.LNG
      maxX = minX + MESH.LEVEL_5000.DISTANCE.LNG
      minY += lv5000Y * MESH.LEVEL_5000.DISTANCE.LAT
      maxY = minY + MESH.LEVEL_5000.DISTANCE.LAT
    } else if (code.length === MESH.LEVEL_2000.DIGIT) {
      const lv2000X = Number(code[7])
      const lv2000Y = Number(code[6])
      minX += (lv2000X / 2) * MESH.LEVEL_2000.DISTANCE.LNG
      maxX = minX + MESH.LEVEL_2000.DISTANCE.LNG
      minY += (lv2000Y / 2) * MESH.LEVEL_2000.DISTANCE.LAT
      maxY = minY + MESH.LEVEL_2000.DISTANCE.LAT
    }
  } else {
    if (code.length >= MESH.LEVEL_1000.DIGIT) {
      const lv1000X = Number(code[7])
      const lv1000Y = Number(code[6])
      minX += lv1000X * MESH.LEVEL_1000.DISTANCE.LNG
      maxX = minX + MESH.LEVEL_1000.DISTANCE.LNG
      minY += lv1000Y * MESH.LEVEL_1000.DISTANCE.LAT
      maxY = minY + MESH.LEVEL_1000.DISTANCE.LAT
    }

    if (code.length >= MESH.LEVEL_500.DIGIT) {
      const lv500XY = Number(code[8])
      const lv500X = lv500XY === 1 || lv500XY === 3 ? 0 : 1
      const lv500Y = lv500XY === 1 || lv500XY === 2 ? 0 : 1
      minX += lv500X * MESH.LEVEL_500.DISTANCE.LNG
      maxX = minX + MESH.LEVEL_500.DISTANCE.LNG
      minY += lv500Y * MESH.LEVEL_500.DISTANCE.LAT
      maxY = minY + MESH.LEVEL_500.DISTANCE.LAT
    }

    if (code.length >= MESH.LEVEL_250.DIGIT) {
      const lv250XY = Number(code[9])
      const lv250X = lv250XY === 1 || lv250XY === 3 ? 0 : 1
      const lv250Y = lv250XY === 1 || lv250XY === 2 ? 0 : 1
      minX += lv250X * MESH.LEVEL_250.DISTANCE.LNG
      maxX = minX + MESH.LEVEL_250.DISTANCE.LNG
      minY += lv250Y * MESH.LEVEL_250.DISTANCE.LAT
      maxY = minY + MESH.LEVEL_250.DISTANCE.LAT
    }

    if (code.length >= MESH.LEVEL_125.DIGIT) {
      const lv125XY = Number(code[10])
      const lv125X = lv125XY === 1 || lv125XY === 3 ? 0 : 1
      const lv125Y = lv125XY === 1 || lv125XY === 2 ? 0 : 1
      minX += lv125X * MESH.LEVEL_125.DISTANCE.LNG
      maxX = minX + MESH.LEVEL_125.DISTANCE.LNG
      minY += lv125Y * MESH.LEVEL_125.DISTANCE.LAT
      maxY = minY + MESH.LEVEL_125.DISTANCE.LAT
    }
  }
  const ne = [maxX, maxY]
  const nw = [minX, maxY]
  const sw = [minX, minY]
  const se = [maxX, minY]
  // 北東 -> 北西 -> 南西 -> 南東
  return [ne, nw, sw, se]
}

function createGeoJSON(coordinate: number[][], properties: object = {}) {
  coordinate.push(coordinate[0])
  const coordinates = [coordinate]
  return {
    type: 'Feature',
    properties,
    geometry: {
      type: 'Polygon',
      coordinates,
    },
  }
}

function getCodes(code: string | null = null, level: number | null = null) {
  if (code === null && level === null) {
    return LEVEL_80000_CODES
  }
  if (code === null) {
    throw new Error('code is required.')
  }
  if (level === null) {
    throw new Error('level is required.')
  }
  if (isValidCode(code) === false) {
    throw new Error(`'${code}' is invalid mesh code.`)
  }
  if (AREA_MESH_LEVELS.includes(level) === false) {
    throw new Error(
      `${level} is invalid level. available : ${AREA_MESH_LEVELS.join(', ')}`
    )
  }
  const currentLevel = getLevel(code)
  if (currentLevel <= level) {
    throw new Error('code level is lower than the specified level.')
  }

  const lv10000Codes: string[] = []
  if (currentLevel > MESH.LEVEL_10000.LEVEL) {
    for (
      let y = MESH.LEVEL_10000.RANGE.MIN;
      y <= MESH.LEVEL_10000.RANGE.MAX;
      y++
    ) {
      for (
        let x = MESH.LEVEL_10000.RANGE.MIN;
        x <= MESH.LEVEL_10000.RANGE.MAX;
        x++
      ) {
        lv10000Codes.push(`${code}${y}${x}`)
      }
    }
    if (level === MESH.LEVEL_10000.LEVEL) {
      return lv10000Codes
    }
  } else {
    lv10000Codes.push(code.slice(0, MESH.LEVEL_10000.DIGIT))
  }

  if (INTEGRATION_AREA_MESH_LEVELS.includes(level)) {
    if (level === MESH.LEVEL_5000.LEVEL) {
      const lv5000Codes: string[] = []
      lv10000Codes.forEach((lv10000Code) => {
        for (
          let xy = MESH.LEVEL_5000.RANGE.MIN;
          xy <= MESH.LEVEL_5000.RANGE.MAX;
          xy++
        ) {
          lv5000Codes.push(`${lv10000Code}${xy}`)
        }
      })
      return lv5000Codes
    } else if (level === MESH.LEVEL_2000.LEVEL) {
      const lv2000Codes: string[] = []
      lv10000Codes.forEach((lv10000Code) => {
        let yRange = [0, 2, 4, 6, 8]
        let xRange = [0, 2, 4, 6, 8]
        if (currentLevel === MESH.LEVEL_5000.LEVEL) {
          const lv5000XY = Number(code[6])
          if (lv5000XY === 1) {
            yRange = [0, 2, 4]
            xRange = [0, 2, 4]
          } else if (lv5000XY === 2) {
            yRange = [0, 2, 4]
            xRange = [4, 6, 8]
          } else if (lv5000XY === 3) {
            yRange = [4, 6, 8]
            xRange = [0, 2, 4]
          } else if (lv5000XY === 4) {
            yRange = [4, 6, 8]
            xRange = [4, 6, 8]
          }
        }
        yRange.forEach((y) => {
          xRange.forEach((x) => {
            lv2000Codes.push(`${lv10000Code}${y}${x}5`)
          })
        })
      })
      return lv2000Codes
    }
  } else {
    const lv1000Codes: string[] = []
    if (currentLevel > MESH.LEVEL_1000.LEVEL) {
      let yMin = MESH.LEVEL_1000.RANGE.MIN
      let yMax = MESH.LEVEL_1000.RANGE.MAX
      let xMin = MESH.LEVEL_1000.RANGE.MIN
      let xMax = MESH.LEVEL_1000.RANGE.MAX
      if (currentLevel === MESH.LEVEL_5000.LEVEL) {
        const lv5000XY = Number(code[6])
        if (lv5000XY === 1) {
          yMax = (MESH.LEVEL_1000.RANGE.MAX + 1) / 2
          xMax = (MESH.LEVEL_1000.RANGE.MAX + 1) / 2
        } else if (lv5000XY === 2) {
          yMax = (MESH.LEVEL_1000.RANGE.MAX + 1) / 2
          xMin = (MESH.LEVEL_1000.RANGE.MAX + 1) / 2
        } else if (lv5000XY === 3) {
          yMin = (MESH.LEVEL_1000.RANGE.MAX + 1) / 2
          xMax = (MESH.LEVEL_1000.RANGE.MAX + 1) / 2
        } else if (lv5000XY === 4) {
          yMin = (MESH.LEVEL_1000.RANGE.MAX + 1) / 2
          xMin = (MESH.LEVEL_1000.RANGE.MAX + 1) / 2
        }
      } else if (currentLevel === MESH.LEVEL_2000.LEVEL) {
        const lv2000X = Number(code[7])
        const lv2000Y = Number(code[6])
        yMin = lv2000Y
        yMax = lv2000Y + 1
        xMin = lv2000X
        xMax = lv2000X + 1
      }
      lv10000Codes.forEach((lv10000Code) => {
        for (let y = yMin; y <= yMax; y++) {
          for (let x = xMin; x <= xMax; x++) {
            lv1000Codes.push(`${lv10000Code}${y}${x}`)
          }
        }
      })
      if (level === MESH.LEVEL_1000.LEVEL) {
        return lv1000Codes
      }
    } else {
      lv1000Codes.push(code.slice(0, MESH.LEVEL_1000.DIGIT))
    }
    const lv500Codes: string[] = []
    if (currentLevel > MESH.LEVEL_500.LEVEL) {
      lv1000Codes.forEach((lv1000Code) => {
        for (
          let xy = MESH.LEVEL_500.RANGE.MIN;
          xy <= MESH.LEVEL_500.RANGE.MAX;
          xy++
        ) {
          lv500Codes.push(`${lv1000Code}${xy}`)
        }
      })
      if (level === MESH.LEVEL_500.LEVEL) {
        return lv500Codes
      }
    } else {
      lv500Codes.push(code.slice(0, MESH.LEVEL_500.DIGIT))
    }
    const lv250Codes: string[] = []
    if (currentLevel > MESH.LEVEL_250.LEVEL) {
      lv500Codes.forEach((lv500Code) => {
        for (
          let xy = MESH.LEVEL_250.RANGE.MIN;
          xy <= MESH.LEVEL_250.RANGE.MAX;
          xy++
        ) {
          lv250Codes.push(`${lv500Code}${xy}`)
        }
      })
      if (level === MESH.LEVEL_250.LEVEL) {
        return lv250Codes
      }
    } else {
      lv250Codes.push(code.slice(0, MESH.LEVEL_250.DIGIT))
    }
    const lv125Codes: string[] = []
    if (currentLevel > MESH.LEVEL_125.LEVEL) {
      lv250Codes.forEach((lv250Code) => {
        for (
          let xy = MESH.LEVEL_125.RANGE.MIN;
          xy <= MESH.LEVEL_125.RANGE.MAX;
          xy++
        ) {
          lv125Codes.push(`${lv250Code}${xy}`)
        }
      })
      if (level === MESH.LEVEL_125.LEVEL) {
        return lv125Codes
      }
    }
  }
}

function isIntegrationAreaMesh(code: string) {
  if (
    code.length === MESH.LEVEL_10000.DIGIT ||
    code.length === MESH.LEVEL_5000.DIGIT ||
    (code.length === MESH.LEVEL_2000.DIGIT && code[code.length - 1] === '5')
  ) {
    return true
  }
  return false
}

export const japanmesh = {
  toCode,
  toLatLngBounds,
  toGeoJSON,
  getLevel,
  getCodes,
}
