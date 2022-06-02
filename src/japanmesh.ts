import { AVAILABLE_LEVELS, MESH, LEVEL_80000_CODES } from './constants'

function isValidCode(code: string) {
  // 桁数チェック
  if (
    code.length !== MESH.LEVEL_80000.DIGIT &&
    code.length !== MESH.LEVEL_10000.DIGIT &&
    code.length !== MESH.LEVEL_1000.DIGIT &&
    code.length !== MESH.LEVEL_500.DIGIT &&
    code.length !== MESH.LEVEL_250.DIGIT &&
    code.length !== MESH.LEVEL_125.DIGIT
  ) {
    return false
  }

  const codes = splitCodeByLevel(code)
  const isInValid = codes.some((c: string) => {
    const level = getLevel(c)
    if (level === 80000) {
      if (!LEVEL_80000_CODES.includes(c)) {
        return true
      }
    } else if (level === 10000) {
      const x = Number(c[c.length - 1])
      const y = Number(c[c.length - 2])
      if (x > MESH.LEVEL_10000.DIVISION.X || y > MESH.LEVEL_10000.DIVISION.Y) {
        return true
      }
    } else if (level === 1000) {
      const x = Number(c[c.length - 1])
      const y = Number(c[c.length - 2])
      if (x > MESH.LEVEL_1000.DIVISION.X || y > MESH.LEVEL_1000.DIVISION.Y) {
        return true
      }
    } else if (level === 500 || level === 250 || level === 125) {
      const DIVISION_NUM = 4
      const xy = Number(c.slice(-1))
      if (xy === 0 || xy > DIVISION_NUM) {
        return true
      }
    }
  })
  return !isInValid
}

function splitCodeByLevel(code: string) {
  const codes = []
  if (code.length >= MESH.LEVEL_80000.DIGIT) {
    codes.push(code.slice(0, MESH.LEVEL_80000.DIGIT))
  }
  if (code.length >= MESH.LEVEL_10000.DIGIT) {
    codes.push(code.slice(0, MESH.LEVEL_10000.DIGIT))
  }
  if (code.length >= MESH.LEVEL_1000.DIGIT) {
    codes.push(code.slice(0, MESH.LEVEL_1000.DIGIT))
  }
  if (code.length >= MESH.LEVEL_500.DIGIT) {
    codes.push(code.slice(0, MESH.LEVEL_500.DIGIT))
  }
  if (code.length >= MESH.LEVEL_250.DIGIT) {
    codes.push(code.slice(0, MESH.LEVEL_250.DIGIT))
  }
  if (code.length >= MESH.LEVEL_125.DIGIT) {
    codes.push(code.slice(0, MESH.LEVEL_125.DIGIT))
  }
  return codes
}

function getLevel(code: string) {
  const digit = code.length
  if (digit === MESH.LEVEL_80000.DIGIT) {
    return 80000
  } else if (digit === MESH.LEVEL_10000.DIGIT) {
    return 10000
  } else if (digit === MESH.LEVEL_5000.DIGIT) {
    return 5000
  } else if (digit === MESH.LEVEL_2000.DIGIT && code[code.length - 1] === '5') {
    return 2000
  } else if (digit === MESH.LEVEL_1000.DIGIT) {
    return 1000
  } else if (digit === MESH.LEVEL_500.DIGIT) {
    return 500
  } else if (digit === MESH.LEVEL_250.DIGIT) {
    return 250
  } else if (digit === MESH.LEVEL_125.DIGIT) {
    return 125
  }
  return null
}

/**
 * 緯度経度から地域メッシュコードを取得する。
 * 算出式 : https://www.stat.go.jp/data/mesh/pdf/gaiyo1.pdf
 */
 function toCode(lat: number, lng: number, level: number = 125) {
  if (AVAILABLE_LEVELS.includes(level) === false) {
    throw new Error(`invalid level. available : ${AVAILABLE_LEVELS}`)
  }

  if (isIntegrationAreaMesh(level)) {
    return toCodeForIntegrationAreaMesh(lat, lng, level)
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
  let code = `${p}${u}${q}${v}${r}${w}${m}${n}${oo}`

  if (isValidCode(code) === false) {
    throw new Error(`lat: ${lat} and lng: ${lng} are invalid location.`)
  }

  switch (level) {
    case 80000:
      return code.slice(0, MESH.LEVEL_80000.DIGIT)
    case 1000:
      return code.slice(0, MESH.LEVEL_1000.DIGIT)
    case 500:
      return code.slice(0, MESH.LEVEL_500.DIGIT)
    case 250:
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

  if (level === 5000) {
    const r = Math.floor((b * 60) / 150)
    const w = Math.floor((g * 60) / 225)
    code += r + (w + 1)
  } else if (level === 2000) {
    const r = Math.floor((b * 60) / 60) * 2
    const w = Math.floor((g * 60) / 90) * 2
    code += `${r}${w}5`
  }

  return code
}

function toGeoJSON(code: string, properties: object = {}) {
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
    const lv10000X = Number(code.slice(5, 6))
    const lv10000Y = Number(code.slice(4, 5))
    minX += lv10000X * MESH.LEVEL_10000.DISTANCE.LNG
    maxX = minX + MESH.LEVEL_10000.DISTANCE.LNG
    minY += lv10000Y * MESH.LEVEL_10000.DISTANCE.LAT
    maxY = minY + MESH.LEVEL_10000.DISTANCE.LAT
  }

  if (code.length >= MESH.LEVEL_1000.DIGIT) {
    const lv1000X = Number(code.slice(7, 8))
    const lv1000Y = Number(code.slice(6, 7))
    minX += lv1000X * MESH.LEVEL_1000.DISTANCE.LNG
    maxX = minX + MESH.LEVEL_1000.DISTANCE.LNG
    minY += lv1000Y * MESH.LEVEL_1000.DISTANCE.LAT
    maxY = minY + MESH.LEVEL_1000.DISTANCE.LAT
  }

  if (code.length >= MESH.LEVEL_500.DIGIT) {
    const lv500Num = code.slice(8, 9)
    const lv500X = lv500Num === '1' || lv500Num === '3' ? 0 : 1
    const lv500Y = lv500Num === '1' || lv500Num === '2' ? 0 : 1
    minX += lv500X * MESH.LEVEL_500.DISTANCE.LNG
    maxX = minX + MESH.LEVEL_500.DISTANCE.LNG
    minY += lv500Y * MESH.LEVEL_500.DISTANCE.LAT
    maxY = minY + MESH.LEVEL_500.DISTANCE.LAT
  }

  if (code.length >= MESH.LEVEL_250.DIGIT) {
    const lv250Num = code.slice(9, 10)
    const lv250X = lv250Num === '1' || lv250Num === '3' ? 0 : 1
    const lv250Y = lv250Num === '1' || lv250Num === '2' ? 0 : 1
    minX += lv250X * MESH.LEVEL_250.DISTANCE.LNG
    maxX = minX + MESH.LEVEL_250.DISTANCE.LNG
    minY += lv250Y * MESH.LEVEL_250.DISTANCE.LAT
    maxY = minY + MESH.LEVEL_250.DISTANCE.LAT
  }

  if (code.length >= MESH.LEVEL_125.DIGIT) {
    const lv125Num = code.slice(10, 11)
    const lv125X = lv125Num === '1' || lv125Num === '3' ? 0 : 1
    const lv125Y = lv125Num === '1' || lv125Num === '2' ? 0 : 1
    minX += lv125X * MESH.LEVEL_125.DISTANCE.LNG
    maxX = minX + MESH.LEVEL_125.DISTANCE.LNG
    minY += lv125Y * MESH.LEVEL_125.DISTANCE.LAT
    maxY = minY + MESH.LEVEL_125.DISTANCE.LAT
  }
  return createGeoJSON(minX, maxX, minY, maxY, properties)
}

function createGeoJSON(
  minX: number,
  maxX: number,
  minY: number,
  maxY: number,
  properties = {}
) {
  const ne = [maxX, maxY]
  const nw = [minX, maxY]
  const sw = [minX, minY]
  const se = [maxX, minY]
  // 北東 -> 北西 -> 南西 -> 南東 -> 北東
  const coordinates = [[ne, nw, sw, se, ne]]
  return {
    type: 'Feature',
    properties,
    geometry: {
      type: 'Polygon',
      coordinates,
    },
  }
}

function getCodes(code: string | null = null) {
  if (code === null) {
    return LEVEL_80000_CODES
  }
  if (isValidCode(code) === false) {
    throw new Error(`'${code}' is invalid mesh code.`)
  }
  const codes = []
  const level = getLevel(code)
  if (level === 80000) {
    // 2次メッシュ
    for (let y2 = 0; y2 < MESH.LEVEL_10000.DIVISION.Y; y2++) {
      for (let x2 = 0; x2 < MESH.LEVEL_10000.DIVISION.X; x2++) {
        codes.push(`${code}${y2}${x2}`)
      }
    }
  } else if (level === 10000) {
    // 3次メッシュ
    for (let y3 = 0; y3 < MESH.LEVEL_1000.DIVISION.Y; y3++) {
      for (let x3 = 0; x3 < MESH.LEVEL_1000.DIVISION.X; x3++) {
        codes.push(`${code}${y3}${x3}`)
      }
    }
  } else if (level === 1000 || level === 500 || level === 250) {
    // 4次,5次,6次メッシュ
    const DIVISION_NUM = 4 // 分割数(=マスの数)
    for (let i = 1; i <= DIVISION_NUM; i++) {
      codes.push(`${code}${i}`)
    }
  }
  return codes
}

// 統合地域メッシュであるか否か
function isIntegrationAreaMesh(level: number) {
  return [10000, 5000, 2000].includes(level)
}

export default {
  toCode,
  toGeoJSON,
  getLevel,
  getCodes,
}
