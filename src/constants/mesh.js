const MESH = {
  // 第１次地域区画
  LEVEL_80000: {
    DIGIT: 4, // コード桁数
    DIVISION: {
      // メッシュ分割数
      X: 32,
      Y: 39,
    },
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
  // 第２次地域区画
  LEVEL_10000: {
    DIGIT: 6,
    DIVISION: {
      X: 8,
      Y: 8,
    },
    // 緯度: ５分, 経度: ７分30秒
    DISTANCE: {
      LAT: 5 / 60,
      LNG: 7 / 60 + 30 / 60 / 60,
    },
  },
  // 基準地域メッシュ(第３次地域区画)
  LEVEL_1000: {
    DIGIT: 8,
    DIVISION: {
      X: 10,
      Y: 10,
    },
    // 緯度: 30秒, 経度: 45秒
    DISTANCE: {
      LAT: 30 / 60 / 60,
      LNG: 45 / 60 / 60,
    },
  },
  // ２分の１地域メッシュ
  LEVEL_500: {
    DIGIT: 9,
    DIVISION: {
      X: 2,
      Y: 2,
    },
    // 緯度: 15秒, 経度: 22.5秒
    DISTANCE: {
      LAT: 15 / 60 / 60,
      LNG: 22.5 / 60 / 60,
    },
  },
  // ４分の１地域メッシュ
  LEVEL_250: {
    DIGIT: 10,
    DIVISION: {
      X: 2,
      Y: 2,
    },
    // 緯度: 7.5秒, 経度: 11.25秒
    DISTANCE: {
      LAT: 7.5 / 60 / 60,
      LNG: 11.25 / 60 / 60,
    },
  },
  // ８分の１地域メッシュ
  LEVEL_125: {
    DIGIT: 11,
    DIVISION: {
      X: 2,
      Y: 2,
    },
    // 緯度: 3.75秒, 経度: 5.625秒
    DISTANCE: {
      LAT: 3.75 / 60 / 60,
      LNG: 5.625 / 60 / 60,
    },
  },
}

module.exports = MESH
