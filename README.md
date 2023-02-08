# japanmesh

![test](https://github.com/qazsato/japanmesh/actions/workflows/test.yml/badge.svg)
[![npm version](https://badge.fury.io/js/japanmesh.svg)](https://badge.fury.io/js/japanmesh)
[![MIT License](http://img.shields.io/badge/license-MIT-blue.svg?style=flat)](LICENSE)

## About

JIS 規格で定められている地域メッシュを扱うためのユーティリティです。  
JISX0410 の仕様に準拠しており、地域メッシュコード、緯度経度の相互変換がおこなえます。

地域メッシュの区分は下記の通りです。

| レベル　 | 区画の種類　                          | 一辺の長さ　 | コード桁数　         | コード例                                                                        |
| -------- | ------------------------------------- | ------------ | -------------------- | ------------------------------------------------------------------------------- |
| 80000    | 第 1 次地域区画                       | 約 80km 　   | 4 桁　               | [5339](https://gist.github.com/qazsato/fb26be6de0ecbefd107d7c1eff35cc5e)        |
| 10000    | 10 倍地域メッシュ (第 2 次地域区画)　 | 約 10km 　   | 6 桁　               | [533945](https://gist.github.com/qazsato/027f8dca59b2895d1040adc7e8621cc4)      |
| 5000     | 5 倍地域メッシュ　                    | 約 5km 　    | 7 桁　               | [5339452](https://gist.github.com/qazsato/f9b7660c672c62a84febab62cbb29138)     |
| 2000     | 2 倍地域メッシュ　                    | 約 2km 　    | 9 桁 (末尾 5 固定)　 | [533945465](https://gist.github.com/qazsato/f5d511b69fa2ef81cab60777c50b3269)   |
| 1000     | 基準地域メッシュ(第 3 次地域区画)     | 約 1km 　    | 8 桁　               | [53394529](https://gist.github.com/qazsato/d9f219ba60e2d5193a8c1d65bce39fed)    |
| 500      | 2 分の 1 地域メッシュ                 | 約 500m 　   | 9 桁　               | [533945292](https://gist.github.com/qazsato/bd3fe7aa7fbff441fd543a92814692b5)   |
| 250      | 4 分の 1 地域メッシュ                 | 約 250m 　   | 10 桁　              | [5339452922](https://gist.github.com/qazsato/557430aaf0504f558b5cc45fcbe257b0)  |
| 125      | 8 分の 1 地域メッシュ                 | 約 125m 　   | 11 桁　              | [53394529221](https://gist.github.com/qazsato/443642c41a6b074d7ec2bf3d5204bb56) |

## Installation

```bash
$ npm install japanmesh
```

## Usage

```javascript
import { japanmesh } from 'japanmesh'
```

or

```javascript
const { japanmesh } = require('japanmesh')
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
=> { lat: 139.7125, lng: 139.725 }

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

## Reference

https://www.stat.go.jp/data/mesh/pdf/gaiyo1.pdf

## License

This project is licensed under the terms of the [MIT license](https://github.com/qazsato/japanmesh/blob/master/LICENSE).
