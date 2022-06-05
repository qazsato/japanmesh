# japanmesh

![execute test](https://github.com/qazsato/japanmesh/actions/workflows/execute-test.yml/badge.svg)
[![npm version](https://badge.fury.io/js/japanmesh.svg)](https://badge.fury.io/js/japanmesh)
[![MIT License](http://img.shields.io/badge/license-MIT-blue.svg?style=flat)](LICENSE)

## About

JIS 規格で定められている地域メッシュを扱うためのユーティリティです。  
JISX0410 の仕様に準拠しており、地域メッシュコード、緯度経度の相互変換がおこなえます。

地域メッシュの区分は下記の通りです。  

| レベル　 | 区画の種類　                   | 一辺の長さ　 | コード桁数　      | コード例                                                                          |
| ------ | --------------------------- | --------- | -------------- | ------------------------------------------------------------------------------- |
| 80000  | 第1次地域区画                  | 約80km　   | 4桁　           | [5339](https://gist.github.com/qazsato/fb26be6de0ecbefd107d7c1eff35cc5e)        |
| 10000  | 10倍地域メッシュ (第2次地域区画)　 | 約10km　   | 6桁　           | [533945](https://gist.github.com/qazsato/027f8dca59b2895d1040adc7e8621cc4)      |
| 5000   | 5倍地域メッシュ　               | 約5km　    | 7桁　           |                                                                                 |
| 2000   | 2倍地域メッシュ　               | 約2km　    | 9桁 (末尾5固定)　 |                                                                                 |
| 1000   | 基準地域メッシュ(第2次地域区画)    | 約1km　    | 8桁　           | [53394529](https://gist.github.com/qazsato/d9f219ba60e2d5193a8c1d65bce39fed)    |
| 500    | 2分の1地域メッシュ              | 約500m　   | 9桁　           | [533945292](https://gist.github.com/qazsato/bd3fe7aa7fbff441fd543a92814692b5)   |
| 250    | 4分の1地域メッシュ              | 約250m　   | 10桁　          | [5339452922](https://gist.github.com/qazsato/557430aaf0504f558b5cc45fcbe257b0)  |
| 125    | 8分の1地域メッシュ              | 約125m　   | 11桁　          | [53394529221](https://gist.github.com/qazsato/443642c41a6b074d7ec2bf3d5204bb56) |

## Installation

```
$ npm install japanmesh
```

## Usage

```javascript
import { japanmesh } from 'japanmesh'

OR

const { japanmesh } = require('japanmesh')
```

### japanmesh.toCode(lat, lng[, level])

指定した緯度経度(WGS84)から、地域メッシュコードを取得します。  

```javascript
japanmesh.toCode(35.70078, 139.71475, 1000)
=> '53394547'
```

### japanmesh.toGeoJSON(code[, properties])

指定した地域メッシュコードから、ポリゴンデータ(GeoJSON)を取得します。  

```javascript
japanmesh.toGeoJSON('53394547')
=>{
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

### japanmesh.getCodes([code])

指定した地域メッシュコードの直下のレベルの地域メッシュコードを取得します。  
未指定時は第1次地域区画の地域メッシュコードを取得します。

```javascript
japanmesh.getCodes('53394547')
=> [ '533945471', '533945472', '533945473', '533945474' ]
```

## License

This project is licensed under the terms of the [MIT license](https://github.com/qazsato/japanmesh/blob/master/LICENSE).