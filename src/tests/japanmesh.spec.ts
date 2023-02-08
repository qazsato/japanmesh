import { japanmesh } from '../japanmesh'
import { LEVEL_80000_CODES } from '../constants'
import { GEO_JSON, CODE } from './data'

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

test('japanmesh.toCode: 日本国外の緯度経度指定で例外が発生すること', () => {
  expect(() => japanmesh.toCode(0, 0, 80000)).toThrow()
  expect(() => japanmesh.toCode(0, 0, 10000)).toThrow()
  expect(() => japanmesh.toCode(0, 0, 5000)).toThrow()
  expect(() => japanmesh.toCode(0, 0, 2000)).toThrow()
  expect(() => japanmesh.toCode(0, 0, 1000)).toThrow()
  expect(() => japanmesh.toCode(0, 0, 500)).toThrow()
  expect(() => japanmesh.toCode(0, 0, 250)).toThrow()
  expect(() => japanmesh.toCode(0, 0, 125)).toThrow()
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

test('japanmesh.toLatLngBounds: 存在するコード指定で LatLngBounds オブジェクトが取得できること', () => {
  expect(japanmesh.toLatLngBounds('5438').constructor.name).toEqual(
    'LatLngBounds'
  )
  expect(japanmesh.toLatLngBounds('533945').constructor.name).toEqual(
    'LatLngBounds'
  )
  expect(japanmesh.toLatLngBounds('5339452').constructor.name).toEqual(
    'LatLngBounds'
  )
  expect(japanmesh.toLatLngBounds('533945465').constructor.name).toEqual(
    'LatLngBounds'
  )
  expect(japanmesh.toLatLngBounds('53394547').constructor.name).toEqual(
    'LatLngBounds'
  )
  expect(japanmesh.toLatLngBounds('533945471').constructor.name).toEqual(
    'LatLngBounds'
  )
  expect(japanmesh.toLatLngBounds('5339454711').constructor.name).toEqual(
    'LatLngBounds'
  )
  expect(japanmesh.toLatLngBounds('53394547112').constructor.name).toEqual(
    'LatLngBounds'
  )
})

test('japanmesh.toLatLngBounds: 無効なコード指定で例外が発生すること', () => {
  expect(() => japanmesh.toLatLngBounds('9')).toThrow()
  expect(() => japanmesh.toLatLngBounds('99')).toThrow()
  expect(() => japanmesh.toLatLngBounds('999')).toThrow()
  expect(() => japanmesh.toLatLngBounds('9999')).toThrow()
  expect(() => japanmesh.toLatLngBounds('999999')).toThrow()
  expect(() => japanmesh.toLatLngBounds('9999999')).toThrow()
  expect(() => japanmesh.toLatLngBounds('99999999')).toThrow()
  expect(() => japanmesh.toLatLngBounds('999999999')).toThrow()
  expect(() => japanmesh.toLatLngBounds('9999999999')).toThrow()
  expect(() => japanmesh.toLatLngBounds('99999999999')).toThrow()
})

test('japanmesh.toGeoJSON: 存在するコード指定で GEO JSON が取得できること', () => {
  expect(japanmesh.toGeoJSON('5438')).toEqual(GEO_JSON[5438])
  expect(japanmesh.toGeoJSON('533945')).toEqual(GEO_JSON[533945])
  expect(japanmesh.toGeoJSON('5339452')).toEqual(GEO_JSON[5339452])
  expect(japanmesh.toGeoJSON('533945465')).toEqual(GEO_JSON[533945465])
  expect(japanmesh.toGeoJSON('53394547')).toEqual(GEO_JSON[53394547])
  expect(japanmesh.toGeoJSON('533945471')).toEqual(GEO_JSON[533945471])
  expect(japanmesh.toGeoJSON('5339454711')).toEqual(GEO_JSON[5339454711])
  expect(japanmesh.toGeoJSON('53394547112')).toEqual(GEO_JSON[53394547112])
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

test('japanmesh.getLevel: 区画定義外の存在しない無効なコード指定で例外が発生すること', () => {
  expect(() => japanmesh.getLevel('533999')).toThrow()
  expect(() => japanmesh.getLevel('5339459')).toThrow()
  expect(() => japanmesh.getLevel('533945995')).toThrow()
  expect(() => japanmesh.getLevel('533945479')).toThrow()
  expect(() => japanmesh.getLevel('5339454719')).toThrow()
  expect(() => japanmesh.getLevel('53394547119')).toThrow()
})

test('japanmesh.getCodes: コード、レベル未指定で第１次地域区画の全メッシュコードが取得できること', () => {
  expect(japanmesh.getCodes()).toEqual(LEVEL_80000_CODES)
})

test('japanmesh.getCodes: コード、直下のレベル指定で配下のコードが取得できること', () => {
  expect(japanmesh.getCodes('5339', 10000)).toEqual(CODE.LV10000_CODES_5339)
  expect(japanmesh.getCodes('533945', 5000)).toEqual(CODE.LV5000_CODES_533945)
  expect(japanmesh.getCodes('533945', 2000)).toEqual(CODE.LV2000_CODES_533945)
  expect(japanmesh.getCodes('533945', 1000)).toEqual(CODE.LV1000_CODES_533945)
  expect(japanmesh.getCodes('53394547', 500)).toEqual(CODE.LV500_CODES_53394547)
  expect(japanmesh.getCodes('533945471', 250)).toEqual(
    CODE.LV250_CODES_533945471
  )
  expect(japanmesh.getCodes('5339454711', 125)).toEqual(
    CODE.LV125_CODES_5339454711
  )
})

test('japanmesh.getCodes: 5kmメッシュのコード、レベル指定で配下のコードが取得できること', () => {
  expect(japanmesh.getCodes('5339451', 2000)).toEqual(CODE.LV2000_CODES_5339451)
  expect(japanmesh.getCodes('5339452', 2000)).toEqual(CODE.LV2000_CODES_5339452)
  expect(japanmesh.getCodes('5339453', 2000)).toEqual(CODE.LV2000_CODES_5339453)
  expect(japanmesh.getCodes('5339454', 2000)).toEqual(CODE.LV2000_CODES_5339454)
  expect(japanmesh.getCodes('5339451', 1000)).toEqual(CODE.LV1000_CODES_5339451)
  expect(japanmesh.getCodes('5339452', 1000)).toEqual(CODE.LV1000_CODES_5339452)
  expect(japanmesh.getCodes('5339453', 1000)).toEqual(CODE.LV1000_CODES_5339453)
  expect(japanmesh.getCodes('5339454', 1000)).toEqual(CODE.LV1000_CODES_5339454)
})

test('japanmesh.getCodes: 2kmメッシュのコード、レベル指定で配下のコードが取得できること', () => {
  expect(japanmesh.getCodes('533945465', 1000)).toEqual(
    CODE.LV1000_CODES_533945465
  )
})

test('japanmesh.getCodes: コード未指定で例外が発生すること', () => {
  expect(() => japanmesh.getCodes(null, 125)).toThrow()
})

test('japanmesh.getCodes: レベル未指定で例外が発生すること', () => {
  expect(() => japanmesh.getCodes('5339')).toThrow()
})

test('japanmesh.getCodes: 無効なコード指定で例外が発生すること', () => {
  expect(() => japanmesh.getCodes('9', 125)).toThrow()
  expect(() => japanmesh.getCodes('99', 125)).toThrow()
  expect(() => japanmesh.getCodes('999', 125)).toThrow()
  expect(() => japanmesh.getCodes('9999', 125)).toThrow()
  expect(() => japanmesh.getCodes('999999', 125)).toThrow()
  expect(() => japanmesh.getCodes('9999999', 125)).toThrow()
  expect(() => japanmesh.getCodes('99999999', 125)).toThrow()
  expect(() => japanmesh.getCodes('999999999', 125)).toThrow()
  expect(() => japanmesh.getCodes('9999999999', 125)).toThrow()
  expect(() => japanmesh.getCodes('99999999999', 125)).toThrow()
})

test('japanmesh.getCodes: 無効なレベル指定で例外が発生すること', () => {
  expect(() => japanmesh.getCodes('5339', 9999)).toThrow()
})

test('japanmesh.getCodes: 指定したレベルがコードのレベルよりも上の場合例外が発生すること', () => {
  expect(() => japanmesh.getCodes('533945', 80000)).toThrow()
})
