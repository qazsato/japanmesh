import japanmesh from '../japanmesh'
import { LEVEL_80000_CODES } from '../constants'

test('japanmesh.toCode: レベル指定で適切なコードが取得できること', () => {
  expect(japanmesh.toCode(35.70078, 139.71475, 80000)).toBe('5339')
  expect(japanmesh.toCode(35.70078, 139.71475, 10000)).toBe('533945')
  expect(japanmesh.toCode(35.70078, 139.71475, 5000)).toBe('5339452')
  expect(japanmesh.toCode(35.70078, 139.71475, 2000)).toBe('533945465')
  expect(japanmesh.toCode(35.70078, 139.71475, 1000)).toBe('53394547')
  expect(japanmesh.toCode(35.70078, 139.71475, 500)).toBe('533945471')
  expect(japanmesh.toCode(35.70078, 139.71475, 250)).toBe('5339454711')
  expect(japanmesh.toCode(35.70078, 139.71475, 125)).toBe('53394547112')
})

test('japanmesh.toCode: レベル未指定で8分の1地域メッシュ(125m)のコードが取得できること', () => {
  expect(japanmesh.toCode(35.70078, 139.71475)).toBe('53394547112')
})

test('japanmesh.toCode: 無効なレベル指定で例外が発生すること', () => {
  // NOTE: v1.0 以前のレベル定義は 1 ~ 6 であった
  expect(() => japanmesh.toCode(35.70078, 139.71475, 1)).toThrow()
  expect(() => japanmesh.toCode(35.70078, 139.71475, 2)).toThrow()
  expect(() => japanmesh.toCode(35.70078, 139.71475, 3)).toThrow()
  expect(() => japanmesh.toCode(35.70078, 139.71475, 4)).toThrow()
  expect(() => japanmesh.toCode(35.70078, 139.71475, 5)).toThrow()
  expect(() => japanmesh.toCode(35.70078, 139.71475, 6)).toThrow()
})

test('japanmesh.toGeoJSON', () => {
  const jsonLv80000 = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [139, 36.666666666666664],
          [138, 36.666666666666664],
          [138, 36],
          [139, 36],
          [139, 36.666666666666664],
        ],
      ],
    },
  }
  const jsonLv10000 = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [139.75, 35.75],
          [139.625, 35.75],
          [139.625, 35.666666666666664],
          [139.75, 35.666666666666664],
          [139.75, 35.75],
        ],
      ],
    },
  }
  const jsonLv5000 = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [139.75, 35.70833333333333],
          [139.6875, 35.70833333333333],
          [139.6875, 35.666666666666664],
          [139.75, 35.666666666666664],
          [139.75, 35.70833333333333],
        ],
      ],
    },
  }
  const jsonLv2000 = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [139.725, 35.71666666666666],
          [139.7, 35.71666666666666],
          [139.7, 35.699999999999996],
          [139.725, 35.699999999999996],
          [139.725, 35.71666666666666],
        ],
      ],
    },
  }
  const jsonLv1000 = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [139.725, 35.70833333333333],
          [139.7125, 35.70833333333333],
          [139.7125, 35.699999999999996],
          [139.725, 35.699999999999996],
          [139.725, 35.70833333333333],
        ],
      ],
    },
  }
  const jsonLv500 = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [139.71875, 35.704166666666666],
          [139.7125, 35.704166666666666],
          [139.7125, 35.699999999999996],
          [139.71875, 35.699999999999996],
          [139.71875, 35.704166666666666],
        ],
      ],
    },
  }
  const jsonLv250 = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [139.71562500000002, 35.70208333333333],
          [139.7125, 35.70208333333333],
          [139.7125, 35.699999999999996],
          [139.71562500000002, 35.699999999999996],
          [139.71562500000002, 35.70208333333333],
        ],
      ],
    },
  }
  const jsonLv125 = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [139.71562500000002, 35.70104166666666],
          [139.7140625, 35.70104166666666],
          [139.7140625, 35.699999999999996],
          [139.71562500000002, 35.699999999999996],
          [139.71562500000002, 35.70104166666666],
        ],
      ],
    },
  }
  expect(japanmesh.toGeoJSON('5438')).toEqual(jsonLv80000)
  expect(japanmesh.toGeoJSON('533945')).toEqual(jsonLv10000)
  expect(japanmesh.toGeoJSON('5339452')).toEqual(jsonLv5000)
  expect(japanmesh.toGeoJSON('533945465')).toEqual(jsonLv2000)
  expect(japanmesh.toGeoJSON('53394547')).toEqual(jsonLv1000)
  expect(japanmesh.toGeoJSON('533945471')).toEqual(jsonLv500)
  expect(japanmesh.toGeoJSON('5339454711')).toEqual(jsonLv250)
  expect(japanmesh.toGeoJSON('53394547112')).toEqual(jsonLv125)
})

test('japanmesh.toGeoJSON: 無効なコード指定で例外が発生すること', () => {
  expect(() => japanmesh.toGeoJSON('9')).toThrow()
  expect(() => japanmesh.toGeoJSON('99')).toThrow()
  expect(() => japanmesh.toGeoJSON('999')).toThrow()
  expect(() => japanmesh.toGeoJSON('9999')).toThrow()
  expect(() => japanmesh.toGeoJSON('999999')).toThrow()
  expect(() => japanmesh.toGeoJSON('9999999')).toThrow()
  expect(() => japanmesh.toGeoJSON('99999999')).toThrow()
  expect(() => japanmesh.toGeoJSON('999999999')).toThrow()
  expect(() => japanmesh.toGeoJSON('9999999999')).toThrow()
  expect(() => japanmesh.toGeoJSON('99999999999')).toThrow()
})

test('japanmesh.getLevel: 存在するコード指定でレベルが取得できること', () => {
  expect(japanmesh.getLevel('5339')).toBe(80000)
  expect(japanmesh.getLevel('533945')).toBe(10000)
  expect(japanmesh.getLevel('5339452')).toBe(5000)
  expect(japanmesh.getLevel('533945465')).toBe(2000)
  expect(japanmesh.getLevel('53394547')).toBe(1000)
  expect(japanmesh.getLevel('533945471')).toBe(500)
  expect(japanmesh.getLevel('5339454711')).toBe(250)
  expect(japanmesh.getLevel('53394547112')).toBe(125)
})

test('japanmesh.getLevel: 無効なコード指定で例外が発生すること', () => {
  expect(() => japanmesh.getLevel('9')).toThrow()
  expect(() => japanmesh.getLevel('99')).toThrow()
  expect(() => japanmesh.getLevel('999')).toThrow()
  expect(() => japanmesh.getLevel('9999')).toThrow()
  expect(() => japanmesh.getLevel('999999')).toThrow()
  expect(() => japanmesh.getLevel('9999999')).toThrow()
  expect(() => japanmesh.getLevel('99999999')).toThrow()
  expect(() => japanmesh.getLevel('999999999')).toThrow()
  expect(() => japanmesh.getLevel('9999999999')).toThrow()
  expect(() => japanmesh.getLevel('99999999999')).toThrow()
})

test('japanmesh.getCodes', () => {
  expect(japanmesh.getCodes()).toEqual(LEVEL_80000_CODES)
  const lv10000Codes = [
    '533900',
    '533901',
    '533902',
    '533903',
    '533904',
    '533905',
    '533906',
    '533907',
    '533910',
    '533911',
    '533912',
    '533913',
    '533914',
    '533915',
    '533916',
    '533917',
    '533920',
    '533921',
    '533922',
    '533923',
    '533924',
    '533925',
    '533926',
    '533927',
    '533930',
    '533931',
    '533932',
    '533933',
    '533934',
    '533935',
    '533936',
    '533937',
    '533940',
    '533941',
    '533942',
    '533943',
    '533944',
    '533945',
    '533946',
    '533947',
    '533950',
    '533951',
    '533952',
    '533953',
    '533954',
    '533955',
    '533956',
    '533957',
    '533960',
    '533961',
    '533962',
    '533963',
    '533964',
    '533965',
    '533966',
    '533967',
    '533970',
    '533971',
    '533972',
    '533973',
    '533974',
    '533975',
    '533976',
    '533977',
  ]
  expect(japanmesh.getCodes('5339')).toEqual(lv10000Codes)

  const lv1000Codes = [
    '53394500',
    '53394501',
    '53394502',
    '53394503',
    '53394504',
    '53394505',
    '53394506',
    '53394507',
    '53394508',
    '53394509',
    '53394510',
    '53394511',
    '53394512',
    '53394513',
    '53394514',
    '53394515',
    '53394516',
    '53394517',
    '53394518',
    '53394519',
    '53394520',
    '53394521',
    '53394522',
    '53394523',
    '53394524',
    '53394525',
    '53394526',
    '53394527',
    '53394528',
    '53394529',
    '53394530',
    '53394531',
    '53394532',
    '53394533',
    '53394534',
    '53394535',
    '53394536',
    '53394537',
    '53394538',
    '53394539',
    '53394540',
    '53394541',
    '53394542',
    '53394543',
    '53394544',
    '53394545',
    '53394546',
    '53394547',
    '53394548',
    '53394549',
    '53394550',
    '53394551',
    '53394552',
    '53394553',
    '53394554',
    '53394555',
    '53394556',
    '53394557',
    '53394558',
    '53394559',
    '53394560',
    '53394561',
    '53394562',
    '53394563',
    '53394564',
    '53394565',
    '53394566',
    '53394567',
    '53394568',
    '53394569',
    '53394570',
    '53394571',
    '53394572',
    '53394573',
    '53394574',
    '53394575',
    '53394576',
    '53394577',
    '53394578',
    '53394579',
    '53394580',
    '53394581',
    '53394582',
    '53394583',
    '53394584',
    '53394585',
    '53394586',
    '53394587',
    '53394588',
    '53394589',
    '53394590',
    '53394591',
    '53394592',
    '53394593',
    '53394594',
    '53394595',
    '53394596',
    '53394597',
    '53394598',
    '53394599',
  ]
  expect(japanmesh.getCodes('533945')).toEqual(lv1000Codes)

  const lv500Codes = ['533945471', '533945472', '533945473', '533945474']
  expect(japanmesh.getCodes('53394547')).toEqual(lv500Codes)

  const lv250Codes = ['5339454711', '5339454712', '5339454713', '5339454714']
  expect(japanmesh.getCodes('533945471')).toEqual(lv250Codes)

  const lv125Codes = [
    '53394547111',
    '53394547112',
    '53394547113',
    '53394547114',
  ]
  expect(japanmesh.getCodes('5339454711')).toEqual(lv125Codes)
})
