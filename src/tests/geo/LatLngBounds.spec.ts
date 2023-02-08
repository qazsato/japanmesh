import LatLngBounds from '../../geo/LatLngBounds'

test('LatLngBounds.getCenter', () => {
  const bounds = new LatLngBounds(1, 1, 0, 0)
  const center = bounds.getCenter()
  expect(center.lat).toBe(0.5)
  expect(center.lng).toBe(0.5)
})

test('LatLngBounds.getNorthEast', () => {
  const bounds = new LatLngBounds(1, 1, 0, 0)
  const center = bounds.getNorthEast()
  expect(center.lat).toBe(1)
  expect(center.lng).toBe(1)
})

test('LatLngBounds.getNorthWest', () => {
  const bounds = new LatLngBounds(1, 1, 0, 0)
  const center = bounds.getNorthWest()
  expect(center.lat).toBe(1)
  expect(center.lng).toBe(0)
})

test('LatLngBounds.getSouthWest', () => {
  const bounds = new LatLngBounds(1, 1, 0, 0)
  const center = bounds.getSouthWest()
  expect(center.lat).toBe(0)
  expect(center.lng).toBe(0)
})

test('LatLngBounds.getSouthEast', () => {
  const bounds = new LatLngBounds(1, 1, 0, 0)
  const center = bounds.getSouthEast()
  expect(center.lat).toBe(0)
  expect(center.lng).toBe(1)
})

test('LatLngBounds.contains', () => {
  const bounds = new LatLngBounds(1, 1, 0, 0)
  expect(bounds.contains({ lat: 0.5, lng: 0.5 })).toBe(true)
  expect(bounds.contains({ lat: 1, lng: 1 })).toBe(true)
  expect(bounds.contains({ lat: 1, lng: 0 })).toBe(true)
  expect(bounds.contains({ lat: 0, lng: 0 })).toBe(true)
  expect(bounds.contains({ lat: 0, lng: 1 })).toBe(true)
  expect(bounds.contains({ lat: -0.1, lng: 0 })).toBe(false)
  expect(bounds.contains({ lat: 0, lng: -0.1 })).toBe(false)
  expect(bounds.contains({ lat: 1.1, lng: 0 })).toBe(false)
  expect(bounds.contains({ lat: 0, lng: 1.1 })).toBe(false)
})
