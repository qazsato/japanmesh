import { LatLng } from './LatLng'

export class LatLngBounds {
  private northLat: number
  private eastLng: number
  private southLat: number
  private westLng: number

  constructor(
    northLat: number,
    eastLng: number,
    southLat: number,
    westLng: number,
  ) {
    this.northLat = northLat
    this.eastLng = eastLng
    this.southLat = southLat
    this.westLng = westLng
  }

  getCenter(): LatLng {
    const lat = (this.northLat + this.southLat) / 2
    const lng = (this.eastLng + this.westLng) / 2
    return new LatLng(lat, lng)
  }

  getNorthEast(): LatLng {
    return new LatLng(this.northLat, this.eastLng)
  }

  getNorthWest(): LatLng {
    return new LatLng(this.northLat, this.westLng)
  }

  getSouthWest(): LatLng {
    return new LatLng(this.southLat, this.westLng)
  }

  getSouthEast(): LatLng {
    return new LatLng(this.southLat, this.eastLng)
  }

  contains(latLng: LatLng) {
    const lat = latLng.lat
    const lng = latLng.lng
    return (
      this.southLat <= lat &&
      lat <= this.northLat &&
      this.westLng <= lng &&
      lng <= this.eastLng
    )
  }
}
