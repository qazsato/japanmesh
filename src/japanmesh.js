const MESH = require('./constants/mesh')
const LEVEL1_CODES = require('./constants/level1_codes')

function isValidCode(code) {
  // 桁数チェック
  if (
    code.length !== MESH.LEVEL1.DIGIT &&
    code.length !== MESH.LEVEL2.DIGIT &&
    code.length !== MESH.LEVEL3.DIGIT &&
    code.length !== MESH.LEVEL4.DIGIT &&
    code.length !== MESH.LEVEL5.DIGIT &&
    code.length !== MESH.LEVEL6.DIGIT
  ) {
    return false
  }

  const codes = splitCodeByLevel(code)
  const isInValid = codes.some((c, i) => {
    const level = i + 1
    if (level === 1) {
      if (!LEVEL1_CODES.includes(c)) {
        return true
      }
    } else if (level === 2) {
      const x = Number(c[c.length - 1])
      const y = Number(c[c.length - 2])
      if (x > MESH.LEVEL2.DIVISION.X || y > MESH.LEVEL2.DIVISION.Y) {
        return true
      }
    } else if (level === 3) {
      const x = Number(c[c.length - 1])
      const y = Number(c[c.length - 2])
      if (x > MESH.LEVEL3.DIVISION.X || y > MESH.LEVEL3.DIVISION.Y) {
        return true
      }
    } else if (level === 4 || level === 5 || level === 6) {
      const DIVISION_NUM = 4
      if (Number(c.slice(-1)) > DIVISION_NUM) {
        return true
      }
    }
  })
  return !isInValid
}

function splitCodeByLevel(code) {
  const codes = []
  if (code.length >= MESH.LEVEL1.DIGIT) {
    codes.push(code.slice(0, MESH.LEVEL1.DIGIT))
  }
  if (code.length >= MESH.LEVEL2.DIGIT) {
    codes.push(code.slice(0, MESH.LEVEL2.DIGIT))
  }
  if (code.length >= MESH.LEVEL3.DIGIT) {
    codes.push(code.slice(0, MESH.LEVEL3.DIGIT))
  }
  if (code.length >= MESH.LEVEL4.DIGIT) {
    codes.push(code.slice(0, MESH.LEVEL4.DIGIT))
  }
  if (code.length >= MESH.LEVEL5.DIGIT) {
    codes.push(code.slice(0, MESH.LEVEL5.DIGIT))
  }
  if (code.length >= MESH.LEVEL6.DIGIT) {
    codes.push(code.slice(0, MESH.LEVEL6.DIGIT))
  }
  return codes
}

function getLevel(code = null) {
  if (code === null) {
    return null
  }
  const digit = code.length
  switch (digit) {
    case MESH.LEVEL1.DIGIT:
      return 1
    case MESH.LEVEL2.DIGIT:
      return 2
    case MESH.LEVEL3.DIGIT:
      return 3
    case MESH.LEVEL4.DIGIT:
      return 4
    case MESH.LEVEL5.DIGIT:
      return 5
    case MESH.LEVEL6.DIGIT:
      return 6
    default:
      return null
  }
}

function getCodeByLevel(code, level) {
  switch (level) {
    case 1:
      return code.slice(0, MESH.LEVEL1.DIGIT)
    case 2:
      return code.slice(0, MESH.LEVEL2.DIGIT)
    case 3:
      return code.slice(0, MESH.LEVEL3.DIGIT)
    case 4:
      return code.slice(0, MESH.LEVEL4.DIGIT)
    case 5:
      return code.slice(0, MESH.LEVEL5.DIGIT)
    case 6:
      return code.slice(0, MESH.LEVEL6.DIGIT)
    default:
      return code
  }
}

function toCode(lat, lng, level) {
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
  // （３）ｓ，ｘよりｍを算出，ｔ，ｙよりｎを算出
  const m = s * 2 + (x + 1)
  const n = t * 2 + (y + 1)
  // （４）ｐ，ｑ，ｒ，ｕ，ｖ，ｗ，ｍ、ｎより地域メッシュ・コードを算出
  let code = `${p}${u}${q}${v}${r}${w}${m}${n}`
  if (level) {
    code = getCodeByLevel(code, level)
  }
  return code
}

function toGeoJSON(code, properties) {
  if (isValidCode(code) === false) {
    throw new Error(`'${code}' is invalid mesh code.`)
  }
  const lv1X = code.slice(2, 4)
  const lv1Y = code.slice(0, 2)

  let minX, maxX, minY, maxY

  if (code.length >= MESH.LEVEL1.DIGIT) {
    minX =
      MESH.LEVEL1.SECTION.LNG.MIN +
      (lv1X - MESH.LEVEL1.SECTION.X.MIN) * MESH.LEVEL1.DISTANCE.LNG
    maxX = minX + MESH.LEVEL1.DISTANCE.LNG
    minY =
      MESH.LEVEL1.SECTION.LAT.MIN +
      (lv1Y - MESH.LEVEL1.SECTION.Y.MIN) * MESH.LEVEL1.DISTANCE.LAT
    maxY = minY + MESH.LEVEL1.DISTANCE.LAT
  }

  if (code.length >= MESH.LEVEL2.DIGIT) {
    const lv2X = code.slice(5, 6)
    const lv2Y = code.slice(4, 5)
    minX += lv2X * MESH.LEVEL2.DISTANCE.LNG
    maxX = minX + MESH.LEVEL2.DISTANCE.LNG
    minY += lv2Y * MESH.LEVEL2.DISTANCE.LAT
    maxY = minY + MESH.LEVEL2.DISTANCE.LAT
  }

  if (code.length >= MESH.LEVEL3.DIGIT) {
    const lv3X = code.slice(7, 8)
    const lv3Y = code.slice(6, 7)
    minX += lv3X * MESH.LEVEL3.DISTANCE.LNG
    maxX = minX + MESH.LEVEL3.DISTANCE.LNG
    minY += lv3Y * MESH.LEVEL3.DISTANCE.LAT
    maxY = minY + MESH.LEVEL3.DISTANCE.LAT
  }

  if (code.length >= MESH.LEVEL4.DIGIT) {
    const lv4Num = code.slice(8, 9)
    const lv4X = lv4Num === '1' || lv4Num === '3' ? 0 : 1
    const lv4Y = lv4Num === '1' || lv4Num === '2' ? 0 : 1
    minX += lv4X * MESH.LEVEL4.DISTANCE.LNG
    maxX = minX + MESH.LEVEL4.DISTANCE.LNG
    minY += lv4Y * MESH.LEVEL4.DISTANCE.LAT
    maxY = minY + MESH.LEVEL4.DISTANCE.LAT
  }

  if (code.length >= MESH.LEVEL5.DIGIT) {
    const lv5Num = code.slice(9, 10)
    const lv5X = lv5Num === '1' || lv5Num === '3' ? 0 : 1
    const lv5Y = lv5Num === '1' || lv5Num === '2' ? 0 : 1
    minX += lv5X * MESH.LEVEL5.DISTANCE.LNG
    maxX = minX + MESH.LEVEL5.DISTANCE.LNG
    minY += lv5Y * MESH.LEVEL5.DISTANCE.LAT
    maxY = minY + MESH.LEVEL5.DISTANCE.LAT
  }

  if (code.length >= MESH.LEVEL6.DIGIT) {
    const lv6Num = code.slice(10, 11)
    const lv6X = lv6Num === '1' || lv6Num === '3' ? 0 : 1
    const lv6Y = lv6Num === '1' || lv6Num === '2' ? 0 : 1
    minX += lv6X * MESH.LEVEL6.DISTANCE.LNG
    maxX = minX + MESH.LEVEL6.DISTANCE.LNG
    minY += lv6Y * MESH.LEVEL6.DISTANCE.LAT
    maxY = minY + MESH.LEVEL6.DISTANCE.LAT
  }
  return createGeoJSON(minX, maxX, minY, maxY, properties)
}

function createGeoJSON(minX, maxX, minY, maxY, properties = {}) {
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

function getCodes(code = null) {
  if (code === null) {
    return LEVEL1_CODES
  }
  if (isValidCode(code) === false) {
    throw new Error(`'${code}' is invalid mesh code.`)
  }
  const codes = []
  const level = getLevel(code)
  if (level === 1) {
    // 2次メッシュ
    for (let y2 = 0; y2 < MESH.LEVEL2.DIVISION.Y; y2++) {
      for (let x2 = 0; x2 < MESH.LEVEL2.DIVISION.X; x2++) {
        codes.push(`${code}${y2}${x2}`)
      }
    }
  } else if (level === 2) {
    // 3次メッシュ
    for (let y3 = 0; y3 < MESH.LEVEL3.DIVISION.Y; y3++) {
      for (let x3 = 0; x3 < MESH.LEVEL3.DIVISION.X; x3++) {
        codes.push(`${code}${y3}${x3}`)
      }
    }
  } else if (level === 3 || level === 4 || level === 5) {
    // 4次,5次,6次メッシュ
    const DIVISION_NUM = 4 // 分割数(=マスの数)
    for (let i = 0; i < DIVISION_NUM; i++) {
      codes.push(`${code}${i}`)
    }
  }
  return codes
}

module.exports = {
  toCode,
  toGeoJSON,
  getLevel,
  getCodes,
}
