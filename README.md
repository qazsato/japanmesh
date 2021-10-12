# japanmesh

[![Build Status](https://travis-ci.org/qazsato/japanmesh.svg?branch=master)](https://travis-ci.org/qazsato/japanmesh)
[![codecov](https://codecov.io/gh/qazsato/japanmesh/branch/master/graph/badge.svg)](https://codecov.io/gh/qazsato/japanmesh)
[![npm version](https://badge.fury.io/js/japanmesh.svg)](https://badge.fury.io/js/japanmesh)
[![MIT License](http://img.shields.io/badge/license-MIT-blue.svg?style=flat)](LICENSE)

## About

JIS 規格で定められている地域メッシュを扱うためのユーティリティです。

JISX0410 の仕様に準拠しており、地域メッシュコード、緯度経度の相互変換がおこなえます。

地域メッシュの区分は下記の通りです。

レベル | 名称 | コード桁数 | 一辺の長さ
:-|:-|:-|:-
80000 | 第1次地域区画 | 4桁 | 約80km
10000 | 10倍地域メッシュ (第2次地域区画) | 6桁 | 約10km
5000 | 5倍地域メッシュ | 7桁 | 約5km
2000 | 2倍地域メッシュ | 9桁 (末尾5固定) | 約2km
1000 | 基準地域メッシュ (第3次地域区画) | 8桁 | 約1km
500 | 2分の1地域メッシュ | 9桁 | 約500m
250 | 4分の1地域メッシュ | 10桁 | 約250m
125 | 8分の1地域メッシュ | 11桁 | 約125m

## Installation

```
$ npm install japanmesh
```

## Usage

```javascript
const japanmesh = require('japanmesh')
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