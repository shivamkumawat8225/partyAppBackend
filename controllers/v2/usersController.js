const User = require("../../models/userModel");
const creatError = require("../../utils/appError");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");
const otpGenerator = require("otp-generator");

exports.users = async (req, res, next) => {
  try {
    var user = [];
    var loweruser = [];
    var counts = 0;
    var matchData = {};
    var matchData1 = {};
    var {
      lang,
      categoryid,
      stateid,
      loksabha,
      jila,
      block,

      datatype,
      limit,
      skip,
      username,
    } = req.body;
    const imgUrl = "http://3.111.123.51:3001/uploads/";
    const users = await User.findOne({ mobile: username });
    if (!users) {
      return next(new creatError("User can't exists", 400));
    }
    const accessstate = users.stateid;
    const accessjila = users.jilaid;
    const accessloksabha = users.loksabhaid;
    const accessvidhansabha = users.vidhansabhaid;
    const accessblock = users.blockid;
    const accessbooth = users.boothid;
    const accesspost = users.role;

    // console.log(accesspost);
    // console.log(accessstate);
    const array = accessstate;
    // console.log(array);
    if (accesspost == 4) {
      if (datatype == "warroom") {
        matchData = {
          $and: [
            {
              role: {
                $in: ["5", "6", "7", "8", "9"],
              },
            },
            {
              status: 0,
            },
          ],
        };
      } else if (datatype == "reporting") {
        matchData = {
          $and: [
            {
              role: {
                $in: ["10", "11", "12", "13"],
              },
            },
            {
              status: "0",
            },
          ],
        };
      } else {
        matchData = {
          $and: [
            {
              role: {
                $in: ["5", "6", "7", "8", "9", "10", "11", "12", "13"],
              },
            },
            {
              status: "0",
            },
          ],
        };
      }
    }
    if (
      accesspost == 5 ||
      accesspost == 6 ||
      accesspost == 7 ||
      accesspost == 8 ||
      accesspost == 9
    ) {
      matchData = {
        $and: [
          {
            role: {
              $in: ["5", "6", "7", "8", "9", "10", "11", "12", "13"],
            },
          },
          {
            status: "0",
          },
        ],
      };
      matchData1 = {
        $and: [
          {
            role: {
              $in: [
                "14",
                "15",
                "16",
                "17",
                "18",
                "19",
                "20",
                "21",
                "22",
                "23",
                "24",
              ],
            },
          },
          {
            status: "0",
          },
        ],
      };
    }
    // pradesh id
    if (
      accesspost == 10 ||
      accesspost == 11 ||
      accesspost == 12 ||
      accesspost == 13
    ) {
      matchData = {
        $and: [
          {
            role: {
              $in: ["10", "11", "12", "13"],
            },
          },
          {
            status: "0",
          },
        ],
      };
      matchData1 = {
        $and: [
          {
            role: {
              $in: [
                "14",
                "15",
                "16",
                "17",
                "18",
                "19",
                "20",
                "21",
                "22",
                "23",
                "24",
              ],
            },
          },
          {
            stateid: {
              $in: array,
            },
          },
          {
            status: "0",
          },
        ],
      };
    }
    //loksabha
    if (
      accesspost == 14 ||
      accesspost == 15 ||
      accesspost == 16 ||
      accesspost == 17 ||
      accesspost == 18 ||
      accesspost == 19 ||
      accesspost == 20
    ) {
      matchData = {
        $and: [
          {
            role: {
              $in: [
                "14",
                "15",
                "16",
                "17",
                "18",
                "19",
                "20",
                "21",
                "22",
                "23",
                "24",
              ],
            },
          },
          {
            stateid: {
              $in: array,
            },
          },
          {
            status: "0",
          },
        ],
      };

      matchData1 = {
        $and: [
          {
            role: {
              $in: ["25", "26", "27", "28", "29", "30", "31", "32"],
            },
          },
          {
            stateid: {
              $in: array,
            },
          },
          {
            status: "0",
          },
        ],
      };
    }
    if (
      accesspost == 21 ||
      accesspost == 22 ||
      accesspost == 23 ||
      accesspost == 24
    ) {
      matchData = {
        $and: [
          {
            role: {
              $in: ["21", "22", "23", "24"],
            },
          },
          {
            stateid: {
              $in: array,
            },
          },
          {
            status: "0",
          },
        ],
      };

      matchData1 = {
        $and: [
          {
            role: {
              $in: ["25", "26", "27", "28", "29", "30", "31", "32"],
            },
          },
          {
            stateid: {
              $in: array,
            },
          },
          {
            status: "0",
          },
        ],
      };
    }
    if (
      accesspost == 25 ||
      accesspost == 26 ||
      accesspost == 27 ||
      accesspost == 28
    ) {
      matchData = {
        $and: [
          {
            role: {
              $in: ["25", "26", "27", "28"],
            },
          },
          {
            loksabhaid: {
              $in: accessloksabha,
            },
          },
          {
            status: "0",
          },
        ],
      };

      matchData1 = {
        $and: [
          {
            role: {
              $in: ["25", "26", "27", "28", "29", "30", "31", "32"],
            },
          },
          {
            loksabhaid: {
              $in: accessloksabha,
            },
          },
          {
            status: "0",
          },
        ],
      };
    }
    if (
      accesspost == 29 ||
      accesspost == 30 ||
      accesspost == 31 ||
      accesspost == 32
    ) {
      matchData = {
        $and: [
          {
            role: {
              $in: ["29", "30", "31", "32"],
            },
          },
          {
            loksabhaid: {
              $in: accessloksabha,
            },
          },
          {
            status: "0",
          },
        ],
      };

      matchData1 = {
        $and: [
          {
            role: {
              $in: ["33", "34","178"],
            },
          },
          {
            loksabhaid: {
              $in: accessloksabha,
            },
          },
          {
            status: "0",
          },
        ],
      };
    }
    if (accesspost == 33 || accesspost == 34 || accesspost == 178) {
      matchData = {
        $and: [
          {
            role: {
              $in: ["33", "34", "178"],
            },
          },
          {
            vidhansabhaid: {
              $in: accessvidhansabha,
            },
          },
          {
            status: "0",
          },
        ],
      };

      matchData1 = {
        $and: [
          {
            role: {
              $in: ["35", "36", "177"],
            },
          },
          {
            vidhansabhaid: {
              $in: accessvidhansabha,
            },
          },
          {
            status: "0",
          },
        ],
      };
    }
    if (accesspost == 35 || accesspost == 36 || accesspost == 177) {
      matchData = {
        $and: [
          {
            role: {
              $in: ["35", "36", "177"],
            },
          },
          {
            blockid: {
              $in: accessblock,
            },
          },
          {
            status: "0",
          },
        ],
      };

      matchData1 = {
        $and: [
          {
            role: {
              $in: ["37", "38", "39", "165", "166", "167", "168", "169", "170", "171", "172", "173", "174","179","180"],
            },
          },
          {
            blockid: {
              $in: accessblock,
            },
          },
          {
            status: "0",
          },
        ],
      };
    }
    // console.log(matchData);
    user = await User.aggregate([
      {
        $match: matchData,
      },
      {
        $lookup: {
          from: "user_roles",
          localField: "role",
          foreignField: "id",
          as: "postData",
          pipeline: [
            {
              $project: {
                _id: 0,
                id: 1,
                role_en: 1,
                role: `$role_${lang}`,
              },
            },
          ],
        },
      },
      {
        $project: {
          _id: 1,
          name_en: 1,
          name: `$name_${lang}`,
          father_name_en: 1,
          father_name: `$father_name_${lang}`,
          mobile: 1,
          gender: 1,
          assign_family: 1,
          stateid: 1,
          loksabhaid: 1,
          vidhansabhaid: 1,
          postData: 1,
          image: 1,
          fullImageurl: {
            $concat: [
              {
                $cond: [
                  { $eq: ["$image", ""] },
                  "",
                  "http://3.111.123.51:3001/uploads/",
                ],
              },
              "$image",
            ],
          },
        },
      },
      { $skip: parseInt(skip) },
      { $limit: parseInt(limit) },
    ]);
    if (accesspost != 4) {
      loweruser = await User.aggregate([
        {
          $match: matchData1,
        },
        {
          $lookup: {
            from: "user_roles",
            localField: "role",
            foreignField: "id",
            as: "postData",
            pipeline: [
              {
                $project: {
                  _id: 0,
                  id: 1,
                  role_en: 1,
                  role: `$role_${lang}`,
                },
              },
            ],
          },
        },
        {
          $lookup: {
            from: "states",
            localField: "stateid",
            foreignField: "id",
            as: "stateData",
            pipeline: [
              {
                $project: {
                  _id: 0,
                  id: 1,
                  state_en: 1,
                  state: `$state_${lang}`,
                },
              },
            ],
          },
        },
        {
          $lookup: {
            from: "loksabhas",
            localField: "loksabhaid",
            foreignField: "id",
            as: "loksabhaData",
            pipeline: [
              {
                $project: {
                  _id: 0,
                  id: 1,
                  loksabha_en: 1,
                  loksabha: `$loksabha_${lang}`,
                },
              },
            ],
          },
        },
        {
          $lookup: {
            from: "vidhansabhas",
            localField: "vidhansabhaid",
            foreignField: "id",
            as: "vidhansabhaData",
            pipeline: [
              {
                $project: {
                  _id: 0,
                  id: 1,
                  vidhansabha_en: 1,
                  vidhansabha: `$vidhansabha_${lang}`,
                },
              },
            ],
          },
        },
        {
          $lookup: {
            from: "blocks",
            localField: "blockid",
            foreignField: "id",
            as: "blockData",
            pipeline: [
              {
                $project: {
                  _id: 0,
                  id: 1,
                  block_en: 1,
                  block: `$block_${lang}`,
                },
              },
            ],
          },
        },
        {
          $lookup: {
            from: "booths",
            localField: "boothid",
            foreignField: "id",
            as: "boothData",
            pipeline: [
              {
                $project: {
                  _id: 0,
                  id: 1,
                  booth_en: 1,
                  booth: `$booth_${lang}`,
                },
              },
            ],
          },
        },
        {
          $project: {
            _id: 1,
            name_en: 1,
            name: `$name_${lang}`,
            father_name_en: 1,
            father_name: `$father_name_${lang}`,
            address: 1,
            mobile: 1,
            gender: 1,
            assign_family: 1,
            stateid: 1,
            loksabhaid: 1,
            vidhansabhaid: 1,
            postData: 1,
            stateData: 1,
            loksabhaData: 1,
            vidhansabhaData: 1,
            blockData: 1,
            boothData: 1,
            image: 1,
            fullImageurl: {
              $concat: [
                {
                  $cond: [
                    { $eq: ["$image", ""] },
                    "",
                    "http://3.111.123.51:3001/uploads/",
                  ],
                },
                "$image",
              ],
            },
          },
        },
        { $skip: parseInt(skip) },
        { $limit: parseInt(limit) },
      ]);
    }
    if (!user) {
      return next(new creatError("User not Found!", 404));
    }

    res.status(200).json({
      success: true,
      status: "success",
      message: "Data Found successfull",
      imgUrl: imgUrl,
      user: user,
      loweruser: loweruser,
    });
  } catch (error) {
    next(error);
  }
};

exports.statusChnager = async (req, res, next) => {
  try {
    const { oid, status } = req.body;
    const user = await User.findOne({ _id: oid });

    if (!user) {
      return next(new creatError("User not Found!", 404));
    }

    const query = { _id: oid };
    const update = { $set: { status: status } };
    const options = {};
    const result = await User.updateOne(query, update, options);
    // console.log(result);
    // console.log(result.modifiedCount);
    if (result.modifiedCount > 0) {
      res.status(200).json({
        success: true,
        status: "success",
        message: "Updateted successful",
      });
    } else {
      res.status(200).json({
        success: false,
        status: "unsuccess",
        message: "Not Update successful",
      });
    }
  } catch (error) {
    next(error);
  }
};

exports.warroomusers = async (req, res, next) => {
  try {
    var user = [];
    var loweruser = [];
    var counts = 0;
    var matchData = {};
    var matchData1 = {};
    var {
      lang,
      stateid,
      loksabha,
      jila,
      vidhansabha,
      block,
      booth,
      zone,
      sector,
      nikay,
      ward,
      app_type,
      datatype,
      limit,
      skip,
      username,
      search
    } = req.body;
    nikay = parseInt(nikay);
    ward = parseInt(ward);
    block = parseInt(block);
    vidhansabha = parseInt(vidhansabha);
    loksabha = parseInt(loksabha);
    jila = parseInt(jila);
    stateid = parseInt(stateid);
    booth = parseInt(booth);
    zone = parseInt(zone);
    sector = parseInt(sector);
    var lang1 = lang;
    if (lang == "hi") {
      lang1 = "hindi";
    }
    const imgUrl = "http://3.111.123.51:3001/uploads/";
    const users = await User.findOne({ mobile: username });
    if (!users) {
      return next(new creatError("User can't exists", 400));
    }
    const accessstate = users.stateid;
    const accessjila = users.jilaid;
    const accessloksabha = users.loksabhaid;
    const accessvidhansabha = users.vidhansabhaid;
    const accessblock = users.blockid;
    const accessbooth = users.boothid;
    const accesszone = users.zoneid;
    const accesssector = users.sectorid;
    const accesspost = users.role;
    const accessnikay = users.nikayid;
    const accessward = users.wardid;

    const array = accessstate;
    // console.log(array);
    if (booth > 0) {
      matchData = {
        $and: [
          {
            role: {
              $in: [37, 38, 39, 88, 94, 90, 96, 97, 98, 91, 89, 95, 93, 92, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174,179,180],
            },
          },
          {
            boothid: booth,
          },
          {
            status: "0",
          },
        ],
      };
    } else if (sector > 0) {
      matchData = {
        $and: [
          {
            role: {
              $in: [87, 175],
            },
          },
          {
            sectorid: sector,
          },
          {
            status: "0",
          },
        ],
      };
    } else if (zone > 0) {
      matchData = {
        $and: [
          {
            role: {
              $in: [86, 176],
            },
          },
          {
            zoneid: zone,
          },
          {
            status: "0",
          },
        ],
      };
    } else if (block > 0) {
      matchData = {
        $and: [
          {
            role: {
              $in: [35, 36, 79, 80, 81, 82, 83, 84, 85, 177],
            },
          },
          {
            blockid: block,
          },
          {
            status: "0",
          },
        ],
      };
    } else if (vidhansabha > 0) {
      matchData = {
        $and: [
          {
            role: {
              $in: [33, 34, 73, 75, 74, 76, 77, 78, 178],
            },
          },
          {
            vidhansabhaid: vidhansabha,
          },
          {
            status: "0",
          },
        ],
      };
    } else if (ward > 0) {
      matchData = {
        $and: [
          {
            role: {
              $in: [59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 99, 178],
            },
          },
          {
            wardid: ward,
          },
          {
            status: "0",
          },
        ],
      };
    } else if (nikay > 0) {
      matchData = {
        $and: [
          {
            role: {
              $in: [49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 178],
            },
          },
          {
            nikayid: nikay,
          },
          {
            status: "0",
          },
        ],
      };
    } else if (jila > 0) {
      matchData = {
        $and: [
          {
            role: {
              $in: [42, 43, 44, 45, 46, 47, 48, 72],
            },
          },
          {
            jilaid: jila,
          },
          {
            status: "0",
          },
        ],
      };
    } else if (loksabha > 0) {
      matchData = {
        $and: [
          {
            role: {
              $in: [25, 26, 27, 28],
            },
          },
          {
            loksabhaid: loksabha,
          },
          {
            status: "0",
          },
        ],
      };
    } else if (stateid > 0) {
      matchData = {
        $and: [
          {
            role: {
              $in: [16, 17, 18, 19, 20, 21, 22, 23, 24, 71],
            },
          },
          {
            stateid: stateid,
          },
          {
            status: "0",
          },
        ],
      };
    }
    // national id
    else if (accesspost == 4) {
      matchData = {
        $and: [
          {
            role: {
              $in: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 70],
            },
          },
          {
            status: "0",
          },
        ],
      };
    } else if (
      accesspost == 5 ||
      accesspost == 6 ||
      accesspost == 7 ||
      accesspost == 8 ||
      accesspost == 9 ||
      accesspost == 10 ||
      accesspost == 11 ||
      accesspost == 12 ||
      accesspost == 13 ||
      accesspost == 70
    ) {
      matchData = {
        $and: [
          {
            role: {
              $in: [5, 6, 7, 8, 9, 10, 11, 12, 13, 70],
            },
          },
          {
            status: "0",
          },
        ],
      };
    }
    // national monitoring id
    else if (accesspost == 14 || accesspost == 15) {
      matchData = {
        $and: [
          {
            role: {
              $in: [14, 15],
            },
          },
          {
            status: "0",
          },
        ],
      };
    }
    //state
    else if (
      accesspost == 16 ||
      accesspost == 17 ||
      accesspost == 18 ||
      accesspost == 19 ||
      accesspost == 20 ||
      accesspost == 21 ||
      accesspost == 22 ||
      accesspost == 23 ||
      accesspost == 24 ||
      accesspost == 71
    ) {
      matchData = {
        $and: [
          {
            role: {
              $in: [16, 17, 18, 19, 20, 21, 22, 23, 24, 71],
            },
          },
          {
            stateid: {
              $in: array,
            },
          },
          {
            status: "0",
          },
        ],
      };
      // monitoring state
    } else if (accesspost == 41 || accesspost == 40) {
      matchData = {
        $and: [
          {
            role: {
              $in: [40, 41],
            },
          },
          {
            stateid: {
              $in: array,
            },
          },
          {
            status: "0",
          },
        ],
      };
      // jila
    } else if (
      accesspost == 42 ||
      accesspost == 43 ||
      accesspost == 44 ||
      accesspost == 45 ||
      accesspost == 46 ||
      accesspost == 47 ||
      accesspost == 72 ||
      accesspost == 48
    ) {
      matchData = {
        $and: [
          {
            role: {
              $in: [42, 43, 44, 45, 46, 47, 48, 72],
            },
          },
          {
            jilaid: {
              $in: accessjila,
            },
          },
          {
            status: "0",
          },
        ],
      };

      // nigam id's
    } else if (
      accesspost == 49 ||
      accesspost == 50 ||
      accesspost == 51 ||
      accesspost == 52 ||
      accesspost == 53 ||
      accesspost == 54 ||
      accesspost == 55 ||
      accesspost == 56 ||
      accesspost == 57 ||
      accesspost == 58
    ) {
      matchData = {
        $and: [
          {
            role: {
              $in: [49, 50, 51, 52, 53, 54, 55, 56, 57, 58],
            },
          },
          {
            nikayid: {
              $in: accessnikay,
            },
          },
          {
            status: "0",
          },
        ],
      };
      //Ward
    } else if (
      accesspost == 59 ||
      accesspost == 60 ||
      accesspost == 61 ||
      accesspost == 62 ||
      accesspost == 63 ||
      accesspost == 64 ||
      accesspost == 65 ||
      accesspost == 66 ||
      accesspost == 67 ||
      accesspost == 68 ||
      accesspost == 69
    ) {
      matchData = {
        $and: [
          {
            role: {
              $in: [59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 99],
            },
          },
          {
            wardid: {
              $in: accessward,
            },
          },
          {
            status: "0",
          },
        ],
      };
    } else if (
      accesspost == 33 ||
      accesspost == 34 ||
      accesspost == 73 ||
      accesspost == 74 ||
      accesspost == 75 ||
      accesspost == 76 ||
      accesspost == 77 ||
      accesspost == 178 ||
      accesspost == 78
    ) {
      matchData = {
        $and: [
          {
            role: {
              $in: [33, 34, 73, 74, 75, 76, 77, 178, 78],
            },
          },
          {
            vidhansabhaid: {
              $in: accessvidhansabha,
            },
          },
          {
            status: "0",
          },
        ],
      };
    } else if (
      accesspost == 35 ||
      accesspost == 79 ||
      accesspost == 80 ||
      accesspost == 81 ||
      accesspost == 82 ||
      accesspost == 83 ||
      accesspost == 84 ||
      accesspost == 85 ||
      accesspost == 177 ||
      accesspost == 36
    ) {
      matchData = {
        $and: [
          {
            role: {
              $in: [35, 36, 79, 80, 81, 82, 83, 84, 85, 177],
            },
          },
          {
            blockid: {
              $in: accessblock,
            },
          },
          {
            status: "0",
          },
        ],
      };
    } else if (accesspost == 86 || accesspost == 176) {
      matchData = {
        $and: [
          {
            role: {
              $in: [86, 176],
            },
          },
          {
            zoneid: {
              $in: accesszone,
            },
          },
          {
            status: "0",
          },
        ],
      };
    } else if (accesspost == 87 || accesspost == 175) {
      matchData = {
        $and: [
          {
            role: {
              $in: [87, 175],
            },
          },
          {
            sectorid: {
              $in: accesssector,
            },
          },
          {
            status: "0",
          },
        ],
      };
    }
    // block ids
    //search
    if (req.body.search) {
      let newobj = {
        $or: [
          { mobile: req.body.search },
          { name: { $regex: req.body.search, $options: "i" } },
        ],
      };
      // Case-insensitive search
      matchData.$and.push(newobj);
    }
    // console.log(matchData);
    const usercount = await User.countDocuments(matchData);
    user = await User.aggregate([
      {
        $match: matchData,
      },
      {
        $addFields: {
          name: {
            $ifNull: [
              {
                $getField: {
                  field: { $concat: ['name_', lang] },
                  input: '$$ROOT'
                }
              },
              '$name' // Fallback to default name if missing/null
            ]
          },
          father_name: {
            $ifNull: [
              {
                $getField: {
                  field: { $concat: ['father_name_', lang] },
                  input: '$$ROOT'
                }
              },
              '$father_name' // Fallback to default father_name
            ]
          }
        }
      },
      {
        $lookup: {
          from: "user_roles",
          localField: "role",
          foreignField: "id",
          as: "postData",
          pipeline: [
            {
              $project: {
                _id: 0,
                id: 1,
                role_en: 1,
                role: `$role_${lang}`,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "states",
          localField: "stateid",
          foreignField: "id",
          as: "stateData",
          pipeline: [
            {
              $project: {
                _id: 0,
                id: 1,
                state_en: 1,
                state: `$state_${lang}`,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "loksabhas",
          localField: "loksabhaid",
          foreignField: "id",
          as: "loksabhaData",
          pipeline: [
            {
              $project: {
                _id: 0,
                id: 1,
                loksabha_en: 1,
                loksabha: `$loksabha_${lang}`,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "jilas",
          localField: "jilaid",
          foreignField: "id",
          as: "jilaData",
          pipeline: [
            {
              $project: {
                _id: 0,
                id: 1,
                jila_en: 1,
                jila: `$jila_${lang1}`,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "vidhansabhas",
          localField: "vidhansabhaid",
          foreignField: "id",
          as: "vidhansabhaData",
          pipeline: [
            {
              $project: {
                _id: 0,
                id: 1,
                vidhansabha_en: 1,
                vidhansabha: `$vidhansabha_${lang}`,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "blocks",
          localField: "blockid",
          foreignField: "id",
          as: "blockData",
          pipeline: [
            {
              $project: {
                _id: 0,
                id: 1,
                block_en: 1,
                block: `$block_${lang}`,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "zones",
          localField: "zoneid",
          foreignField: "id",
          as: "zoneData",
          pipeline: [
            {
              $project: {
                _id: 0,
                id: 1,
                zone_en: 1,
                zone: `$zone_${lang}`,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "sectors",
          localField: "sectorid",
          foreignField: "id",
          as: "sectorData",
          pipeline: [
            {
              $project: {
                _id: 0,
                id: 1,
                sector_en: 1,
                sector: `$sector_${lang}`,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "booths",
          localField: "boothid",
          foreignField: "id",
          as: "boothData",
          pipeline: [
            {
              $project: {
                _id: 0,
                id: 1,
                booth_en: 1,
                booth: `$booth_${lang}`,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "nikays",
          localField: "nikayid",
          foreignField: "id",
          as: "nikayData",
          pipeline: [
            {
              $project: {
                _id: 0,
                id: 1,
                nikay_en: 1,
                nikay: `$nikay_${lang}`,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "wards",
          localField: "wardid",
          foreignField: "id",
          as: "wardData",
          pipeline: [
            {
              $project: {
                _id: 0,
                id: 1,
                ward_en: 1,
                ward: `$ward_${lang}`,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "professions",
          localField: "profession",
          foreignField: "id",
          as: "professionData",
          pipeline: [
            {
              $project: {
                _id: 0,
                id: 1,
                profession_en: 1,
                profession: `$profession_${lang}`,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "castes",
          localField: "caste",
          foreignField: "id",
          as: "casteData",
          pipeline: [
            {
              $project: {
                _id: 0,
                id: 1,
                caste_en: 1,
                caste: `$caste_${lang}`,
              },
            },
          ],
        },
      },
      {
        $project: {
          _id: 1,
          name_en: 1,
          name: 1,
          father_name: 1,
          father_name_en: 1,
          age: 1,
          address: 1,
          mobile: 1,
          gender: 1,
          assign_family: 1,
          sr_start: 1,
          sr_end: 1,
          whatsapp: 1,
          caste: 1,
          profession: 1,
          patrol_team: 1,
          table_prabhari: 1,
          polling_agent: 1,
          speaker: 1,
          whatsapp_prabhari: 1,
          narajReason: 1,
          stateid: 1,
          loksabhaid: 1,
          vidhansabhaid: 1,
          postData: 1,
          professionData: 1,
          casteData: 1,
          stateData: 1,
          loksabhaData: 1,
          jilaData: 1,
          vidhansabhaData: 1,
          blockData: 1,
          zoneData: 1,
          sectorData: 1,
          boothData: 1,
          nikayData: 1,
          wardData: 1,
          image: 1,
          fullImageurl: {
            $concat: [
              {
                $cond: [
                  { $eq: ["$image", ""] },
                  "",
                  "http://3.111.123.51:3001/uploads/",
                ],
              },
              "$image",
            ],
          },
        },
      },
      { $skip: parseInt(skip) },
      { $limit: parseInt(limit) },
    ]);

    if (!user) {
      return next(new creatError("User not Found!", 404));
    }

    res.status(200).json({
      success: true,
      status: "success",
      message: "Data Found successfull",
      user: user,
      counts: usercount,
    });
  } catch (error) {
    next(error);
  }
};
exports.managmentusers = async (req, res, next) => {
  try {
    var user = [];
    var loweruser = [];
    var counts = 0;
    var matchData = {};
    var matchData1 = {};
    var {
      lang,
      stateid,
      loksabha,
      jila,
      vidhansabha,
      block,
      booth,
      zone,
      sector,
      nikay,
      ward,
      app_type,
      datatype,
      limit,
      skip,
      username,
    } = req.body;
    nikay = parseInt(nikay);
    ward = parseInt(ward);
    block = parseInt(block);
    vidhansabha = parseInt(vidhansabha);
    loksabha = parseInt(loksabha);
    jila = parseInt(jila);
    stateid = parseInt(stateid);
    booth = parseInt(booth);
    zone = parseInt(zone);
    sector = parseInt(sector);
    var lang1 = lang;
    if (lang == "hi") {
      lang1 = "hindi";
    }
    const imgUrl = "http://3.111.123.51:3001/uploads/";
    const users = await User.findOne({ mobile: username });
    if (!users) {
      return next(new creatError("User can't exists", 400));
    }
    const accessstate = users.stateid;
    const accessjila = users.jilaid;
    const accessloksabha = users.loksabhaid;
    const accessvidhansabha = users.vidhansabhaid;
    const accessblock = users.blockid;
    const accessbooth = users.boothid;
    const accesszone = users.zoneid;
    const accesssector = users.sectorid;
    const accesspost = users.role;
    const accessnikay = users.nikayid;
    const accessward = users.wardid;

    const array = accessstate;
    // console.log(array);
    if (
      booth > 0 ||
      block > 0 ||
      zone > 0 ||
      sector > 0 ||
      ward > 0 ||
      nikay > 0
    ) {
      res.status(200).json({
        success: true,
        status: "success",
        message: "Data not Found successfull",
        user: user,
      });
      return;
      //null data
    } else if (vidhansabha > 0) {
      matchData = {
        $and: [
          {
            role: {
              $in: [
                100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112,
              ],
            },
          },
          {
            vidhansabhaid: vidhansabha,
          },
          {
            status: "0",
          },
        ],
      };
    } else if (jila > 0) {
      matchData = {
        $and: [
          {
            role: {
              $in: [
                126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138,
              ],
            },
          },
          {
            jilaid: jila,
          },
          {
            status: "0",
          },
        ],
      };
    } else if (loksabha > 0) {
      matchData = {
        $and: [
          {
            role: {
              $in: [
                113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125,
              ],
            },
          },
          {
            loksabhaid: loksabha,
          },
          {
            status: "0",
          },
        ],
      };
    } else if (stateid > 0) {
      matchData = {
        $and: [
          {
            role: {
              $in: [
                139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151,
              ],
            },
          },
          {
            stateid: stateid,
          },
          {
            status: "0",
          },
        ],
      };
    }
    // national id
    else if (accesspost == 4) {
      matchData = {
        $and: [
          {
            role: {
              $in: [
                152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164,
              ],
            },
          },
          {
            status: "0",
          },
        ],
      };
    } else if (
      accesspost == 5 ||
      accesspost == 6 ||
      accesspost == 7 ||
      accesspost == 8 ||
      accesspost == 9 ||
      accesspost == 10 ||
      accesspost == 11 ||
      accesspost == 12 ||
      accesspost == 13 ||
      accesspost == 70
    ) {
      matchData = {
        $and: [
          {
            role: {
              $in: [
                152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164,
              ],
            },
          },
          {
            status: "0",
          },
        ],
      };
    }
    // national monitoring id
    else if (accesspost == 14 || accesspost == 15) {
      matchData = {
        $and: [
          {
            role: {
              $in: [
                152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164,
              ],
            },
          },
          {
            status: "0",
          },
        ],
      };
    }
    //state
    else if (
      accesspost == 16 ||
      accesspost == 17 ||
      accesspost == 18 ||
      accesspost == 19 ||
      accesspost == 20 ||
      accesspost == 21 ||
      accesspost == 22 ||
      accesspost == 23 ||
      accesspost == 24 ||
      accesspost == 71
    ) {
      matchData = {
        $and: [
          {
            role: {
              $in: [
                139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151,
              ],
            },
          },
          {
            stateid: {
              $in: array,
            },
          },
          {
            status: "0",
          },
        ],
      };
      // monitoring state
    } else if (accesspost == 41 || accesspost == 40) {
      matchData = {
        $and: [
          {
            role: {
              $in: [
                139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151,
              ],
            },
          },
          {
            stateid: {
              $in: array,
            },
          },
          {
            status: "0",
          },
        ],
      };
      // jila
    } else if (
      accesspost == 42 ||
      accesspost == 43 ||
      accesspost == 44 ||
      accesspost == 45 ||
      accesspost == 46 ||
      accesspost == 47 ||
      accesspost == 72 ||
      accesspost == 48
    ) {
      matchData = {
        $and: [
          {
            role: {
              $in: [
                126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138,
              ],
            },
          },
          {
            jilaid: {
              $in: accessjila,
            },
          },
          {
            status: "0",
          },
        ],
      };
    } else if (
      accesspost == 25 ||
      accesspost == 26 ||
      accesspost == 27 ||
      accesspost == 28 ||
      accesspost == 29 ||
      accesspost == 30 ||
      accesspost == 31 ||
      accesspost == 32
    ) {
      matchData = {
        $and: [
          {
            role: {
              $in: [
                113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125,
              ],
            },
          },
          {
            loksabhaid: {
              $in: accessloksabha,
            },
          },
          {
            status: "0",
          },
        ],
      };
    } else if (
      accesspost == 33 ||
      accesspost == 34 ||
      accesspost == 73 ||
      accesspost == 74 ||
      accesspost == 75 ||
      accesspost == 76 ||
      accesspost == 77 ||
      accesspost == 178 ||
      accesspost == 78
    ) {
      matchData = {
        $and: [
          {
            role: {
              $in: [
                100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112,
              ],
            },
          },
          {
            vidhansabhaid: {
              $in: accessvidhansabha,
            },
          },
          {
            status: "0",
          },
        ],
      };
    } else {
      res.status(200).json({
        success: true,
        status: "success",
        message: "Data not Found successfull",
        user: user,
      });
      return;
      //null data
    }
    // block ids
    //search
    if (req.body.search) {
      let newobj = {
        $or: [
          { mobile: req.body.search },
          { name: { $regex: req.body.search, $options: "i" } },
        ],
      };
      // Case-insensitive search
      matchData.$and.push(newobj);
    }
    // console.log(matchData);
    const usercount = await User.countDocuments(matchData);
    user = await User.aggregate([
      {
        $match: matchData,
      },
      {
        $addFields: {
          name: {
            $ifNull: [
              {
                $getField: {
                  field: { $concat: ['name_', lang] },
                  input: '$$ROOT'
                }
              },
              '$name' // Fallback to default name if missing/null
            ]
          },
          father_name: {
            $ifNull: [
              {
                $getField: {
                  field: { $concat: ['father_name_', lang] },
                  input: '$$ROOT'
                }
              },
              '$father_name' // Fallback to default father_name
            ]
          }
        }
      },
      {
        $lookup: {
          from: "user_roles",
          localField: "role",
          foreignField: "id",
          as: "postData",
          pipeline: [
            {
              $project: {
                _id: 0,
                id: 1,
                role_en: 1,
                role: `$role_${lang}`,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "states",
          localField: "stateid",
          foreignField: "id",
          as: "stateData",
          pipeline: [
            {
              $project: {
                _id: 0,
                id: 1,
                state_en: 1,
                state: `$state_${lang}`,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "loksabhas",
          localField: "loksabhaid",
          foreignField: "id",
          as: "loksabhaData",
          pipeline: [
            {
              $project: {
                _id: 0,
                id: 1,
                loksabha_en: 1,
                loksabha: `$loksabha_${lang}`,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "jilas",
          localField: "jilaid",
          foreignField: "id",
          as: "jilaData",
          pipeline: [
            {
              $project: {
                _id: 0,
                id: 1,
                jila_en: 1,
                jila: `$jila_${lang1}`,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "vidhansabhas",
          localField: "vidhansabhaid",
          foreignField: "id",
          as: "vidhansabhaData",
          pipeline: [
            {
              $project: {
                _id: 0,
                id: 1,
                vidhansabha_en: 1,
                vidhansabha: `$vidhansabha_${lang}`,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "blocks",
          localField: "blockid",
          foreignField: "id",
          as: "blockData",
          pipeline: [
            {
              $project: {
                _id: 0,
                id: 1,
                block_en: 1,
                block: `$block_${lang}`,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "zones",
          localField: "zoneid",
          foreignField: "id",
          as: "zoneData",
          pipeline: [
            {
              $project: {
                _id: 0,
                id: 1,
                zone_en: 1,
                zone: `$zone_${lang}`,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "sectors",
          localField: "sectorid",
          foreignField: "id",
          as: "sectorData",
          pipeline: [
            {
              $project: {
                _id: 0,
                id: 1,
                sector_en: 1,
                sector: `$sector_${lang}`,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "booths",
          localField: "boothid",
          foreignField: "id",
          as: "boothData",
          pipeline: [
            {
              $project: {
                _id: 0,
                id: 1,
                booth_en: 1,
                booth: `$booth_${lang}`,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "professions",
          localField: "profession",
          foreignField: "id",
          as: "professionData",
          pipeline: [
            {
              $project: {
                _id: 0,
                id: 1,
                profession_en: 1,
                profession: `$profession_${lang}`,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "castes",
          localField: "caste",
          foreignField: "id",
          as: "casteData",
          pipeline: [
            {
              $project: {
                _id: 0,
                id: 1,
                caste_en: 1,
                caste: `$caste_${lang}`,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "nikays",
          localField: "nikayid",
          foreignField: "id",
          as: "nikayData",
          pipeline: [
            {
              $project: {
                _id: 0,
                id: 1,
                nikay_en: 1,
                nikay: `$nikay_${lang}`,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "wards",
          localField: "wardid",
          foreignField: "id",
          as: "wardData",
          pipeline: [
            {
              $project: {
                _id: 0,
                id: 1,
                ward_en: 1,
                ward: `$ward_${lang}`,
              },
            },
          ],
        },
      },
      {
        $project: {
          _id: 1,
          name_en: 1,
          name: 1,
          father_name_en: 1,
          father_name: 1,
          address: 1,
          age:1,
          mobile: 1,
          gender: 1,
          assign_family: 1,
          sr_start: 1,
          sr_end: 1,
          whatsapp: 1,
          caste: 1,
          profession: 1,
          patrol_team: 1,
          table_prabhari: 1,
          polling_agent: 1,
          speaker: 1,
          whatsapp_prabhari: 1,

          stateid: 1,
          loksabhaid: 1,
          vidhansabhaid: 1,
          professionData: 1,
          casteData: 1,
          postData: 1,
          stateData: 1,
          loksabhaData: 1,
          jilaData: 1,
          vidhansabhaData: 1,
          blockData: 1,
          zoneData: 1,
          sectorData: 1,
          boothData: 1,
          nikayData: 1,
          wardData: 1,
          image: 1,
          narajReason: 1,
          fullImageurl: {
            $concat: [
              {
                $cond: [
                  { $eq: ["$image", ""] },
                  "",
                  "http://3.111.123.51:3001/uploads/",
                ],
              },
              "$image",
            ],
          },
        },
      },
      { $skip: parseInt(skip) },
      { $limit: parseInt(limit) },
    ]);

    if (!user) {
      return next(new creatError("User not Found!", 404));
    }

    res.status(200).json({
      success: true,
      status: "success",
      message: "Data Found successfull",
      user: user,
      counts: usercount,
    });
  } catch (error) {
    next(error);
  }
};
// Apply Changes
exports.monitoringusers = async (req, res, next) => {
  try {
    var user = [];
    var loweruser = [];
    var counts = 0;
    var matchData = {};
    var matchData1 = {};
    var {
      lang,
      stateid,
      loksabha,
      vidhansabha,
      jila,
      block,
      zone,
      sector,
      booth,
      nikay,
      ward,
      app_type,
      datatype,
      limit,
      skip,
      username,
    } = req.body;
    nikay = parseInt(nikay);
    block = parseInt(block);
    vidhansabha = parseInt(vidhansabha);
    loksabha = parseInt(loksabha);
    jila = parseInt(jila);
    stateid = parseInt(stateid);
    booth = parseInt(booth);
    const imgUrl = "http://3.111.123.51:3001/uploads/";
    const users = await User.findOne({ mobile: username });
    if (!users) {
      return next(new creatError("User can't exists", 400));
    }
    var lang1 = lang;
    if (lang == "hi") {
      lang1 = "hindi";
    }
    const accessstate = users.stateid;
    const accessjila = users.jilaid;
    const accessloksabha = users.loksabhaid;
    const accessvidhansabha = users.vidhansabhaid;
    const accessblock = users.blockid;
    const accessnikay = users.nikayid;
    const accessbooth = users.boothid;
    const accessward = users.wardid;
    const accesspost = users.role;

    // console.log(accesspost);
    // console.log(accessstate);
    const array = accessstate;
    // console.log(array);
    // not access monitoring teem
    if (
      booth > 0 ||
      block > 0 ||
      zone > 0 ||
      sector > 0 ||
      vidhansabha > 0 ||
      loksabha > 0 ||
      jila > 0 ||
      ward > 0 ||
      nikay > 0
    ) {
      res.status(200).json({
        success: true,
        status: "success",
        message: "Data not Found successfull",
        user: user,
      });
      return;
      //null data
    } else if (stateid > 0) {
      matchData = {
        $and: [
          {
            role: {
              $in: [41, 40],
            },
          },
          {
            stateid: stateid,
          },
          {
            status: "0",
          },
        ],
      };
    }
    //
    else if (accesspost == 4) {
      matchData = {
        $and: [
          {
            role: {
              $in: [14, 15],
            },
          },
          {
            status: "0",
          },
        ],
      };
    } else if (
      accesspost == 5 ||
      accesspost == 6 ||
      accesspost == 7 ||
      accesspost == 8 ||
      accesspost == 9 ||
      accesspost == 10 ||
      accesspost == 11 ||
      accesspost == 12 ||
      accesspost == 13
    ) {
      matchData = {
        $and: [
          {
            role: {
              $in: [14, 15],
            },
          },
          {
            status: "0",
          },
        ],
      };
    }
    // pradesh id

    //loksabha
    else if (
      accesspost == 16 ||
      accesspost == 17 ||
      accesspost == 18 ||
      accesspost == 19 ||
      accesspost == 20 ||
      accesspost == 21 ||
      accesspost == 22 ||
      accesspost == 23 ||
      accesspost == 24
    ) {
      matchData = {
        $and: [
          {
            role: {
              $in: [40, 41],
            },
          },
          {
            stateid: {
              $in: array,
            },
          },
          {
            status: "0",
          },
        ],
      };
    } else {
      res.status(200).json({
        success: true,
        status: "success",
        message: "Data not Found successfull",
        user: user,
      });
      return;
    }
    //search
    if (req.body.search) {
      let newobj = {
        $or: [
          { mobile: req.body.search },
          { name: { $regex: req.body.search, $options: "i" } },
        ],
      };
      // Case-insensitive search
      matchData.$and.push(newobj);
    }
    // console.log(matchData);
    const usercount = await User.countDocuments(matchData);
    // console.log("coiunts", usercount)
    user = await User.aggregate([
      {
        $match: matchData,
      },
      {
        $addFields: {
          name: {
            $ifNull: [
              {
                $getField: {
                  field: { $concat: ['name_', lang] },
                  input: '$$ROOT'
                }
              },
              '$name' // Fallback to default name if missing/null
            ]
          },
          father_name: {
            $ifNull: [
              {
                $getField: {
                  field: { $concat: ['father_name_', lang] },
                  input: '$$ROOT'
                }
              },
              '$father_name' // Fallback to default father_name
            ]
          }
        }
      },
      {
        $lookup: {
          from: "user_roles",
          localField: "role",
          foreignField: "id",
          as: "postData",
          pipeline: [
            {
              $project: {
                _id: 0,
                id: 1,
                role_en: 1,
                role: `$role_${lang}`,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "states",
          localField: "stateid",
          foreignField: "id",
          as: "stateData",
          pipeline: [
            {
              $project: {
                _id: 0,
                id: 1,
                state_en: 1,
                state: `$state_${lang}`,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "loksabhas",
          localField: "loksabhaid",
          foreignField: "id",
          as: "loksabhaData",
          pipeline: [
            {
              $project: {
                _id: 0,
                id: 1,
                loksabha_en: 1,
                loksabha: `$loksabha_${lang}`,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "jilas",
          localField: "jilaid",
          foreignField: "id",
          as: "jilaData",
          pipeline: [
            {
              $project: {
                _id: 0,
                id: 1,
                jila_en: 1,
                jila: `$jila_${lang1}`,
              },
            },
          ],
        },
      },

      {
        $project: {
          _id: 1,
          name_en: 1,
          name: 1,
          father_name_en: 1,
          father_name: 1,
          age: 1,
          address: 1,
          mobile: 1,
          gender: 1,
          assign_family: 1,
          stateid: 1,
          loksabhaid: 1,
          vidhansabhaid: 1,
          postData: 1,
          stateData: 1,
          loksabhaData: 1,
          jilaData: 1,
          narajReason: 1,

          image: 1,
          fullImageurl: {
            $concat: [
              {
                $cond: [
                  { $eq: ["$image", ""] },
                  "",
                  "http://3.111.123.51:3001/uploads/",
                ],
              },
              "$image",
            ],
          },
        },
      },
      { $skip: parseInt(skip) },
      { $limit: parseInt(limit) },
    ]);

    if (!user) {
      return next(new creatError("User not Found!", 404));
    }

    res.status(200).json({
      success: true,
      status: "success",
      message: "Data Found successfull",
      user: user,
      count: usercount,
    });
    return;
  } catch (error) {
    next(error);
  }
};

exports.lowerwarroomusers = async (req, res, next) => {
  try {
    var user = [];
    var counts = 0;
    var matchData = {};
    var {
      lang,
      stateid,
      loksabha,
      jila,
      vidhansabha,
      block,
      zone,
      sector,
      booth,
      nikay,
      ward,
      app_type,
      levletype,
      datatype,
      limit,
      skip,
      username,
    } = req.body;
    block = parseInt(block);
    ward = parseInt(ward);
    nikay = parseInt(nikay);
    vidhansabha = parseInt(vidhansabha);
    loksabha = parseInt(loksabha);
    jila = parseInt(jila);
    stateid = parseInt(stateid);
    booth = parseInt(booth);
    zone = parseInt(zone);
    sector = parseInt(sector);
    const imgUrl = "http://3.111.123.51:3001/uploads/";
    const users = await User.findOne({ mobile: username });
    if (!users) {
      return next(new creatError("User can't exists", 400));
    }
    const accessstate = users.stateid;
    const accessjila = users.jilaid;
    const accessloksabha = users.loksabhaid;
    const accessvidhansabha = users.vidhansabhaid;
    const accessblock = users.blockid;
    const accessbooth = users.boothid;
    const accesszone = users.zoneid;
    const accesssector = users.sectorid;
    const accessnikay = users.nikayid;
    const accessward = users.wardid;
    const accesspost = users.role;
    loksabha = parseInt(loksabha);
    var lang1 = lang;
    if (lang === "hi") {
      lang1 = "hindi";
    }
    // console.log(accesspost);
    // console.log(accessstate);
    const array = accessstate;
    // console.log(array);
    if (booth > 0 || ward > 0) {
      res.status(200).json({
        success: true,
        status: "success",
        message: "Data not Found successfull",
        user: user,
      });
      return;
    } else if (sector > 0) {
      matchData = {
        $and: [
          {
            role: {
              $in: [37, 38, 39, 88, 94, 90, 96, 97, 98, 91, 89, 95, 93, 92, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174,179,180],
            },
          },
          {
            sectorid: sector,
          },
          {
            status: "0",
          },
        ],
      };
    } else if (zone > 0) {
      matchData = {
        $and: [
          {
            role: {
              $in: [87, 175],
            },
          },
          {
            zoneid: zone,
          },
          {
            status: "0",
          },
        ],
      };
    } else if (block > 0) {
      matchData = {
        $and: [
          {
            role: {
              $in: [86, 176],
            },
          },
          {
            blockid: block,
          },
          {
            status: "0",
          },
        ],
      };
    } else if (nikay > 0) {
      matchData = {
        $and: [
          {
            role: {
              $in: [59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 99],
            },
          },
          {
            nikayid: nikay,
          },
          {
            status: "0",
          },
        ],
      };
    } else if (vidhansabha > 0) {
      matchData = {
        $and: [
          {
            role: {
              $in: [35, 36, 81, 82, 83, 84, 85, 80, 79, 177],
            },
          },
          {
            vidhansabhaid: vidhansabha,
          },
          {
            status: "0",
          },
        ],
      };
    } else if (jila > 0) {
      matchData = {
        $and: [
          {
            role: {
              $in: [49, 50, 51, 52, 53, 54, 55, 56, 57, 58],
            },
          },
          {
            jilaid: jila,
          },
          {
            status: "0",
          },
        ],
      };
    } else if (loksabha > 0) {
      matchData = {
        $and: [
          {
            role: {
              $in: [33, 34,178],
            },
          },
          {
            loksabhaid: parseInt(loksabha),
          },
          {
            status: "0",
          },
        ],
      };
    } else if (stateid > 0) {
      if (levletype == "loksabha") {
        matchData = {
          $and: [
            {
              role: {
                $in: [25, 26, 27, 28],
              },
            },
            {
              stateid: stateid,
            },
            {
              status: "0",
            },
          ],
        };
      } else {
        matchData = {
          $and: [
            {
              role: {
                $in: [42, 43, 44, 45, 46, 47, 48, 72],
              },
            },
            {
              stateid: stateid,
            },
            {
              status: "0",
            },
          ],
        };
      }
    } else if (accesspost == 4) {
      matchData = {
        $and: [
          {
            role: {
              $in: [16, 17, 18, 19, 20, 21, 22, 23, 24, 71],
            },
          },
          {
            status: "0",
          },
        ],
      };
    } else if (
      accesspost == 5 ||
      accesspost == 6 ||
      accesspost == 7 ||
      accesspost == 8 ||
      accesspost == 9 ||
      accesspost == 10 ||
      accesspost == 11 ||
      accesspost == 12 ||
      accesspost == 13 ||
      accesspost == 70
    ) {
      matchData = {
        $and: [
          {
            role: {
              $in: [16, 17, 18, 19, 20, 21, 22, 23, 24, 71],
            },
          },
          {
            status: "0",
          },
        ],
      };
    }
    // pradesh id
    else if (accesspost == 14 || accesspost == 15) {
      matchData = {
        $and: [
          {
            role: {
              $in: [16, 17, 18, 19, 20, 21, 22, 23, 24, 71],
            },
          },
          {
            status: "0",
          },
        ],
      };
    }
    //loksabha
    else if (
      accesspost == 16 ||
      accesspost == 17 ||
      accesspost == 18 ||
      accesspost == 19 ||
      accesspost == 20 ||
      accesspost == 21 ||
      accesspost == 22 ||
      accesspost == 23 ||
      accesspost == 71 ||
      accesspost == 24
    ) {
      if (levletype == "loksabha") {
        matchData = {
          $and: [
            {
              role: {
                $in: [25, 26, 27, 28],
              },
            },
            {
              stateid: {
                $in: array,
              },
            },
            {
              status: "0",
            },
          ],
        };
      } else {
        matchData = {
          $and: [
            {
              role: {
                $in: [42, 43, 44, 45, 46, 47, 48, 72],
              },
            },
            {
              stateid: {
                $in: array,
              },
            },
            {
              status: "0",
            },
          ],
        };
      }
    } else if (accesspost == 41 || accesspost == 40) {
      if (levletype == "loksabha") {
        matchData = {
          $and: [
            {
              role: {
                $in: [25, 26, 27, 28],
              },
            },
            {
              stateid: {
                $in: array,
              },
            },
            {
              status: "0",
            },
          ],
        };
      } else {
        matchData = {
          $and: [
            {
              role: {
                $in: [42, 43, 44, 45, 46, 47, 48, 72],
              },
            },
            {
              stateid: {
                $in: array,
              },
            },
            {
              status: "0",
            },
          ],
        };
      }
    } else if (
      accesspost == 42 ||
      accesspost == 43 ||
      accesspost == 44 ||
      accesspost == 45 ||
      accesspost == 46 ||
      accesspost == 47 ||
      accesspost == 72 ||
      accesspost == 48
    ) {
      if (app_type === "nigam") {
        matchData = {
          $and: [
            {
              role: {
                $in: [49, 50, 51, 52, 53, 54, 55, 56, 57, 58],
              },
            },
            {
              jilaid: {
                $in: accessjila,
              },
            },
            {
              status: "0",
            },
          ],
        };
      } else {
        matchData = {
          $and: [
            {
              role: {
                $in: [33, 34, 73, 74, 75, 76, 77, 78,178],
              },
            },
            {
              jilaid: {
                $in: accessjila,
              },
            },
            {
              status: "0",
            },
          ],
        };
      }
    } else if (
      accesspost == 49 ||
      accesspost == 50 ||
      accesspost == 51 ||
      accesspost == 52 ||
      accesspost == 43 ||
      accesspost == 54 ||
      accesspost == 55 ||
      accesspost == 56 ||
      accesspost == 57 ||
      accesspost == 58
    ) {
      matchData = {
        $and: [
          {
            role: {
              $in: [59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 99],
            },
          },
          {
            wardid: {
              $in: accessward,
            },
          },
          {
            status: "0",
          },
        ],
      };
    } else if (
      accesspost == 25 ||
      accesspost == 26 ||
      accesspost == 27 ||
      accesspost == 28
    ) {
      matchData = {
        $and: [
          {
            role: {
              $in: [33, 34, 73, 74, 75, 76, 77, 78, 178],
            },
          },
          {
            loksabhaid: {
              $in: accessloksabha,
            },
          },
          {
            status: "0",
          },
        ],
      };
    } else if (
      accesspost == 29 ||
      accesspost == 30 ||
      accesspost == 31 ||
      accesspost == 32
    ) {
      matchData = {
        $and: [
          {
            role: {
              $in: [33, 34, 73, 74, 75, 76, 77, 78, 178],
            },
          },
          {
            loksabhaid: {
              $in: accessloksabha,
            },
          },
          {
            status: "0",
          },
        ],
      };
    } else if (
      accesspost == 33 ||
      accesspost == 34 ||
      accesspost == 73 ||
      accesspost == 74 ||
      accesspost == 75 ||
      accesspost == 76 ||
      accesspost == 77 ||
      accesspost == 178 ||
      accesspost == 78
    ) {
      matchData = {
        $and: [
          {
            role: {
              $in: [35, 36, 81, 82, 83, 84, 85, 80, 79, 177],
            },
          },
          {
            vidhansabhaid: {
              $in: accessvidhansabha,
            },
          },
          {
            status: "0",
          },
        ],
      };
    } else if (
      accesspost == 35 ||
      accesspost == 36 ||
      accesspost == 81 ||
      accesspost == 82 ||
      accesspost == 83 ||
      accesspost == 84 ||
      accesspost == 85 ||
      accesspost == 80 ||
      accesspost == 79 ||
      accesspost == 177
    ) {
      matchData = {
        $and: [
          {
            role: {
              $in: [86, 176],
            },
          },
          {
            blockid: {
              $in: accessblock,
            },
          },
          {
            status: "0",
          },
        ],
      };
    } else if (accesspost == 86 || accesspost == 176) {
      matchData = {
        $and: [
          {
            role: {
              $in: [87, 175],
            },
          },
          {
            zoneid: {
              $in: accesszone,
            },
          },
          {
            status: "0",
          },
        ],
      };
    } else if (accesspost == 87 || accesspost == 175) {
      matchData = {
        $and: [
          {
            role: {
              $in: [37, 38, 39, 88, 94, 90, 96, 97, 98, 91, 89, 95, 93, 92, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174,179,180],
            },
          },
          {
            sectorid: {
              $in: accesssector,
            },
          },
          {
            status: "0",
          },
        ],
      };
    } else {
      res.status(200).json({
        success: true,
        status: "success",
        message: "Data not Found successfull",
        user: user,
      });
      return;
    }

    //search
    if (req.body.search) {
      let newobj = {
        $or: [
          { mobile: req.body.search },
          { name: { $regex: req.body.search, $options: "i" } },
        ],
      };
      // Case-insensitive search
      matchData.$and.push(newobj);
    }

    // console.log(matchData);
    user = await User.aggregate([
      {
        $match: matchData,
      },
      {
        $addFields: {
          name: {
            $ifNull: [
              {
                $getField: {
                  field: { $concat: ['name_', lang] },
                  input: '$$ROOT'
                }
              },
              '$name' // Fallback to default name if missing/null
            ]
          },
          father_name: {
            $ifNull: [
              {
                $getField: {
                  field: { $concat: ['father_name_', lang] },
                  input: '$$ROOT'
                }
              },
              '$father_name' // Fallback to default father_name
            ]
          }
        }
      },
      {
        $lookup: {
          from: "user_roles",
          localField: "role",
          foreignField: "id",
          as: "postData",
          pipeline: [
            {
              $project: {
                _id: 0,
                id: 1,
                role_en: 1,
                role: `$role_${lang}`,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "states",
          localField: "stateid",
          foreignField: "id",
          as: "stateData",
          pipeline: [
            {
              $project: {
                _id: 0,
                id: 1,
                state_en: 1,
                state: `$state_${lang}`,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "jilas",
          localField: "jilaid",
          foreignField: "id",
          as: "jilaData",
          pipeline: [
            {
              $project: {
                _id: 0,
                id: 1,
                jila_en: 1,
                jila: `$jila_${lang1}`,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "loksabhas",
          localField: "loksabhaid",
          foreignField: "id",
          as: "loksabhaData",
          pipeline: [
            {
              $project: {
                _id: 0,
                id: 1,
                loksabha_en: 1,
                loksabha: `$loksabha_${lang}`,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "vidhansabhas",
          localField: "vidhansabhaid",
          foreignField: "id",
          as: "vidhansabhaData",
          pipeline: [
            {
              $project: {
                _id: 0,
                id: 1,
                vidhansabha_en: 1,
                vidhansabha: `$vidhansabha_${lang1}`,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "blocks",
          localField: "blockid",
          foreignField: "id",
          as: "blockData",
          pipeline: [
            {
              $project: {
                _id: 0,
                id: 1,
                block_en: 1,
                block: `$block_${lang}`,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "zones",
          localField: "zoneid",
          foreignField: "id",
          as: "zoneData",
          pipeline: [
            {
              $project: {
                _id: 0,
                id: 1,
                zone_en: 1,
                zone: `$zone_${lang}`,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "sectors",
          localField: "sectorid",
          foreignField: "id",
          as: "sectorData",
          pipeline: [
            {
              $project: {
                _id: 0,
                id: 1,
                sector_en: 1,
                sector: `$sector_${lang}`,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "booths",
          localField: "boothid",
          foreignField: "id",
          as: "boothData",
          pipeline: [
            {
              $project: {
                _id: 0,
                id: 1,
                booth_en: 1,
                booth: `$booth_${lang}`,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "nikays",
          localField: "nikayid",
          foreignField: "id",
          as: "nikayData",
          pipeline: [
            {
              $project: {
                _id: 0,
                id: 1,
                nikay_en: 1,
                nikay: `$nikay_${lang}`,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "wards",
          localField: "wardid",
          foreignField: "id",
          as: "wardData",
          pipeline: [
            {
              $project: {
                _id: 0,
                id: 1,
                ward_en: 1,
                ward: `$ward_${lang}`,
              },
            },
          ],
        },
      },
      {
        $project: {
          _id: 1,
          name_en: 1,
          name: 1,
          father_name_en: 1,
          father_name: 1,
          address: 1,
          age: 1,
          mobile: 1,
          gender: 1,
          assign_family: 1,
          stateid: 1,
          loksabhaid: 1,
          vidhansabhaid: 1,
          postData: 1,
          stateData: 1,
          jilaData: 1,
          loksabhaData: 1,
          vidhansabhaData: 1,
          blockData: 1,
          zoneData: 1,
          sectorData: 1,
          boothData: 1,
          wardData: 1,
          nikayData: 1,
          narajReason: 1,
          image: 1,
          fullImageurl: "$image",
        },
      },
      { $skip: parseInt(skip) },
      { $limit: parseInt(limit) },
    ]);
    counts = await User.aggregate([
      {
        $match: matchData,
      },

      {
        $lookup: {
          from: "vidhansabhas",
          localField: "vidhansabhaid",
          foreignField: "id",
          as: "vidhansabhaData",
          pipeline: [
            {
              $project: {
                _id: 0,
                id: 1,
                vidhansabha_en: 1,
                vidhansabha: `$vidhansabha_${lang}`,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "blocks",
          localField: "blockid",
          foreignField: "id",
          as: "blockData",
          pipeline: [
            {
              $project: {
                _id: 0,
                id: 1,
                block_en: 1,
                block: `$block_${lang}`,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "booths",
          localField: "boothid",
          foreignField: "id",
          as: "boothData",
          pipeline: [
            {
              $project: {
                _id: 0,
                id: 1,
                booth_en: 1,
                booth: `$booth_${lang}`,
              },
            },
          ],
        },
      },
      {
        $count: "passing_scores",
      },
    ]);
    const usercount = await User.countDocuments(matchData);
    // console.log("coiunts", usercount)
    if (user.length <= 0) {
      // console.log("user s", user.length);

      res.status(200).json({
        success: true,
        status: "success",
        message: "Data Not Found successfull",
        counts: 0,
        user: user,
      });
      return;
    }

    res.status(200).json({
      success: true,
      status: "success",
      message: "Data Found successfull",
      counts: counts[0].passing_scores,
      user: user,
    });
  } catch (error) {
    next(error);
  }
};
exports.lowermonitoringusers = async (req, res, next) => {
  try {
    var user = [];
    var loweruser = [];
    var counts = 0;
    var matchData = {};
    var matchData1 = {};
    var {
      lang,
      stateid,
      loksabha,
      jila,
      vidhansabha,
      block,
      booth,
      datatype,
      limit,
      skip,
      username,
    } = req.body;
    block = parseInt(block);
    vidhansabha = parseInt(vidhansabha);
    loksabha = parseInt(loksabha);
    jila = parseInt(jila);
    stateid = parseInt(stateid);
    booth = parseInt(booth);
    const imgUrl = "http://3.111.123.51:3001/uploads/";
    const users = await User.findOne({ mobile: username });
    if (!users) {
      return next(new creatError("User can't exists", 400));
    }
    var lang1 = lang;
    if (lang == "hi") {
      lang1 = "hindi";
    }
    const accessstate = users.stateid;
    const accessjila = users.jilaid;
    const accessloksabha = users.loksabhaid;
    const accessvidhansabha = users.vidhansabhaid;
    const accessblock = users.blockid;
    const accessbooth = users.boothid;
    const accesspost = users.role;

    // console.log(accesspost);
    // console.log(accessstate);
    const array = accessstate;
    // console.log(array);
    if (
      booth > 0 ||
      block > 0 ||
      vidhansabha > 0 ||
      jila > 0 ||
      loksabha > 0 ||
      stateid > 0
    ) {
      res.status(200).json({
        success: true,
        status: "success",
        message: "Data not Found successfull",
        user: user,
      });
      return;
      //null data
    } else if (
      accesspost == 4 ||
      accesspost == 5 ||
      accesspost == 6 ||
      accesspost == 7 ||
      accesspost == 8 ||
      accesspost == 9 ||
      accesspost == 10 ||
      accesspost == 11 ||
      accesspost == 12 ||
      accesspost == 13 ||
      accesspost == 14 ||
      accesspost == 15
    ) {
      matchData = {
        $and: [
          {
            role: {
              $in: [41, 40],
            },
          },
          {
            status: "0",
          },
        ],
      };
    } else {
      res.status(200).json({
        success: true,
        status: "success",
        message: "not Data Found successfull",
        user: user,
      });
      return;
    }
    // pradesh id
    //search
    if (req.body.search) {
      let newobj = {
        $or: [
          { mobile: req.body.search },
          { name: { $regex: req.body.search, $options: "i" } },
        ],
      };
      // Case-insensitive search
      matchData.$and.push(newobj);
    }

    // console.log(matchData);
    user = await User.aggregate([
      {
        $match: matchData,
      },
      {
        $addFields: {
          name: {
            $ifNull: [
              {
                $getField: {
                  field: { $concat: ['name_', lang] },
                  input: '$$ROOT'
                }
              },
              '$name' // Fallback to default name if missing/null
            ]
          },
          father_name: {
            $ifNull: [
              {
                $getField: {
                  field: { $concat: ['father_name_', lang] },
                  input: '$$ROOT'
                }
              },
              '$father_name' // Fallback to default father_name
            ]
          }
        }
      },
      {
        $lookup: {
          from: "user_roles",
          localField: "role",
          foreignField: "id",
          as: "postData",
          pipeline: [
            {
              $project: {
                _id: 0,
                id: 1,
                role_en: 1,
                role: `$role_${lang}`,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "states",
          localField: "stateid",
          foreignField: "id",
          as: "stateData",
          pipeline: [
            {
              $project: {
                _id: 0,
                id: 1,
                state_en: 1,
                state: `$state_${lang}`,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "loksabhas",
          localField: "loksabhaid",
          foreignField: "id",
          as: "loksabhaData",
          pipeline: [
            {
              $project: {
                _id: 0,
                id: 1,
                loksabha_en: 1,
                loksabha: `$loksabha_${lang}`,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "vidhansabhas",
          localField: "vidhansabhaid",
          foreignField: "id",
          as: "vidhansabhaData",
          pipeline: [
            {
              $project: {
                _id: 0,
                id: 1,
                vidhansabha_en: 1,
                vidhansabha: `$vidhansabha_${lang}`,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "blocks",
          localField: "blockid",
          foreignField: "id",
          as: "blockData",
          pipeline: [
            {
              $project: {
                _id: 0,
                id: 1,
                block_en: 1,
                block: `$block_${lang}`,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "booths",
          localField: "boothid",
          foreignField: "id",
          as: "boothData",
          pipeline: [
            {
              $project: {
                _id: 0,
                id: 1,
                booth_en: 1,
                booth: `$booth_${lang}`,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "nikays",
          localField: "nikayid",
          foreignField: "id",
          as: "nikayData",
          pipeline: [
            {
              $project: {
                _id: 0,
                id: 1,
                nikay_en: 1,
                nikay: `$nikay_${lang}`,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "wards",
          localField: "wardid",
          foreignField: "id",
          as: "wardData",
          pipeline: [
            {
              $project: {
                _id: 0,
                id: 1,
                ward_en: 1,
                ward: `$ward_${lang}`,
              },
            },
          ],
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          name_en: 1,
          name: 1,
          father_name_en: 1,
          father_name: 1,
          mobile: 1,
          age: 1,
          gender: 1,
          assign_family: 1,
          stateid: 1,
          loksabhaid: 1,
          vidhansabhaid: 1,
          postData: 1,
          stateData: 1,
          loksabhaData: 1,
          vidhansabhaData: 1,
          blockData: 1,
          boothData: 1,
          wardData: 1,
          nikayData: 1,
          narajReason: 1,
          image: 1,
          fullImageurl: {
            $concat: [
              {
                $cond: [
                  { $eq: ["$image", ""] },
                  "",
                  "http://3.111.123.51:3001/uploads/",
                ],
              },
              "$image",
            ],
          },
        },
      },
      { $skip: parseInt(skip) },
      { $limit: parseInt(limit) },
    ]);

    if (!user) {
      return next(new creatError("User not Found!", 404));
    }

    res.status(200).json({
      success: true,
      status: "success",
      message: "Data Found successfull",
      user: user,
    });
    return;
  } catch (error) {
    next(error);
  }
};

exports.userprofile = async (req, res, next) => {
  try {
    var user = [];
    var counts = 0;
    var matchData = {};
    var { lang, userId } = req.body;
    var lang1 = lang;
    if (lang === "hi") {
      lang1 = "hindi";
    }

    matchData = {
      _id: new mongoose.Types.ObjectId(userId),
    };
    console.log(matchData);
    user = await User.aggregate([
      {
        $match: matchData,
      },
      {
        $lookup: {
          from: "user_roles",
          localField: "role",
          foreignField: "id",
          as: "postData",
          pipeline: [
            {
              $project: {
                _id: 0,
                id: 1,
                role_en: 1,
                role: `$role_${lang}`,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "states",
          localField: "stateid",
          foreignField: "id",
          as: "stateData",
          pipeline: [
            {
              $project: {
                _id: 0,
                id: 1,
                state_en: 1,
                state: `$state_${lang}`,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "jilas",
          localField: "jilaid",
          foreignField: "id",
          as: "jilaData",
          pipeline: [
            {
              $project: {
                _id: 0,
                id: 1,
                jila_en: 1,
                jila: `$jila_${lang1}`,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "loksabhas",
          localField: "loksabhaid",
          foreignField: "id",
          as: "loksabhaData",
          pipeline: [
            {
              $project: {
                _id: 0,
                id: 1,
                loksabha_en: 1,
                loksabha: `$loksabha_${lang}`,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "vidhansabhas",
          localField: "vidhansabhaid",
          foreignField: "id",
          as: "vidhansabhaData",
          pipeline: [
            {
              $project: {
                _id: 0,
                id: 1,
                vidhansabha_en: 1,
                vidhansabha: `$vidhansabha_${lang1}`,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "blocks",
          localField: "blockid",
          foreignField: "id",
          as: "blockData",
          pipeline: [
            {
              $project: {
                _id: 0,
                id: 1,
                block_en: 1,
                block: `$block_${lang}`,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "zones",
          localField: "zoneid",
          foreignField: "id",
          as: "zoneData",
          pipeline: [
            {
              $project: {
                _id: 0,
                id: 1,
                zone_en: 1,
                zone: `$zone_${lang}`,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "sectors",
          localField: "sectorid",
          foreignField: "id",
          as: "sectorData",
          pipeline: [
            {
              $project: {
                _id: 0,
                id: 1,
                sector_en: 1,
                sector: `$sector_${lang}`,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "booths",
          localField: "boothid",
          foreignField: "id",
          as: "boothData",
          pipeline: [
            {
              $project: {
                _id: 0,
                id: 1,
                booth_en: 1,
                booth: `$booth_${lang}`,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "nikays",
          localField: "nikayid",
          foreignField: "id",
          as: "nikayData",
          pipeline: [
            {
              $project: {
                _id: 0,
                id: 1,
                nikay_en: 1,
                nikay: `$nikay_${lang}`,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "wards",
          localField: "wardid",
          foreignField: "id",
          as: "wardData",
          pipeline: [
            {
              $project: {
                _id: 0,
                id: 1,
                ward_en: 1,
                ward: `$ward_${lang}`,
              },
            },
          ],
        },
      },
      {
        $project: {
          _id: 1,
          name_en: 1,
          name: `$name_${lang}`,
          father_name_en: 1,
          father_name: `$father_name_${lang}`,
          address: 1,
          mobile: 1,
          gender: 1,
          assign_family: 1,
          stateid: 1,
          loksabhaid: 1,
          vidhansabhaid: 1,
          postData: 1,
          stateData: 1,
          jilaData: 1,
          loksabhaData: 1,
          vidhansabhaData: 1,
          blockData: 1,
          zoneData: 1,
          sectorData: 1,
          boothData: 1,
          wardData: 1,
          nikayData: 1,
          image: 1,
          narajReason: 1,
        },
      },
    ]);
    counts = await User.countDocuments(matchData);
    if (user.length <= 0) {
      // console.log("user s", user.length);

      res.status(200).json({
        success: true,
        status: "success",
        message: "Data Not Found successfull",
        counts: counts,
        user: user,
      });
      return;
    }

    res.status(200).json({
      success: true,
      status: "success",
      message: "Data Found successfull",
      counts: counts,
      user: user,
    });
  } catch (error) {
    next(error);
  }
};


exports.masterttrainer_by_vidhansbha = async (req, res, next) => {
  try {
    const { vidhansabhaid, search = "", limit, skip, lang = "en" } = req.body;
    var user = [];
    var counts = 0;

    var matchData = {
      $and: [
        { role: 3 },
        { vidhansabhaid: parseInt(vidhansabhaid) },
        { status: "0" },
      ],
    };

    if (search && search.trim() !== "") {
      matchData.$and.push({
        $or: [
          { name_en: { $regex: search, $options: "i" } },
          { name_hi: { $regex: search, $options: "i" } },
          { ["name_" + lang]: { $regex: search, $options: "i" } },
          { father_name_en: { $regex: search, $options: "i" } },
          { father_name_hi: { $regex: search, $options: "i" } },
          { ["father_name_" + lang]: { $regex: search, $options: "i" } },
          { mobile: { $regex: search, $options: "i" } },
        ],
      });
    }

    user = await User.aggregate([
      {
        $match: matchData,
      },
      {
        $addFields: {
          name: {
            $ifNull: [
              {
                $getField: {
                  field: { $concat: ['name_', lang] },
                  input: '$$ROOT'
                }
              },
              '$name' // Fallback to default name if missing/null
            ]
          },
          father_name: {
            $ifNull: [
              {
                $getField: {
                  field: { $concat: ['father_name_', lang] },
                  input: '$$ROOT'
                }
              },
              '$father_name' // Fallback to default father name if missing/null
            ]
          },
        }
      },
      {
        $project: {
          _id: 1,
          name_en: 1,
          name: 1,
          father_name_en: 1,
          father_name: 1,
          mobile: 1,
          gender: 1,
          vidhansabhaid: 1,
          image: 1,
          address: 1,

        },
      },
      { $skip: parseInt(skip) },
      { $limit: parseInt(limit) },
    ]);
    counts = await User.countDocuments(matchData);
    res.status(200).json({
      success: true,
      status: "success",
      message: "Data Found successfull",
      counts: counts,
      user: user,
    });
  } catch (error) {
    next(error);
  }
};