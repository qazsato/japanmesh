/* eslint-disable @typescript-eslint/unbound-method */
import { JapanMesh } from './geo/JapanMesh'

export const japanmesh = {
  toCode: JapanMesh.toCode,
  toLatLngBounds: JapanMesh.toLatLngBounds,
  toGeoJSON: JapanMesh.toGeoJSON,
  getLevel: JapanMesh.getLevel,
  getCodes: JapanMesh.getCodes,
}
