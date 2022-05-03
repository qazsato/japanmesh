const MESH = {
  // 第1次地域区画
  LEVEL_80000: {
    DIGIT: 4, // コード桁数
    DISTANCE: {
      // 緯度経度の間隔(単位:度) (緯度: 40分, 経度: 1度)
      LAT: 40 / 60,
      LNG: 1,
    },
    SECTION: {
      // 日本の国土にかかる第１次地域区画
      X: {
        MIN: 22,
        MAX: 53,
      },
      Y: {
        MIN: 30,
        MAX: 68,
      },
      LAT: {
        // 緯度 (Y)
        MIN: 20,
      },
      LNG: {
        // 経度 (X)
        MIN: 122,
      },
    },
  },
  // 10倍地域メッシュ (第2次地域区画)
  LEVEL_10000: {
    DIGIT: 6,
    RANGE: {
      MIN: 0,
      MAX: 7,
    },
    // 緯度: ５分, 経度: ７分30秒
    DISTANCE: {
      LAT: 5 / 60,
      LNG: 7 / 60 + 30 / 60 / 60,
    },
  },
  // 5倍地域メッシュ
  LEVEL_5000: {
    DIGIT: 7,
    RANGE: {
      MIN: 1,
      MAX: 4,
    },
    DISTANCE: {
      // 緯度経度の間隔(単位:度) (緯度: 150秒, 経度: 225秒)
      LAT: 150 / 60 / 60,
      LNG: 225 / 60 / 60,
    },
  },
  // 2倍地域メッシュ
  LEVEL_2000: {
    DIGIT: 9,
    RANGE: {
      MIN: 0,
      MAX: 8,
    },
    DISTANCE: {
      // 緯度経度の間隔(単位:度) (緯度: 60秒, 経度: 90秒)
      LAT: 60 / 60 / 60,
      LNG: 90 / 60 / 60,
    },
  },
  // 基準地域メッシュ (第3次地域区画)
  LEVEL_1000: {
    DIGIT: 8,
    RANGE: {
      MIN: 0,
      MAX: 9,
    },
    // 緯度: 30秒, 経度: 45秒
    DISTANCE: {
      LAT: 30 / 60 / 60,
      LNG: 45 / 60 / 60,
    },
  },
  // 2分の1地域メッシュ
  LEVEL_500: {
    DIGIT: 9,
    RANGE: {
      MIN: 1,
      MAX: 4,
    },
    // 緯度: 15秒, 経度: 22.5秒
    DISTANCE: {
      LAT: 15 / 60 / 60,
      LNG: 22.5 / 60 / 60,
    },
  },
  // 4分の1地域メッシュ
  LEVEL_250: {
    DIGIT: 10,
    RANGE: {
      MIN: 1,
      MAX: 4,
    },
    // 緯度: 7.5秒, 経度: 11.25秒
    DISTANCE: {
      LAT: 7.5 / 60 / 60,
      LNG: 11.25 / 60 / 60,
    },
  },
  // 8分の1地域メッシュ
  LEVEL_125: {
    DIGIT: 11,
    RANGE: {
      MIN: 1,
      MAX: 4,
    },
    // 緯度: 3.75秒, 経度: 5.625秒
    DISTANCE: {
      LAT: 3.75 / 60 / 60,
      LNG: 5.625 / 60 / 60,
    },
  },
}

module.exports = MESH
