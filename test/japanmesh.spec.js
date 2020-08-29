const japanmesh = require('./../index')
const LEVEL1_CODES = require('./../src/constants/level1_codes')

test('japanmesh.toCode', () => {
  expect(japanmesh.toCode(35.70078, 139.71475, 1)).toBe('5339')
  expect(japanmesh.toCode(35.70078, 139.71475, 2)).toBe('533945')
  expect(japanmesh.toCode(35.70078, 139.71475, 3)).toBe('53394547')
  expect(japanmesh.toCode(35.70078, 139.71475, 4)).toBe('533945471')
  expect(japanmesh.toCode(35.70078, 139.71475, 5)).toBe('5339454711')
  expect(japanmesh.toCode(35.70078, 139.71475, 6)).toBe('53394547112')
  expect(japanmesh.toCode(35.70078, 139.71475)).toBe('53394547112')
})

test('japanmesh.toGeoJSON', () => {
  const geojson = {
    geometry: {
      coordinates: [
        [
          [139, 36.666666666666664],
          [138, 36.666666666666664],
          [138, 36],
          [139, 36],
          [139, 36.666666666666664],
        ],
      ],
      type: 'Polygon',
    },
    properties: {},
    type: 'Feature',
  }
  expect(japanmesh.toGeoJSON('5438')).toEqual(geojson)
})

test('japanmesh.getLevel', () => {
  expect(japanmesh.getLevel('5339')).toBe(1)
  expect(japanmesh.getLevel('533945')).toBe(2)
  expect(japanmesh.getLevel('53394547')).toBe(3)
  expect(japanmesh.getLevel('533945471')).toBe(4)
  expect(japanmesh.getLevel('5339454711')).toBe(5)
  expect(japanmesh.getLevel('1')).toBe(null)
})

test('japanmesh.getCodes', () => {
  const codes = japanmesh.getCodes()
  expect(codes).toBe(LEVEL1_CODES)
})
