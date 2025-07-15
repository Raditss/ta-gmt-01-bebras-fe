// Types for the kenneyMonsterSpritesheet structure

import { MonsterPartType } from '@/components/features/question/decision-tree/monster-part.type';

export type Texture = {
  source: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

export type TexturesMap = {
  [K: string]: Texture[];
};

export type KenneyMonsterSpritesheet = {
  imagePath: string;
  textures: {
    ['default']: {
      body: Texture[];
      legs: Texture[];
      arms: Texture[];
      horns: Texture[];
      eyes: Texture[];
      ears: Texture[];
      antenna: Texture[];
      accessories: Texture[];
    };
    [MonsterPartType.BODY]: Texture[];
    [MonsterPartType.LEG]: Texture[];
    [MonsterPartType.ARM]: Texture[];
    ['horns']: Texture[];
    ['eyes']: Texture[];
    ['ears']: Texture[];
    ['antenna']: Texture[];
    ['accessories']: Texture[];
  };
};

const kenneyMonsterSpritesheet: KenneyMonsterSpritesheet = {
  imagePath: 'spritesheet.png',
  textures: {
    ['default']: {
      body: [
        {
          source: 'body_White_Orb.png',
          x: 1036,
          y: 2588,
          width: 330,
          height: 330
        },
        { source: 'body_White_Egg.png', x: 0, y: 768, width: 384, height: 384 },
        // {
        //   source: 'body_White_Blob.png',
        //   x: 1366,
        //   y: 1992,
        //   width: 282,
        //   height: 388
        // },
        {
          source: 'body_White_Cube.png',
          x: 384,
          y: 728,
          width: 348,
          height: 364
        }
        // {
        //   source: 'body_white_E.png',
        //   x: 1630,
        //   y: 2380,
        //   width: 264,
        //   height: 500
        // },
        // { source: 'body_white_F.png', x: 724, y: 1456, width: 340, height: 472 }
      ],
      legs: [
        // {
        //   source: 'leg_white_A.png',
        //   x: 2418,
        //   y: 2152,
        //   width: 144,
        //   height: 334
        // },
        // {
        //   source: 'leg_white_B.png',
        //   x: 2704,
        //   y: 2000,
        //   width: 110,
        //   height: 298
        // },
        {
          source: 'leg_White_Paddle.png',
          x: 2260,
          y: 1408,
          width: 158,
          height: 248
        },
        {
          source: 'leg_White_Stump.png',
          x: 2560,
          y: 0,
          width: 142,
          height: 244
        },
        {
          source: 'leg_White_Flop.png',
          x: 384,
          y: 1928,
          width: 204,
          height: 218
        }
      ],
      arms: [
        {
          source: 'arm_White_Clampfin.png',
          x: 2096,
          y: 0,
          width: 164,
          height: 352
        },
        // {
        //   source: 'arm_white_B.png',
        //   x: 2780,
        //   y: 2596,
        //   width: 102,
        //   height: 322
        // },
        {
          source: 'arm_White_Twizzle.png',
          x: 1894,
          y: 2276,
          width: 196,
          height: 362
        },
        {
          source: 'arm_White_Grabbie.png',
          x: 2090,
          y: 2406,
          width: 184,
          height: 394
        },
        {
          source: 'arm_White_Thumpet.png',
          x: 2542,
          y: 488,
          width: 142,
          height: 298
        }
      ],
      horns: [
        {
          source: 'horn_White_large.png',
          x: 1804,
          y: 2276,
          width: 80,
          height: 84
        },
        {
          source: 'horn_White_small.png',
          x: 1328,
          y: 884,
          width: 62,
          height: 54
        }
      ],
      eyes: [
        { source: 'eye_White.png', x: 2682, y: 1062, width: 116, height: 156 }
      ],
      ears: [
        { source: 'ear_White.png', x: 2882, y: 2810, width: 76, height: 88 },
        {
          source: 'ear_White_round.png',
          x: 588,
          y: 1928,
          width: 108,
          height: 108
        }
      ],
      antenna: [
        {
          source: 'antenna_White_large.png',
          x: 2882,
          y: 2490,
          width: 76,
          height: 116
        },
        {
          source: 'antenna_White_small.png',
          x: 2888,
          y: 84,
          width: 52,
          height: 84
        }
      ],
      accessories: [
        { source: 'eyebrow_A.png', x: 1268, y: 1604, width: 98, height: 64 },
        { source: 'eyebrow_B.png', x: 760, y: 2872, width: 104, height: 66 },
        { source: 'eyebrow_C.png', x: 856, y: 1390, width: 114, height: 66 },
        { source: 'mouth_A.png', x: 160, y: 2886, width: 140, height: 68 },
        { source: 'mouth_B.png', x: 300, y: 2886, width: 140, height: 68 },
        { source: 'mouth_C.png', x: 384, y: 2146, width: 156, height: 76 },
        { source: 'mouth_D.png', x: 384, y: 2230, width: 132, height: 54 },
        { source: 'mouth_E.png', x: 732, y: 1370, width: 124, height: 78 },
        { source: 'mouth_F.png', x: 612, y: 2872, width: 148, height: 84 },
        { source: 'mouth_G.png', x: 1172, y: 1822, width: 100, height: 88 },
        { source: 'mouth_H.png', x: 1648, y: 2276, width: 156, height: 104 },
        { source: 'mouth_I.png', x: 540, y: 2146, width: 148, height: 84 },
        { source: 'mouth_J.png', x: 732, y: 1274, width: 144, height: 96 },
        {
          source: 'mouth_closedFangs.png',
          x: 516,
          y: 2230,
          width: 104,
          height: 40
        },
        {
          source: 'mouth_closedHappy.png',
          x: 0,
          y: 2886,
          width: 160,
          height: 48
        },
        {
          source: 'mouth_closedSad.png',
          x: 864,
          y: 2918,
          width: 104,
          height: 40
        },
        {
          source: 'mouth_closedTeeth.png',
          x: 440,
          y: 2886,
          width: 132,
          height: 52
        },
        { source: 'nose_brown.png', x: 1064, y: 1822, width: 108, height: 96 },
        { source: 'nose_green.png', x: 2702, y: 108, width: 106, height: 118 },
        { source: 'nose_red.png', x: 1272, y: 1668, width: 94, height: 102 },
        { source: 'nose_yellow.png', x: 1272, y: 1770, width: 92, height: 76 },
        { source: 'snot_large.png', x: 1598, y: 1364, width: 36, height: 122 },
        { source: 'snot_small.png', x: 1598, y: 1276, width: 42, height: 88 }
      ]
    },
    [MonsterPartType.BODY]: [
      { source: 'body_Blue_Orb.png', x: 732, y: 944, width: 330, height: 330 },
      { source: 'body_Blue_Egg.png', x: 0, y: 384, width: 384, height: 384 },
      { source: 'body_Blue_Blob.png', x: 1354, y: 0, width: 282, height: 388 },
      {
        source: 'body_Blue_Cube.png',
        x: 384,
        y: 1092,
        width: 348,
        height: 364
      },
      { source: 'body_Blue_E.png', x: 1366, y: 2380, width: 264, height: 500 },
      { source: 'body_Blue_F.png', x: 732, y: 0, width: 340, height: 472 },
      { source: 'body_Dark_Orb.png', x: 1062, y: 944, width: 330, height: 330 },
      { source: 'body_Dark_Egg.png', x: 0, y: 0, width: 384, height: 384 },
      {
        source: 'body_Dark_Blob.png',
        x: 1354,
        y: 388,
        width: 282,
        height: 388
      },
      { source: 'body_Dark_Cube.png', x: 384, y: 364, width: 348, height: 364 },
      { source: 'body_Dark_E.png', x: 1394, y: 776, width: 264, height: 500 },
      { source: 'body_Dark_F.png', x: 696, y: 2400, width: 340, height: 472 },
      {
        source: 'body_Green_Orb.png',
        x: 1036,
        y: 2258,
        width: 330,
        height: 330
      },
      { source: 'body_Green_Egg.png', x: 0, y: 1536, width: 384, height: 384 },
      {
        source: 'body_Green_Blob.png',
        x: 1072,
        y: 388,
        width: 282,
        height: 388
      },
      { source: 'body_Green_Cube.png', x: 384, y: 0, width: 348, height: 364 },
      { source: 'body_Green_E.png', x: 1648, y: 1776, width: 264, height: 500 },
      { source: 'body_Green_F.png', x: 732, y: 472, width: 340, height: 472 },
      { source: 'body_Red_Orb.png', x: 1036, y: 1928, width: 330, height: 330 },
      { source: 'body_Red_Egg.png', x: 0, y: 1920, width: 384, height: 384 },
      { source: 'body_Red_Blob.png', x: 1072, y: 0, width: 282, height: 388 },
      { source: 'body_Red_Cube.png', x: 0, y: 2304, width: 348, height: 364 },
      { source: 'body_Red_E.png', x: 1636, y: 0, width: 264, height: 500 },
      { source: 'body_Red_F.png', x: 384, y: 1456, width: 340, height: 472 },
      {
        source: 'body_White_Orb.png',
        x: 1036,
        y: 2588,
        width: 330,
        height: 330
      },
      { source: 'body_White_Egg.png', x: 0, y: 768, width: 384, height: 384 },
      {
        source: 'body_White_Blob.png',
        x: 1366,
        y: 1992,
        width: 282,
        height: 388
      },
      {
        source: 'body_White_Cube.png',
        x: 384,
        y: 728,
        width: 348,
        height: 364
      },
      { source: 'body_White_E.png', x: 1630, y: 2380, width: 264, height: 500 },
      { source: 'body_White_F.png', x: 724, y: 1456, width: 340, height: 472 },
      {
        source: 'body_Yellow_Orb.png',
        x: 1064,
        y: 1274,
        width: 330,
        height: 330
      },
      { source: 'body_Yellow_Egg.png', x: 0, y: 1152, width: 384, height: 384 },
      {
        source: 'body_Yellow_Blob.png',
        x: 1366,
        y: 1604,
        width: 282,
        height: 388
      },
      {
        source: 'body_Yellow_Cube.png',
        x: 348,
        y: 2304,
        width: 348,
        height: 364
      },
      {
        source: 'body_Yellow_E.png',
        x: 1648,
        y: 1276,
        width: 264,
        height: 500
      },
      { source: 'body_Yellow_F.png', x: 696, y: 1928, width: 340, height: 472 }
    ],
    [MonsterPartType.LEG]: [
      { source: 'leg_Blue_A.png', x: 2398, y: 248, width: 144, height: 334 },
      { source: 'leg_Blue_B.png', x: 2702, y: 1374, width: 110, height: 298 },
      {
        source: 'leg_Blue_Paddle.png',
        x: 2260,
        y: 1656,
        width: 158,
        height: 248
      },
      { source: 'leg_Blue_Stump.png', x: 2418, y: 0, width: 142, height: 244 },
      { source: 'leg_Blue_Flop.png', x: 408, y: 2668, width: 204, height: 218 },
      { source: 'leg_Dark_A.png', x: 2418, y: 2486, width: 144, height: 334 },
      { source: 'leg_Dark_B.png', x: 2694, y: 698, width: 110, height: 298 },
      {
        source: 'leg_Dark_Paddle.png',
        x: 2274,
        y: 1904,
        width: 158,
        height: 248
      },
      {
        source: 'leg_Dark_Stump.png',
        x: 2424,
        y: 916,
        width: 142,
        height: 244
      },
      {
        source: 'leg_Dark_Flop.png',
        x: 1064,
        y: 1604,
        width: 204,
        height: 218
      },
      { source: 'leg_Green_A.png', x: 2274, y: 2486, width: 144, height: 334 },
      { source: 'leg_Green_B.png', x: 2684, y: 400, width: 110, height: 298 },
      {
        source: 'leg_Green_Paddle.png',
        x: 2260,
        y: 0,
        width: 158,
        height: 248
      },
      {
        source: 'leg_Green_Stump.png',
        x: 2562,
        y: 2302,
        width: 142,
        height: 244
      },
      {
        source: 'leg_Green_Flop.png',
        x: 1394,
        y: 1276,
        width: 204,
        height: 218
      },
      { source: 'leg_Red_A.png', x: 2274, y: 2152, width: 144, height: 334 },
      { source: 'leg_Red_B.png', x: 2690, y: 1702, width: 110, height: 298 },
      {
        source: 'leg_Red_Paddle.png',
        x: 1912,
        y: 2012,
        width: 158,
        height: 248
      },
      { source: 'leg_Red_Stump.png', x: 2542, y: 244, width: 142, height: 244 },
      { source: 'leg_Red_Flop.png', x: 204, y: 2668, width: 204, height: 218 },
      { source: 'leg_White_A.png', x: 2418, y: 2152, width: 144, height: 334 },
      { source: 'leg_White_B.png', x: 2704, y: 2000, width: 110, height: 298 },
      {
        source: 'leg_White_Paddle.png',
        x: 2260,
        y: 1408,
        width: 158,
        height: 248
      },
      { source: 'leg_White_Stump.png', x: 2560, y: 0, width: 142, height: 244 },
      {
        source: 'leg_White_Flop.png',
        x: 384,
        y: 1928,
        width: 204,
        height: 218
      },
      { source: 'leg_Yellow_A.png', x: 2398, y: 582, width: 144, height: 334 },
      { source: 'leg_Yellow_B.png', x: 2704, y: 2298, width: 110, height: 298 },
      {
        source: 'leg_Yellow_Paddle.png',
        x: 1894,
        y: 2638,
        width: 158,
        height: 248
      },
      {
        source: 'leg_Yellow_Stump.png',
        x: 2424,
        y: 1160,
        width: 142,
        height: 244
      },
      { source: 'leg_Yellow_Flop.png', x: 0, y: 2668, width: 204, height: 218 }
    ],
    [MonsterPartType.ARM]: [
      {
        source: 'arm_Blue_Clampfin.png',
        x: 2234,
        y: 352,
        width: 164,
        height: 352
      },
      { source: 'arm_Blue_B.png', x: 2804, y: 548, width: 102, height: 322 },
      {
        source: 'arm_Blue_Twizzle.png',
        x: 1854,
        y: 862,
        width: 196,
        height: 362
      },
      {
        source: 'arm_Blue_Grabbie.png',
        x: 1912,
        y: 1224,
        width: 184,
        height: 394
      },
      {
        source: 'arm_Blue_Thumpet.png',
        x: 2432,
        y: 1706,
        width: 142,
        height: 298
      },
      {
        source: 'arm_Dark_Clampfin.png',
        x: 2234,
        y: 704,
        width: 164,
        height: 352
      },
      { source: 'arm_Dark_B.png', x: 2798, y: 996, width: 102, height: 322 },
      {
        source: 'arm_Dark_Twizzle.png',
        x: 1658,
        y: 862,
        width: 196,
        height: 362
      },
      {
        source: 'arm_Dark_Grabbie.png',
        x: 2090,
        y: 2012,
        width: 184,
        height: 394
      },
      {
        source: 'arm_Dark_Thumpet.png',
        x: 2562,
        y: 2004,
        width: 142,
        height: 298
      },
      {
        source: 'arm_Green_Clampfin.png',
        x: 2260,
        y: 1056,
        width: 164,
        height: 352
      },
      { source: 'arm_Green_B.png', x: 2800, y: 1672, width: 102, height: 322 },
      {
        source: 'arm_Green_Twizzle.png',
        x: 1900,
        y: 0,
        width: 196,
        height: 362
      },
      {
        source: 'arm_Green_Grabbie.png',
        x: 2050,
        y: 362,
        width: 184,
        height: 394
      },
      {
        source: 'arm_Green_Thumpet.png',
        x: 2562,
        y: 2546,
        width: 142,
        height: 298
      },
      {
        source: 'arm_Red_Clampfin.png',
        x: 2096,
        y: 1502,
        width: 164,
        height: 352
      },
      { source: 'arm_Red_B.png', x: 2812, y: 1318, width: 102, height: 322 },
      {
        source: 'arm_Red_Twizzle.png',
        x: 1658,
        y: 500,
        width: 196,
        height: 362
      },
      {
        source: 'arm_Red_Grabbie.png',
        x: 2050,
        y: 756,
        width: 184,
        height: 394
      },
      {
        source: 'arm_Red_Thumpet.png',
        x: 2418,
        y: 1408,
        width: 142,
        height: 298
      },
      {
        source: 'arm_White_Clampfin.png',
        x: 2096,
        y: 0,
        width: 164,
        height: 352
      },
      { source: 'arm_White_B.png', x: 2780, y: 2596, width: 102, height: 322 },
      {
        source: 'arm_White_Twizzle.png',
        x: 1894,
        y: 2276,
        width: 196,
        height: 362
      },
      {
        source: 'arm_White_Grabbie.png',
        x: 2090,
        y: 2406,
        width: 184,
        height: 394
      },
      {
        source: 'arm_White_Thumpet.png',
        x: 2542,
        y: 488,
        width: 142,
        height: 298
      },
      {
        source: 'arm_Yellow_Clampfin.png',
        x: 2096,
        y: 1150,
        width: 164,
        height: 352
      },
      { source: 'arm_Yellow_B.png', x: 2800, y: 226, width: 102, height: 322 },
      {
        source: 'arm_Yellow_Twizzle.png',
        x: 1854,
        y: 500,
        width: 196,
        height: 362
      },
      {
        source: 'arm_Yellow_Grabbie.png',
        x: 1912,
        y: 1618,
        width: 184,
        height: 394
      },
      {
        source: 'arm_Yellow_Thumpet.png',
        x: 2560,
        y: 1404,
        width: 142,
        height: 298
      }
    ],
    // [MonsterPartType.HORN]: [
    ['horns']: [
      { source: 'horn_Blue_large.png', x: 2808, y: 108, width: 80, height: 84 },
      { source: 'horn_Blue_small.png', x: 1328, y: 830, width: 62, height: 54 },
      { source: 'horn_Dark_large.png', x: 2804, y: 870, width: 80, height: 84 },
      { source: 'horn_Dark_small.png', x: 970, y: 1390, width: 62, height: 54 },
      {
        source: 'horn_Green_large.png',
        x: 2260,
        y: 248,
        width: 80,
        height: 84
      },
      {
        source: 'horn_Green_small.png',
        x: 1328,
        y: 776,
        width: 62,
        height: 54
      },
      { source: 'horn_Red_large.png', x: 612, y: 2704, width: 80, height: 84 },
      { source: 'horn_Red_small.png', x: 1272, y: 1846, width: 62, height: 54 },
      {
        source: 'horn_White_large.png',
        x: 1804,
        y: 2276,
        width: 80,
        height: 84
      },
      {
        source: 'horn_White_small.png',
        x: 1328,
        y: 884,
        width: 62,
        height: 54
      },
      {
        source: 'horn_Yellow_large.png',
        x: 612,
        y: 2788,
        width: 80,
        height: 84
      },
      {
        source: 'horn_Yellow_small.png',
        x: 968,
        y: 2872,
        width: 62,
        height: 54
      }
    ],
    ['eyes']: [
      { source: 'eye_Blue.png', x: 2574, y: 1702, width: 116, height: 156 },
      { source: 'eye_Dark.png', x: 2684, y: 244, width: 116, height: 156 },
      { source: 'eye_Green.png', x: 2566, y: 1062, width: 116, height: 156 },
      { source: 'eye_Red.png', x: 2566, y: 1218, width: 116, height: 156 },
      { source: 'eye_White.png', x: 2682, y: 1062, width: 116, height: 156 },
      { source: 'eye_Yellow.png', x: 2682, y: 1218, width: 116, height: 156 },
      {
        source: 'eye_Blue_angry.png',
        x: 876,
        y: 1274,
        width: 128,
        height: 116
      },
      {
        source: 'eye_Green_angry.png',
        x: 1394,
        y: 1494,
        width: 120,
        height: 110
      },
      {
        source: 'eye_Red_angry.png',
        x: 1514,
        y: 1494,
        width: 120,
        height: 110
      },
      {
        source: 'eye_Blue_basic.png',
        x: 1900,
        y: 362,
        width: 128,
        height: 138
      },
      { source: 'eye_Dark_cute.png', x: 1072, y: 776, width: 128, height: 138 },
      {
        source: 'eye_Light_cute.png',
        x: 2052,
        y: 2820,
        width: 128,
        height: 138
      },
      {
        source: 'eye_Blue_human.png',
        x: 1200,
        y: 776,
        width: 128,
        height: 138
      },
      {
        source: 'eye_Green_human.png',
        x: 2566,
        y: 786,
        width: 128,
        height: 138
      },
      {
        source: 'eye_Red_human.png',
        x: 2096,
        y: 1854,
        width: 128,
        height: 138
      },
      {
        source: 'eye_Dark_psycho.png',
        x: 2566,
        y: 924,
        width: 128,
        height: 138
      },
      {
        source: 'eye_Light_psycho.png',
        x: 2308,
        y: 2820,
        width: 128,
        height: 138
      },
      {
        source: 'eye_Red_basic.png',
        x: 2436,
        y: 2844,
        width: 128,
        height: 116
      },
      {
        source: 'eye_Yellow_basic.png',
        x: 2432,
        y: 2004,
        width: 128,
        height: 138
      }
    ],
    ['ears']: [
      { source: 'ear_Blue.png', x: 2814, y: 2110, width: 76, height: 88 },
      {
        source: 'ear_Blue_round.png',
        x: 2564,
        y: 2844,
        width: 108,
        height: 108
      },
      { source: 'ear_Dark.png', x: 2810, y: 0, width: 76, height: 88 },
      {
        source: 'ear_Dark_round.png',
        x: 588,
        y: 2036,
        width: 108,
        height: 108
      },
      { source: 'ear_Green.png', x: 2814, y: 2402, width: 76, height: 88 },
      {
        source: 'ear_Green_round.png',
        x: 2672,
        y: 2844,
        width: 108,
        height: 108
      },
      { source: 'ear_Red.png', x: 2814, y: 2198, width: 76, height: 88 },
      {
        source: 'ear_Red_round.png',
        x: 2574,
        y: 1858,
        width: 108,
        height: 108
      },
      { source: 'ear_White.png', x: 2882, y: 2810, width: 76, height: 88 },
      {
        source: 'ear_White_round.png',
        x: 588,
        y: 1928,
        width: 108,
        height: 108
      },
      { source: 'ear_Yellow.png', x: 2882, y: 2722, width: 76, height: 88 },
      { source: 'ear_Yellow_round.png', x: 2702, y: 0, width: 108, height: 108 }
    ],
    ['antenna']: [
      {
        source: 'antenna_Blue_large.png',
        x: 2704,
        y: 2596,
        width: 76,
        height: 116
      },
      {
        source: 'antenna_Blue_small.png',
        x: 2884,
        y: 870,
        width: 52,
        height: 84
      },
      {
        source: 'antenna_Dark_large.png',
        x: 2704,
        y: 2712,
        width: 76,
        height: 116
      },
      {
        source: 'antenna_Dark_small.png',
        x: 2340,
        y: 248,
        width: 52,
        height: 84
      },
      {
        source: 'antenna_Green_large.png',
        x: 2814,
        y: 1994,
        width: 76,
        height: 116
      },
      {
        source: 'antenna_Green_small.png',
        x: 1004,
        y: 1274,
        width: 52,
        height: 84
      },
      {
        source: 'antenna_Red_large.png',
        x: 2814,
        y: 2286,
        width: 76,
        height: 116
      },
      { source: 'antenna_Red_small.png', x: 2886, y: 0, width: 52, height: 84 },
      {
        source: 'antenna_White_large.png',
        x: 2882,
        y: 2490,
        width: 76,
        height: 116
      },
      {
        source: 'antenna_White_small.png',
        x: 2888,
        y: 84,
        width: 52,
        height: 84
      },
      {
        source: 'antenna_Yellow_large.png',
        x: 2882,
        y: 2606,
        width: 76,
        height: 116
      },
      {
        source: 'antenna_Yellow_small.png',
        x: 2814,
        y: 2490,
        width: 52,
        height: 84
      }
    ],
    ['accessories']: [
      { source: 'eyebrow_A.png', x: 1268, y: 1604, width: 98, height: 64 },
      { source: 'eyebrow_B.png', x: 760, y: 2872, width: 104, height: 66 },
      { source: 'eyebrow_C.png', x: 856, y: 1390, width: 114, height: 66 },
      { source: 'mouth_A.png', x: 160, y: 2886, width: 140, height: 68 },
      { source: 'mouth_B.png', x: 300, y: 2886, width: 140, height: 68 },
      { source: 'mouth_C.png', x: 384, y: 2146, width: 156, height: 76 },
      { source: 'mouth_D.png', x: 384, y: 2230, width: 132, height: 54 },
      { source: 'mouth_E.png', x: 732, y: 1370, width: 124, height: 78 },
      { source: 'mouth_F.png', x: 612, y: 2872, width: 148, height: 84 },
      { source: 'mouth_G.png', x: 1172, y: 1822, width: 100, height: 88 },
      { source: 'mouth_H.png', x: 1648, y: 2276, width: 156, height: 104 },
      { source: 'mouth_I.png', x: 540, y: 2146, width: 148, height: 84 },
      { source: 'mouth_J.png', x: 732, y: 1274, width: 144, height: 96 },
      {
        source: 'mouth_closedFangs.png',
        x: 516,
        y: 2230,
        width: 104,
        height: 40
      },
      {
        source: 'mouth_closedHappy.png',
        x: 0,
        y: 2886,
        width: 160,
        height: 48
      },
      {
        source: 'mouth_closedSad.png',
        x: 864,
        y: 2918,
        width: 104,
        height: 40
      },
      {
        source: 'mouth_closedTeeth.png',
        x: 440,
        y: 2886,
        width: 132,
        height: 52
      },
      { source: 'nose_brown.png', x: 1064, y: 1822, width: 108, height: 96 },
      { source: 'nose_green.png', x: 2702, y: 108, width: 106, height: 118 },
      { source: 'nose_red.png', x: 1272, y: 1668, width: 94, height: 102 },
      { source: 'nose_yellow.png', x: 1272, y: 1770, width: 92, height: 76 },
      { source: 'snot_large.png', x: 1598, y: 1364, width: 36, height: 122 },
      { source: 'snot_small.png', x: 1598, y: 1276, width: 42, height: 88 }
    ]
  }
};

export default kenneyMonsterSpritesheet;
