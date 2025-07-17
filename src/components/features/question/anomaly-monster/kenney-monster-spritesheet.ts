// Types for the kenneyMonsterSpritesheet structure

import { MonsterPartType } from '@/components/features/question/anomaly-monster/monster-part.type';

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
      ['Body']: Texture[];
      ['Leg']: Texture[];
      ['Arm']: Texture[];
      ['Horn']: Texture[];
      ['Eye']: Texture[];
      ['Ear']: Texture[];
      ['Antenna']: Texture[];
      ['Accessories']: Texture[];
    };
    [MonsterPartType.BODY]: Texture[];
    [MonsterPartType.LEG]: Texture[];
    [MonsterPartType.ARM]: Texture[];
    ['Horn']: Texture[];
    ['Eye']: Texture[];
    ['Ear']: Texture[];
    ['Antenna']: Texture[];
    ['Accessories']: Texture[];
  };
};

const kenneyMonsterSpritesheet: KenneyMonsterSpritesheet = {
  imagePath: 'Spritesheet.png',
  textures: {
    ['default']: {
      ['Body']: [
        {
          source: 'Body_White_Cube.png',
          x: 1036,
          y: 2588,
          width: 330,
          height: 330
        },
        { source: 'Body_White_Orb.png', x: 0, y: 768, width: 384, height: 384 },
        // {
        //   source: 'Body_White_Egg.png',
        //   x: 1366,
        //   y: 1992,
        //   width: 282,
        //   height: 388
        // },
        {
          source: 'Body_White_Blob.png',
          x: 384,
          y: 728,
          width: 348,
          height: 364
        }
        // {
        //   source: 'Body_white_E.png',
        //   x: 1630,
        //   y: 2380,
        //   width: 264,
        //   height: 500
        // },
        // { source: 'Body_white_F.png', x: 724, y: 1456, width: 340, height: 472 }
      ],
      ['Leg']: [
        // {
        //   source: 'Leg_white_A.png',
        //   x: 2418,
        //   y: 2152,
        //   width: 144,
        //   height: 334
        // },
        // {
        //   source: 'Leg_white_B.png',
        //   x: 2704,
        //   y: 2000,
        //   width: 110,
        //   height: 298
        // },
        {
          source: 'Leg_White_Paddle.png',
          x: 2260,
          y: 1408,
          width: 158,
          height: 248
        },
        {
          source: 'Leg_White_Stump.png',
          x: 2560,
          y: 0,
          width: 142,
          height: 244
        },
        {
          source: 'Leg_White_Flop.png',
          x: 384,
          y: 1928,
          width: 204,
          height: 218
        }
      ],
      ['Arm']: [
        {
          source: 'Arm_White_Clampfin.png',
          x: 2096,
          y: 0,
          width: 164,
          height: 352
        },
        // {
        //   source: 'Arm_white_B.png',
        //   x: 2780,
        //   y: 2596,
        //   width: 102,
        //   height: 322
        // },
        {
          source: 'Arm_White_Twizzle.png',
          x: 1894,
          y: 2276,
          width: 196,
          height: 362
        },
        {
          source: 'Arm_White_Grabbie.png',
          x: 2090,
          y: 2406,
          width: 184,
          height: 394
        },
        {
          source: 'Arm_White_Thumpet.png',
          x: 2542,
          y: 488,
          width: 142,
          height: 298
        }
      ],
      ['Horn']: [
        {
          source: 'Horn_White_large.png',
          x: 1804,
          y: 2276,
          width: 80,
          height: 84
        },
        {
          source: 'Horn_White_small.png',
          x: 1328,
          y: 884,
          width: 62,
          height: 54
        }
      ],
      ['Eye']: [
        { source: 'Eye_White.png', x: 2682, y: 1062, width: 116, height: 156 }
      ],
      ['Ear']: [
        { source: 'Ear_White.png', x: 2882, y: 2810, width: 76, height: 88 },
        {
          source: 'Ear_White_round.png',
          x: 588,
          y: 1928,
          width: 108,
          height: 108
        }
      ],
      ['Antenna']: [
        {
          source: 'Antenna_White_large.png',
          x: 2882,
          y: 2490,
          width: 76,
          height: 116
        },
        {
          source: 'Antenna_White_small.png',
          x: 2888,
          y: 84,
          width: 52,
          height: 84
        }
      ],
      ['Accessories']: [
        { source: 'Eyebrow_A.png', x: 1268, y: 1604, width: 98, height: 64 },
        { source: 'Eyebrow_B.png', x: 760, y: 2872, width: 104, height: 66 },
        { source: 'Eyebrow_C.png', x: 856, y: 1390, width: 114, height: 66 },
        { source: 'Mouth_A.png', x: 160, y: 2886, width: 140, height: 68 },
        { source: 'Mouth_B.png', x: 300, y: 2886, width: 140, height: 68 },
        { source: 'Mouth_C.png', x: 384, y: 2146, width: 156, height: 76 },
        { source: 'Mouth_D.png', x: 384, y: 2230, width: 132, height: 54 },
        { source: 'Mouth_E.png', x: 732, y: 1370, width: 124, height: 78 },
        { source: 'Mouth_F.png', x: 612, y: 2872, width: 148, height: 84 },
        { source: 'Mouth_G.png', x: 1172, y: 1822, width: 100, height: 88 },
        { source: 'Mouth_H.png', x: 1648, y: 2276, width: 156, height: 104 },
        { source: 'Mouth_I.png', x: 540, y: 2146, width: 148, height: 84 },
        { source: 'Mouth_J.png', x: 732, y: 1274, width: 144, height: 96 },
        {
          source: 'Mouth_closedFangs.png',
          x: 516,
          y: 2230,
          width: 104,
          height: 40
        },
        {
          source: 'Mouth_closedHappy.png',
          x: 0,
          y: 2886,
          width: 160,
          height: 48
        },
        {
          source: 'Mouth_closedSad.png',
          x: 864,
          y: 2918,
          width: 104,
          height: 40
        },
        {
          source: 'Mouth_closedTeeth.png',
          x: 440,
          y: 2886,
          width: 132,
          height: 52
        },
        { source: 'Nose_brown.png', x: 1064, y: 1822, width: 108, height: 96 },
        { source: 'Nose_green.png', x: 2702, y: 108, width: 106, height: 118 },
        { source: 'Nose_red.png', x: 1272, y: 1668, width: 94, height: 102 },
        { source: 'Nose_yellow.png', x: 1272, y: 1770, width: 92, height: 76 },
        { source: 'Snot_large.png', x: 1598, y: 1364, width: 36, height: 122 },
        { source: 'Snot_small.png', x: 1598, y: 1276, width: 42, height: 88 }
      ]
    },
    [MonsterPartType.BODY]: [
      { source: 'Body_Blue_Cube.png', x: 732, y: 944, width: 330, height: 330 },
      { source: 'Body_Blue_Orb.png', x: 0, y: 384, width: 384, height: 384 },
      { source: 'Body_Blue_Egg.png', x: 1354, y: 0, width: 282, height: 388 },
      {
        source: 'Body_Blue_Blob.png',
        x: 384,
        y: 1092,
        width: 348,
        height: 364
      },
      { source: 'Body_Blue_E.png', x: 1366, y: 2380, width: 264, height: 500 },
      { source: 'Body_Blue_F.png', x: 732, y: 0, width: 340, height: 472 },
      {
        source: 'Body_Dark_Cube.png',
        x: 1062,
        y: 944,
        width: 330,
        height: 330
      },
      { source: 'Body_Dark_Orb.png', x: 0, y: 0, width: 384, height: 384 },
      {
        source: 'Body_Dark_Egg.png',
        x: 1354,
        y: 388,
        width: 282,
        height: 388
      },
      { source: 'Body_Dark_Blob.png', x: 384, y: 364, width: 348, height: 364 },
      { source: 'Body_Dark_E.png', x: 1394, y: 776, width: 264, height: 500 },
      { source: 'Body_Dark_F.png', x: 696, y: 2400, width: 340, height: 472 },
      {
        source: 'Body_Green_Cube.png',
        x: 1036,
        y: 2258,
        width: 330,
        height: 330
      },
      { source: 'Body_Green_Orb.png', x: 0, y: 1536, width: 384, height: 384 },
      {
        source: 'Body_Green_Egg.png',
        x: 1072,
        y: 388,
        width: 282,
        height: 388
      },
      { source: 'Body_Green_Blob.png', x: 384, y: 0, width: 348, height: 364 },
      { source: 'Body_Green_E.png', x: 1648, y: 1776, width: 264, height: 500 },
      { source: 'Body_Green_F.png', x: 732, y: 472, width: 340, height: 472 },
      {
        source: 'Body_Red_Cube.png',
        x: 1036,
        y: 1928,
        width: 330,
        height: 330
      },
      { source: 'Body_Red_Orb.png', x: 0, y: 1920, width: 384, height: 384 },
      { source: 'Body_Red_Egg.png', x: 1072, y: 0, width: 282, height: 388 },
      { source: 'Body_Red_Blob.png', x: 0, y: 2304, width: 348, height: 364 },
      { source: 'Body_Red_E.png', x: 1636, y: 0, width: 264, height: 500 },
      { source: 'Body_Red_F.png', x: 384, y: 1456, width: 340, height: 472 },
      {
        source: 'Body_White_Cube.png',
        x: 1036,
        y: 2588,
        width: 330,
        height: 330
      },
      { source: 'Body_White_Orb.png', x: 0, y: 768, width: 384, height: 384 },
      {
        source: 'Body_White_Egg.png',
        x: 1366,
        y: 1992,
        width: 282,
        height: 388
      },
      {
        source: 'Body_White_Blob.png',
        x: 384,
        y: 728,
        width: 348,
        height: 364
      },
      { source: 'Body_White_E.png', x: 1630, y: 2380, width: 264, height: 500 },
      { source: 'Body_White_F.png', x: 724, y: 1456, width: 340, height: 472 },
      {
        source: 'Body_Yellow_Cube.png',
        x: 1064,
        y: 1274,
        width: 330,
        height: 330
      },
      { source: 'Body_Yellow_Orb.png', x: 0, y: 1152, width: 384, height: 384 },
      {
        source: 'Body_Yellow_Egg.png',
        x: 1366,
        y: 1604,
        width: 282,
        height: 388
      },
      {
        source: 'Body_Yellow_Blob.png',
        x: 348,
        y: 2304,
        width: 348,
        height: 364
      },
      {
        source: 'Body_Yellow_E.png',
        x: 1648,
        y: 1276,
        width: 264,
        height: 500
      },
      { source: 'Body_Yellow_F.png', x: 696, y: 1928, width: 340, height: 472 }
    ],
    [MonsterPartType.LEG]: [
      { source: 'Leg_Blue_A.png', x: 2398, y: 248, width: 144, height: 334 },
      { source: 'Leg_Blue_B.png', x: 2702, y: 1374, width: 110, height: 298 },
      {
        source: 'Leg_Blue_Paddle.png',
        x: 2260,
        y: 1656,
        width: 158,
        height: 248
      },
      { source: 'Leg_Blue_Stump.png', x: 2418, y: 0, width: 142, height: 244 },
      { source: 'Leg_Blue_Flop.png', x: 408, y: 2668, width: 204, height: 218 },
      { source: 'Leg_Dark_A.png', x: 2418, y: 2486, width: 144, height: 334 },
      { source: 'Leg_Dark_B.png', x: 2694, y: 698, width: 110, height: 298 },
      {
        source: 'Leg_Dark_Paddle.png',
        x: 2274,
        y: 1904,
        width: 158,
        height: 248
      },
      {
        source: 'Leg_Dark_Stump.png',
        x: 2424,
        y: 916,
        width: 142,
        height: 244
      },
      {
        source: 'Leg_Dark_Flop.png',
        x: 1064,
        y: 1604,
        width: 204,
        height: 218
      },
      { source: 'Leg_Green_A.png', x: 2274, y: 2486, width: 144, height: 334 },
      { source: 'Leg_Green_B.png', x: 2684, y: 400, width: 110, height: 298 },
      {
        source: 'Leg_Green_Paddle.png',
        x: 2260,
        y: 0,
        width: 158,
        height: 248
      },
      {
        source: 'Leg_Green_Stump.png',
        x: 2562,
        y: 2302,
        width: 142,
        height: 244
      },
      {
        source: 'Leg_Green_Flop.png',
        x: 1394,
        y: 1276,
        width: 204,
        height: 218
      },
      { source: 'Leg_Red_A.png', x: 2274, y: 2152, width: 144, height: 334 },
      { source: 'Leg_Red_B.png', x: 2690, y: 1702, width: 110, height: 298 },
      {
        source: 'Leg_Red_Paddle.png',
        x: 1912,
        y: 2012,
        width: 158,
        height: 248
      },
      { source: 'Leg_Red_Stump.png', x: 2542, y: 244, width: 142, height: 244 },
      { source: 'Leg_Red_Flop.png', x: 204, y: 2668, width: 204, height: 218 },
      { source: 'Leg_White_A.png', x: 2418, y: 2152, width: 144, height: 334 },
      { source: 'Leg_White_B.png', x: 2704, y: 2000, width: 110, height: 298 },
      {
        source: 'Leg_White_Paddle.png',
        x: 2260,
        y: 1408,
        width: 158,
        height: 248
      },
      { source: 'Leg_White_Stump.png', x: 2560, y: 0, width: 142, height: 244 },
      {
        source: 'Leg_White_Flop.png',
        x: 384,
        y: 1928,
        width: 204,
        height: 218
      },
      { source: 'Leg_Yellow_A.png', x: 2398, y: 582, width: 144, height: 334 },
      { source: 'Leg_Yellow_B.png', x: 2704, y: 2298, width: 110, height: 298 },
      {
        source: 'Leg_Yellow_Paddle.png',
        x: 1894,
        y: 2638,
        width: 158,
        height: 248
      },
      {
        source: 'Leg_Yellow_Stump.png',
        x: 2424,
        y: 1160,
        width: 142,
        height: 244
      },
      { source: 'Leg_Yellow_Flop.png', x: 0, y: 2668, width: 204, height: 218 }
    ],
    [MonsterPartType.ARM]: [
      {
        source: 'Arm_Blue_Clampfin.png',
        x: 2234,
        y: 352,
        width: 164,
        height: 352
      },
      { source: 'Arm_Blue_B.png', x: 2804, y: 548, width: 102, height: 322 },
      {
        source: 'Arm_Blue_Twizzle.png',
        x: 1854,
        y: 862,
        width: 196,
        height: 362
      },
      {
        source: 'Arm_Blue_Grabbie.png',
        x: 1912,
        y: 1224,
        width: 184,
        height: 394
      },
      {
        source: 'Arm_Blue_Thumpet.png',
        x: 2432,
        y: 1706,
        width: 142,
        height: 298
      },
      {
        source: 'Arm_Dark_Clampfin.png',
        x: 2234,
        y: 704,
        width: 164,
        height: 352
      },
      { source: 'Arm_Dark_B.png', x: 2798, y: 996, width: 102, height: 322 },
      {
        source: 'Arm_Dark_Twizzle.png',
        x: 1658,
        y: 862,
        width: 196,
        height: 362
      },
      {
        source: 'Arm_Dark_Grabbie.png',
        x: 2090,
        y: 2012,
        width: 184,
        height: 394
      },
      {
        source: 'Arm_Dark_Thumpet.png',
        x: 2562,
        y: 2004,
        width: 142,
        height: 298
      },
      {
        source: 'Arm_Green_Clampfin.png',
        x: 2260,
        y: 1056,
        width: 164,
        height: 352
      },
      { source: 'Arm_Green_B.png', x: 2800, y: 1672, width: 102, height: 322 },
      {
        source: 'Arm_Green_Twizzle.png',
        x: 1900,
        y: 0,
        width: 196,
        height: 362
      },
      {
        source: 'Arm_Green_Grabbie.png',
        x: 2050,
        y: 362,
        width: 184,
        height: 394
      },
      {
        source: 'Arm_Green_Thumpet.png',
        x: 2562,
        y: 2546,
        width: 142,
        height: 298
      },
      {
        source: 'Arm_Red_Clampfin.png',
        x: 2096,
        y: 1502,
        width: 164,
        height: 352
      },
      { source: 'Arm_Red_B.png', x: 2812, y: 1318, width: 102, height: 322 },
      {
        source: 'Arm_Red_Twizzle.png',
        x: 1658,
        y: 500,
        width: 196,
        height: 362
      },
      {
        source: 'Arm_Red_Grabbie.png',
        x: 2050,
        y: 756,
        width: 184,
        height: 394
      },
      {
        source: 'Arm_Red_Thumpet.png',
        x: 2418,
        y: 1408,
        width: 142,
        height: 298
      },
      {
        source: 'Arm_White_Clampfin.png',
        x: 2096,
        y: 0,
        width: 164,
        height: 352
      },
      { source: 'Arm_White_B.png', x: 2780, y: 2596, width: 102, height: 322 },
      {
        source: 'Arm_White_Twizzle.png',
        x: 1894,
        y: 2276,
        width: 196,
        height: 362
      },
      {
        source: 'Arm_White_Grabbie.png',
        x: 2090,
        y: 2406,
        width: 184,
        height: 394
      },
      {
        source: 'Arm_White_Thumpet.png',
        x: 2542,
        y: 488,
        width: 142,
        height: 298
      },
      {
        source: 'Arm_Yellow_Clampfin.png',
        x: 2096,
        y: 1150,
        width: 164,
        height: 352
      },
      { source: 'Arm_Yellow_B.png', x: 2800, y: 226, width: 102, height: 322 },
      {
        source: 'Arm_Yellow_Twizzle.png',
        x: 1854,
        y: 500,
        width: 196,
        height: 362
      },
      {
        source: 'Arm_Yellow_Grabbie.png',
        x: 1912,
        y: 1618,
        width: 184,
        height: 394
      },
      {
        source: 'Arm_Yellow_Thumpet.png',
        x: 2560,
        y: 1404,
        width: 142,
        height: 298
      }
    ],
    // [MonsterPartType.HORN]: [
    ['Horn']: [
      { source: 'Horn_Blue_large.png', x: 2808, y: 108, width: 80, height: 84 },
      { source: 'Horn_Blue_small.png', x: 1328, y: 830, width: 62, height: 54 },
      { source: 'Horn_Dark_large.png', x: 2804, y: 870, width: 80, height: 84 },
      { source: 'Horn_Dark_small.png', x: 970, y: 1390, width: 62, height: 54 },
      {
        source: 'Horn_Green_large.png',
        x: 2260,
        y: 248,
        width: 80,
        height: 84
      },
      {
        source: 'Horn_Green_small.png',
        x: 1328,
        y: 776,
        width: 62,
        height: 54
      },
      { source: 'Horn_Red_large.png', x: 612, y: 2704, width: 80, height: 84 },
      { source: 'Horn_Red_small.png', x: 1272, y: 1846, width: 62, height: 54 },
      {
        source: 'Horn_White_large.png',
        x: 1804,
        y: 2276,
        width: 80,
        height: 84
      },
      {
        source: 'Horn_White_small.png',
        x: 1328,
        y: 884,
        width: 62,
        height: 54
      },
      {
        source: 'Horn_Yellow_large.png',
        x: 612,
        y: 2788,
        width: 80,
        height: 84
      },
      {
        source: 'Horn_Yellow_small.png',
        x: 968,
        y: 2872,
        width: 62,
        height: 54
      }
    ],
    ['Eye']: [
      { source: 'Eye_Blue.png', x: 2574, y: 1702, width: 116, height: 156 },
      { source: 'Eye_Dark.png', x: 2684, y: 244, width: 116, height: 156 },
      { source: 'Eye_Green.png', x: 2566, y: 1062, width: 116, height: 156 },
      { source: 'Eye_Red.png', x: 2566, y: 1218, width: 116, height: 156 },
      { source: 'Eye_White.png', x: 2682, y: 1062, width: 116, height: 156 },
      { source: 'Eye_Yellow.png', x: 2682, y: 1218, width: 116, height: 156 },
      {
        source: 'Eye_Blue_angry.png',
        x: 876,
        y: 1274,
        width: 128,
        height: 116
      },
      {
        source: 'Eye_Green_angry.png',
        x: 1394,
        y: 1494,
        width: 120,
        height: 110
      },
      {
        source: 'Eye_Red_angry.png',
        x: 1514,
        y: 1494,
        width: 120,
        height: 110
      },
      {
        source: 'Eye_Blue_basic.png',
        x: 1900,
        y: 362,
        width: 128,
        height: 138
      },
      { source: 'Eye_Dark_cute.png', x: 1072, y: 776, width: 128, height: 138 },
      {
        source: 'Eye_Light_cute.png',
        x: 2052,
        y: 2820,
        width: 128,
        height: 138
      },
      {
        source: 'Eye_Blue_human.png',
        x: 1200,
        y: 776,
        width: 128,
        height: 138
      },
      {
        source: 'Eye_Green_human.png',
        x: 2566,
        y: 786,
        width: 128,
        height: 138
      },
      {
        source: 'Eye_Red_human.png',
        x: 2096,
        y: 1854,
        width: 128,
        height: 138
      },
      {
        source: 'Eye_Dark_psycho.png',
        x: 2566,
        y: 924,
        width: 128,
        height: 138
      },
      {
        source: 'Eye_Light_psycho.png',
        x: 2308,
        y: 2820,
        width: 128,
        height: 138
      },
      {
        source: 'Eye_Red_basic.png',
        x: 2436,
        y: 2844,
        width: 128,
        height: 116
      },
      {
        source: 'Eye_Yellow_basic.png',
        x: 2432,
        y: 2004,
        width: 128,
        height: 138
      }
    ],
    ['Ear']: [
      { source: 'Ear_Blue.png', x: 2814, y: 2110, width: 76, height: 88 },
      {
        source: 'Ear_Blue_round.png',
        x: 2564,
        y: 2844,
        width: 108,
        height: 108
      },
      { source: 'Ear_Dark.png', x: 2810, y: 0, width: 76, height: 88 },
      {
        source: 'Ear_Dark_round.png',
        x: 588,
        y: 2036,
        width: 108,
        height: 108
      },
      { source: 'Ear_Green.png', x: 2814, y: 2402, width: 76, height: 88 },
      {
        source: 'Ear_Green_round.png',
        x: 2672,
        y: 2844,
        width: 108,
        height: 108
      },
      { source: 'Ear_Red.png', x: 2814, y: 2198, width: 76, height: 88 },
      {
        source: 'Ear_Red_round.png',
        x: 2574,
        y: 1858,
        width: 108,
        height: 108
      },
      { source: 'Ear_White.png', x: 2882, y: 2810, width: 76, height: 88 },
      {
        source: 'Ear_White_round.png',
        x: 588,
        y: 1928,
        width: 108,
        height: 108
      },
      { source: 'Ear_Yellow.png', x: 2882, y: 2722, width: 76, height: 88 },
      { source: 'Ear_Yellow_round.png', x: 2702, y: 0, width: 108, height: 108 }
    ],
    ['Antenna']: [
      {
        source: 'Antenna_Blue_large.png',
        x: 2704,
        y: 2596,
        width: 76,
        height: 116
      },
      {
        source: 'Antenna_Blue_small.png',
        x: 2884,
        y: 870,
        width: 52,
        height: 84
      },
      {
        source: 'Antenna_Dark_large.png',
        x: 2704,
        y: 2712,
        width: 76,
        height: 116
      },
      {
        source: 'Antenna_Dark_small.png',
        x: 2340,
        y: 248,
        width: 52,
        height: 84
      },
      {
        source: 'Antenna_Green_large.png',
        x: 2814,
        y: 1994,
        width: 76,
        height: 116
      },
      {
        source: 'Antenna_Green_small.png',
        x: 1004,
        y: 1274,
        width: 52,
        height: 84
      },
      {
        source: 'Antenna_Red_large.png',
        x: 2814,
        y: 2286,
        width: 76,
        height: 116
      },
      { source: 'Antenna_Red_small.png', x: 2886, y: 0, width: 52, height: 84 },
      {
        source: 'Antenna_White_large.png',
        x: 2882,
        y: 2490,
        width: 76,
        height: 116
      },
      {
        source: 'Antenna_White_small.png',
        x: 2888,
        y: 84,
        width: 52,
        height: 84
      },
      {
        source: 'Antenna_Yellow_large.png',
        x: 2882,
        y: 2606,
        width: 76,
        height: 116
      },
      {
        source: 'Antenna_Yellow_small.png',
        x: 2814,
        y: 2490,
        width: 52,
        height: 84
      }
    ],
    ['Accessories']: [
      { source: 'Eyebrow_A.png', x: 1268, y: 1604, width: 98, height: 64 },
      { source: 'Eyebrow_B.png', x: 760, y: 2872, width: 104, height: 66 },
      { source: 'Eyebrow_C.png', x: 856, y: 1390, width: 114, height: 66 },
      { source: 'Mouth_A.png', x: 160, y: 2886, width: 140, height: 68 },
      { source: 'Mouth_B.png', x: 300, y: 2886, width: 140, height: 68 },
      { source: 'Mouth_C.png', x: 384, y: 2146, width: 156, height: 76 },
      { source: 'Mouth_D.png', x: 384, y: 2230, width: 132, height: 54 },
      { source: 'Mouth_E.png', x: 732, y: 1370, width: 124, height: 78 },
      { source: 'Mouth_F.png', x: 612, y: 2872, width: 148, height: 84 },
      { source: 'Mouth_G.png', x: 1172, y: 1822, width: 100, height: 88 },
      { source: 'Mouth_H.png', x: 1648, y: 2276, width: 156, height: 104 },
      { source: 'Mouth_I.png', x: 540, y: 2146, width: 148, height: 84 },
      { source: 'Mouth_J.png', x: 732, y: 1274, width: 144, height: 96 },
      {
        source: 'Mouth_closedFangs.png',
        x: 516,
        y: 2230,
        width: 104,
        height: 40
      },
      {
        source: 'Mouth_closedHappy.png',
        x: 0,
        y: 2886,
        width: 160,
        height: 48
      },
      {
        source: 'Mouth_closedSad.png',
        x: 864,
        y: 2918,
        width: 104,
        height: 40
      },
      {
        source: 'Mouth_closedTeeth.png',
        x: 440,
        y: 2886,
        width: 132,
        height: 52
      },
      { source: 'Nose_brown.png', x: 1064, y: 1822, width: 108, height: 96 },
      { source: 'Nose_green.png', x: 2702, y: 108, width: 106, height: 118 },
      { source: 'Nose_red.png', x: 1272, y: 1668, width: 94, height: 102 },
      { source: 'Nose_yellow.png', x: 1272, y: 1770, width: 92, height: 76 },
      { source: 'Snot_large.png', x: 1598, y: 1364, width: 36, height: 122 },
      { source: 'Snot_small.png', x: 1598, y: 1276, width: 42, height: 88 }
    ]
  }
};

export default kenneyMonsterSpritesheet;
