// 第１次地域区画の全メッシュコード
// https://www.e-stat.go.jp/pdf/gis/primary_mesh_jouhou.pdf
// prettier-ignore
export const LEVEL_80000_CODES = ['3036', '3622', '3623', '3624', '3631', '3641', '3653', '3724', '3725', '3741', '3823', '3824', '3831', '3841', '3926', '3927', '3928', '3942', '4027', '4028', '4040', '4042', '4128', '4129', '4142', '4229', '4230', '4328', '4329', '4429', '4440', '4529', '4530', '4531', '4540', '4629', '4630', '4631', '4728', '4729', '4730', '4731', '4739', '4740', '4828', '4829', '4830', '4831', '4839', '4928', '4929', '4930', '4931', '4932', '4933', '4934', '4939', '5029', '5030', '5031', '5032', '5033', '5034', '5035', '5036', '5038', '5039', '5129', '5130', '5131', '5132', '5133', '5134', '5135', '5136', '5137', '5138', '5139', '5229', '5231', '5232', '5233', '5234', '5235', '5236', '5237', '5238', '5239', '5240', '5332', '5333', '5334', '5335', '5336', '5337', '5338', '5339', '5340', '5432', '5433', '5435', '5436', '5437', '5438', '5439', '5440', '5531', '5536', '5537', '5538', '5539', '5540', '5541', '5636', '5637', '5638', '5639', '5640', '5641', '5738', '5739', '5740', '5741', '5839', '5840', '5841', '5939', '5940', '5941', '5942', '6039', '6040', '6041', '6139', '6140', '6141', '6239', '6240', '6241', '6243', '6339', '6340', '6341', '6342', '6343', '6439', '6440', '6441', '6442', '6443', '6444', '6445', '6540', '6541', '6542', '6543', '6544', '6545', '6546', '6641', '6642', '6643', '6644', '6645', '6646', '6647', '6740', '6741', '6742', '6747', '6748', '6840', '6841', '6842', '6847', '6848']

hoge.fuga

export const MESH = {
  // 第1次地域区画
  LEVEL_80000: {
    LEVEL: 80000,
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
  // 第2次地域区画
  LEVEL_10000: {
    LEVEL: 10000,
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
    LEVEL: 5000,
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
    LEVEL: 2000,
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
  // 基準地域メッシュ(第3次地域区画)
  LEVEL_1000: {
    LEVEL: 1000,
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
    LEVEL: 500,
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
    LEVEL: 250,
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
    LEVEL: 125,
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

export const AREA_MESH_LEVELS = Object.values(MESH).map((m) => m.LEVEL)

export const INTEGRATION_AREA_MESH_LEVELS = [
  MESH.LEVEL_10000.LEVEL,
  MESH.LEVEL_5000.LEVEL,
  MESH.LEVEL_2000.LEVEL,
]
