const MESH = require('./constants/mesh')
const LEVEL_80000_CODES = require('./constants/level_80000_codes')
const AVAILABLE_LEVELS = require('./constants/index').AVAILABLE_LEVELS

function isValidCode(code) {
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

  // 80km
  if (!LEVEL_80000_CODES.includes(code.slice(0, 4))) {
    return false
  }

  // 10km (x, y は 0~7 の範囲となる)
  if (code.length >= MESH.LEVEL_10000.DIGIT) {
    const y10000 = Number(code.slice(4, 5))
    const x10000 = Number(code.slice(5, 6))
    if (
      y10000 < MESH.LEVEL_10000.RANGE.MIN ||
      y10000 > MESH.LEVEL_10000.RANGE.MAX ||
      x10000 < MESH.LEVEL_10000.RANGE.MIN ||
      x10000 > MESH.LEVEL_10000.RANGE.MAX
    ) {
      return false
    }
  }

  if (isIntegrationAreaMeshByCode(code)) {
    // 5km (x, y は 1~4 の範囲となる)
    if (code.length === MESH.LEVEL_5000.DIGIT) {
      const xy5000 = Number(code.slice(6, 7))
      if (
        xy5000 < MESH.LEVEL_5000.RANGE.MIN ||
        xy5000 > MESH.LEVEL_5000.RANGE.MAX
      ) {
        return false
      }
    }

    // 2km (x, y は 0~8 の範囲の偶数となる)
    if (code.length === MESH.LEVEL_2000.DIGIT && code.substr(-1, 1) === '5') {
      const y2000 = Number(code.slice(6, 7))
      const x2000 = Number(code.slice(7, 8))
      const range = [...Array(MESH.LEVEL_2000.RANGE.MAX + 1).keys()].filter(
        (n) => n % 2 === 0
      )
      if (!range.includes(y2000) || !range.includes(x2000)) {
        return false
      }
    }
  } else {
    // 1km (x, y は 0~9 の範囲となる)
    if (code.length >= MESH.LEVEL_1000.DIGIT) {
      const y1000 = Number(code.slice(6, 7))
      const x1000 = Number(code.slice(7, 8))
      if (
        y1000 < MESH.LEVEL_1000.RANGE.MIN ||
        y1000 > MESH.LEVEL_1000.RANGE.MAX ||
        x1000 < MESH.LEVEL_1000.RANGE.MIN ||
        x1000 > MESH.LEVEL_1000.RANGE.MAX
      ) {
        return false
      }
    }

    // 500m (x, y は 1~4 の範囲となる)
    if (code.length >= MESH.LEVEL_500.DIGIT) {
      const xy500 = Number(code.slice(8, 9))
      if (
        xy500 < MESH.LEVEL_500.RANGE.MIN ||
        xy500 > MESH.LEVEL_500.RANGE.MAX
      ) {
        return false
      }
    }

    // 250m (x, y は 1~4 の範囲となる)
    if (code.length >= MESH.LEVEL_250.DIGIT) {
      const xy250 = Number(code.slice(9, 10))
      if (
        xy250 < MESH.LEVEL_250.RANGE.MIN ||
        xy250 > MESH.LEVEL_250.RANGE.MAX
      ) {
        return false
      }
    }

    // 125m (x, y は 1~4 の範囲となる)
    if (code.length >= MESH.LEVEL_125.DIGIT) {
      const n125 = Number(code.slice(10, 11))
      if (n125 < MESH.LEVEL_125.RANGE.MIN || n125 > MESH.LEVEL_125.RANGE.MAX) {
        return false
      }
    }
  }

  return true
}

function getLevel(code = null) {
  if (code === null) {
    return null
  }
  const digit = code.length
  if (digit === MESH.LEVEL_80000.DIGIT) {
    return 80000
  } else if (digit === MESH.LEVEL_10000.DIGIT) {
    return 10000
  } else if (digit === MESH.LEVEL_5000.DIGIT) {
    return 5000
  } else if (digit === MESH.LEVEL_2000.DIGIT && code.substr(-1, 1) === '5') {
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

function getCodeByLevel(code, level) {
  switch (level) {
    case 80000:
      return code.slice(0, MESH.LEVEL_80000.DIGIT)
    case 10000:
      return code.slice(0, MESH.LEVEL_10000.DIGIT)
    case 1000:
      return code.slice(0, MESH.LEVEL_1000.DIGIT)
    case 500:
      return code.slice(0, MESH.LEVEL_500.DIGIT)
    case 250:
      return code.slice(0, MESH.LEVEL_250.DIGIT)
    case 125:
      return code.slice(0, MESH.LEVEL_125.DIGIT)
    default:
      return code
  }
}

/**
 * 緯度経度から地域メッシュコードを取得する。
 * 算出式 : https://www.stat.go.jp/data/mesh/pdf/gaiyo1.pdf
 * @param {number} lat
 * @param {number} lng
 * @param {number} level
 */
function toCode(lat, lng, level) {
  if (isIntegrationAreaMeshByLevel(level)) {
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

  if (level) {
    code = getCodeByLevel(code, level)
  }
  return code
}

/**
 * 緯度経度から地域メッシュコードを取得する。統合地域メッシュ用。
 * 算出式 : https://www.stat.go.jp/data/mesh/pdf/gaiyo1.pdf
 * @param {number} lat
 * @param {number} lng
 * @param {number} level
 */
function toCodeForIntegrationAreaMesh(lat, lng, level) {
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

function toGeoJSON(code, properties) {
  if (isValidCode(code) === false) {
    throw new Error(`'${code}' is invalid mesh code.`)
  }
  const lv80000X = code.slice(2, 4)
  const lv80000Y = code.slice(0, 2)

  let minX, maxX, minY, maxY

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
    const lv10000X = code.slice(5, 6)
    const lv10000Y = code.slice(4, 5)
    minX += lv10000X * MESH.LEVEL_10000.DISTANCE.LNG
    maxX = minX + MESH.LEVEL_10000.DISTANCE.LNG
    minY += lv10000Y * MESH.LEVEL_10000.DISTANCE.LAT
    maxY = minY + MESH.LEVEL_10000.DISTANCE.LAT
  }

  if (isIntegrationAreaMeshByCode(code)) {
    if (code.length === MESH.LEVEL_5000.DIGIT) {
      const lv5000Num = code.slice(6, 7)
      const lv5000X = lv5000Num === '1' || lv5000Num === '3' ? 0 : 1
      const lv5000Y = lv5000Num === '1' || lv5000Num === '2' ? 0 : 1
      minX += lv5000X * MESH.LEVEL_5000.DISTANCE.LNG
      maxX = minX + MESH.LEVEL_5000.DISTANCE.LNG
      minY += lv5000Y * MESH.LEVEL_5000.DISTANCE.LAT
      maxY = minY + MESH.LEVEL_5000.DISTANCE.LAT
    } else if (code.length === MESH.LEVEL_2000.DIGIT) {
      const lv2000X = code.slice(7, 8)
      const lv2000Y = code.slice(6, 7)
      // TODO: 2で割るのが適切か要確認
      minX += (lv2000X / 2) * MESH.LEVEL_2000.DISTANCE.LNG
      maxX = minX + MESH.LEVEL_2000.DISTANCE.LNG
      minY += (lv2000Y / 2) * MESH.LEVEL_2000.DISTANCE.LAT
      maxY = minY + MESH.LEVEL_2000.DISTANCE.LAT
    }
  } else {
    if (code.length >= MESH.LEVEL_1000.DIGIT) {
      const lv1000X = code.slice(7, 8)
      const lv1000Y = code.slice(6, 7)
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
    return LEVEL_80000_CODES
  }
  if (isValidCode(code) === false) {
    throw new Error(`'${code}' is invalid mesh code.`)
  }
  const codes = []
  const level = getLevel(code)
  const targetLevel = AVAILABLE_LEVELS[AVAILABLE_LEVELS.indexOf(level) + 1]
  if (isIntegrationAreaMeshByLevel(targetLevel)) {
    if (targetLevel === 10000) {
      // 2次メッシュ
      for (let y2 = 0; y2 <= MESH.LEVEL_10000.RANGE.MAX; y2++) {
        for (let x2 = 0; x2 <= MESH.LEVEL_10000.RANGE.MAX; x2++) {
          codes.push(`${code}${y2}${x2}`)
        }
      }
    } else if (targetLevel === 5000) {
      const lv10000Code = code.slice(0, 6)
      for (
        let xy = MESH.LEVEL_5000.RANGE.MIN;
        xy <= MESH.LEVEL_5000.RANGE.MAX;
        xy++
      ) {
        if (isContain(code, `${lv10000Code}${xy}`)) {
          codes.push(`${lv10000Code}${xy}`)
        }
      }
    } else if (targetLevel === 2000) {
      const lv10000Code = code.slice(0, 6)
      const range = [...Array(MESH.LEVEL_2000.RANGE.MAX + 1).keys()].filter(
        (n) => n % 2 === 0
      )
      range.forEach((y) => {
        range.forEach((x) => {
          if (isContain(code, `${lv10000Code}${y}${x}5`)) {
            codes.push(`${lv10000Code}${y}${x}5`)
          }
        })
      })
    }
  } else {
    if (targetLevel === 1000) {
      const lv10000Code = code.slice(0, 6)
      // 3次メッシュ
      for (let y3 = 0; y3 <= MESH.LEVEL_1000.RANGE.MAX; y3++) {
        for (let x3 = 0; x3 <= MESH.LEVEL_1000.RANGE.MAX; x3++) {
          if (isContain(code, `${lv10000Code}${y3}${x3}`)) {
            codes.push(`${lv10000Code}${y3}${x3}`)
          }
        }
      }
    } else if (targetLevel === 500 || level === 250 || level === 125) {
      // 4次,5次,6次メッシュ
      const RANGE_NUM = 4 // 分割数(=マスの数)
      for (let i = 1; i <= RANGE_NUM; i++) {
        codes.push(`${code}${i}`)
      }
    }
  }

  return codes
}

module.exports = {
  toCode,
  toGeoJSON,
  getLevel,
  getCodes,
  isContain,
}

// 後で整理
// 統合地域メッシュであるか否か
function isIntegrationAreaMeshByLevel(level) {
  const INTEGRATION_AREA_MESH_LEVELS = [10000, 5000, 2000]
  return INTEGRATION_AREA_MESH_LEVELS.includes(level)
}

function isIntegrationAreaMeshByCode(code) {
  if (
    code.length === MESH.LEVEL_10000.DIGIT ||
    code.length === MESH.LEVEL_5000.DIGIT ||
    (code.length === MESH.LEVEL_2000.DIGIT && code.substr(-1, 1) === '5')
  ) {
    return true
  }
  return false
}

function isContain(codeA, codeB) {
  const aCoords = toGeoJSON(codeA).geometry.coordinates[0]
  const bCoords = toGeoJSON(codeB).geometry.coordinates[0]

  // TODO: ここら辺の四捨五入がうまくいっていない
  // japanmesh.isContain('5339703', '533970805') の出力が全て0になる
  const base = 0.0000001
  const aX = aCoords.map((c) => Math.round(c[0] * base) / base)
  const aY = aCoords.map((c) => Math.round(c[1] * base) / base)

  const aMinX = aX.reduce((a, b) => Math.min(a, b))
  const aMaxX = aX.reduce((a, b) => Math.max(a, b))
  const aMinY = aY.reduce((a, b) => Math.min(a, b))
  const aMaxY = aY.reduce((a, b) => Math.max(a, b))

  const filteredBCoords = bCoords.filter((coord) => {
    const x = Math.round(coord[0] * base) / base
    const y = Math.round(coord[1] * base) / base
    return aMinX <= x && x <= aMaxX && aMinY <= y && y <= aMaxY
  })

  if (filteredBCoords.length === 0) {
    return false
  }

  const fBX = filteredBCoords.map((c) => Math.round(c[0] * base) / base)
  const fBY = filteredBCoords.map((c) => Math.round(c[1] * base) / base)
  const fBMinX = fBX.reduce((a, b) => Math.min(a, b))
  const fBMaxX = fBX.reduce((a, b) => Math.max(a, b))
  const fBMinY = fBY.reduce((a, b) => Math.min(a, b))
  const fBMaxY = fBY.reduce((a, b) => Math.max(a, b))

  console.log(filteredBCoords)
  console.log(fBX, fBY)
  console.log(fBMinX, fBMaxX, fBMinY, fBMaxY)

  return fBMinX !== fBMaxX && fBMinY !== fBMaxY
}
