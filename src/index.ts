/* eslint-disable @typescript-eslint/unbound-method */
import { JapanMesh } from './geo/JapanMesh'
import { LatLngBounds } from './geo/LatLngBounds'

export const japanmesh = {
  toCode: JapanMesh.toCode,
  toLatLngBounds: JapanMesh.toLatLngBounds,
  toGeoJSON: JapanMesh.toGeoJSON,
  getLevel: JapanMesh.getLevel,
  getCodes: JapanMesh.getCodes,
  getCodesWithinBounds: JapanMesh.getCodesWithinBounds,
  isValidCode: JapanMesh.isValidCode,
}

export { LatLngBounds }
