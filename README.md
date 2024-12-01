# japanmesh

![test](https://github.com/qazsato/japanmesh/actions/workflows/test.yml/badge.svg)
[![npm version](https://badge.fury.io/js/japanmesh.svg)](https://badge.fury.io/js/japanmesh)
[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## About

JIS 規格で定められている地域メッシュを扱うためのユーティリティです。  
JISX0410 の仕様に準拠しており、地域メッシュコード、緯度経度の相互変換がおこなえます。

地域メッシュの区分は下記の通りです。

| レベル　 | 区画の種類　                       | 一辺の長さ　 | コード桁数　      | コード例                                                            |
| -------- | ---------------------------------- | ------------ | ----------------- | ------------------------------------------------------------------- |
| 80000    | 80倍地域メッシュ (第1次地域区画)　 | 約80km　     | 4桁　             | [5339](https://qazsato.github.io/japanmesh?code=5339)               |
| 10000    | 10倍地域メッシュ (第2次地域区画)　 | 約10km　     | 6桁　             | [533945](https://qazsato.github.io/japanmesh?code=533945)           |
| 5000     | 5倍地域メッシュ　                  | 約5km　      | 7桁　             | [5339452](https://qazsato.github.io/japanmesh?code=5339452)         |
| 2000     | 2倍地域メッシュ　                  | 約2km　      | 9桁 (末尾5固定)　 | [533945465](https://qazsato.github.io/japanmesh?code=533945465)     |
| 1000     | 基準地域メッシュ (第3次地域区画)   | 約1km　      | 8桁　             | [53394529](https://qazsato.github.io/japanmesh?code=53394529)       |
| 500      | 2分の1地域メッシュ                 | 約500m　     | 9桁　             | [533945292](https://qazsato.github.io/japanmesh?code=533945292)     |
| 250      | 4分の1地域メッシュ                 | 約250m　     | 10桁　            | [5339452922](https://qazsato.github.io/japanmesh?code=5339452922)   |
| 125      | 8分の1地域メッシュ                 | 約125m　     | 11桁　            | [53394529221](https://qazsato.github.io/japanmesh?code=53394529221) |

https://qazsato.github.io/japanmesh で全国の地域メッシュを確認できます。

## Installation

```bash
npm install japanmesh
```

## Usage

```javascript
import { japanmesh } from 'japanmesh'
```

### japanmesh.toCode(lat, lng, [level])

指定した緯度経度(WGS84)から、地域メッシュコードを取得します。

```javascript
japanmesh.toCode(35.70078, 139.71475, 1000)
=> '53394547'
```

### japanmesh.toLatLngBounds(code)

指定した地域メッシュコードから、緯度経度の境界オブジェクトを取得します。

```javascript
const bounds = japanmesh.toLatLngBounds('53394547')

bounds.getCenter() // 境界の中央座標
=> { lat: 35.704166666666666, lng: 139.71875 }

bounds.getNorthEast() // 境界の北東座標
=> { lat: 35.70833333333333, lng: 139.725 }

bounds.getNorthWest() // 境界の北西座標
=> { lat: 35.70833333333333, lng: 139.7125 }

bounds.getSouthWest() // 境界の南西座標
=> { lat: 35.699999999999996, lng: 139.7125 }

bounds.getSouthEast() // 境界の南東座標
=> { lat: 35.699999999999996, lng: 139.725 }

bounds.contains({ lat: 35.70416666, lng: 139.71875 }) // 境界内か否か
=> true
```

### japanmesh.toGeoJSON(code, [properties])

指定した地域メッシュコードから、ポリゴンデータ(GeoJSON)を取得します。

```javascript
japanmesh.toGeoJSON('53394547')
=>
{
  "type": "Feature",
  "properties": {},
  "geometry": {
    "type": "Polygon",
    "coordinates": [
      [
        [139.725, 35.70833333333333],
        [139.7125, 35.70833333333333],
        [139.7125, 35.699999999999996],
        [139.725, 35.699999999999996],
        [139.725, 35.70833333333333]
      ]
    ]
  }
}
```

### japanmesh.getLevel(code)

指定した地域メッシュコードのレベルを取得します。

```javascript
japanmesh.getLevel('53394547')
=> 1000
```

### japanmesh.getCodes([code], [level])

指定した地域メッシュコード内の該当レベルの地域メッシュコードを取得します。  
code, level 未指定時は第 1 次地域区画の地域メッシュコードを取得します。

```javascript
japanmesh.getCodes('53394547', 500)
=> [ '533945471', '533945472', '533945473', '533945474' ]
```

### japanmesh.getCodesWithinBounds(bounds, [level])

指定した境界内の該当レベルの地域メッシュコードを取得します。  
level 未指定時は第 1 次地域区画の地域メッシュコードを取得します。

```javascript
import { japanmesh, LatLngBounds } from 'japanmesh'

const bounds = new LatLngBounds(36, 140, 35, 139) // northLat, eastLng, southLat, westLng
japanmesh.getCodesWithinBounds(bounds, 10000)
=> [ '523940', '523941', '523942', '523943', '523944', ... ]
```

### japanmesh.isValidCode(code)

指定した地域メッシュコードが、有効なコードかどうか判定します。

```javascript
japanmesh.isValidCode('5339')
=> true

japanmesh.isValidCode('9999')
=> false
```

## Reference

https://www.stat.go.jp/data/mesh/pdf/gaiyo1.pdf

## License

This project is licensed under the terms of the [MIT license](https://github.com/qazsato/japanmesh/blob/master/LICENSE).
