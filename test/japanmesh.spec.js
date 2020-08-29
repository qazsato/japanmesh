const japanmesh = require('./../index')
const LEVEL1_CODES = require('./../src/constants/level1_codes')

test('japanmesh.toCode', () => {
  expect(japanmesh.toCode(35.70078, 139.71475)).toBe('5339454711')
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
  const level = japanmesh.getLevel('53394547')
  expect(level).toBe(3)
})

test('japanmesh.getCodes', () => {
  const codes = japanmesh.getCodes()
  expect(codes).toBe(LEVEL1_CODES)
})
