const User = require("../models/userModel");
const creatError = require("../utils/appError");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");

exports.users = async (req, res, next) => {
  try {
    var user = [];
    var loweruser = [];
    var counts = 0;
    var matchData = {};
    var matchData1 = {};
    const {
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
              $in: ["33", "34"],
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
    if (accesspost == 33 || accesspost == 34) {
      matchData = {
        $and: [
          {
            role: {
              $in: ["33", "34"],
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
              $in: ["35", "36"],
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
    if (accesspost == 35 || accesspost == 36) {
      matchData = {
        $and: [
          {
            role: {
              $in: ["35", "36"],
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
              $in: ["37", "38", "39"],
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
          name: 1,
          father_name: 1,
          mobile: 1,
          gender: 1,
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
            name: 1,
            father_name: 1,
            mobile: 1,
            gender: 1,
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
    console.log(result);
    console.log(result.modifiedCount);
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
    const {
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

    const array = accessstate;
    // console.log(array);
    if (booth > 0) {
      matchData = {
        $and: [
          {
            role: {
              $in: ["37", "38", "39"],
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
    } else if (block > 0) {
      matchData = {
        $and: [
          {
            role: {
              $in: ["35", "36"],
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
              $in: ["33", "34"],
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
              $in: ["25", "26", "27", "28"],
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
              $in: ["25", "26", "27", "28"],
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
              $in: ["14", "15", "16", "17", "18", "19", "20"],
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
    // pradesh id
    else if (accesspost == 4) {
      matchData = {
        $and: [
          {
            role: {
              $in: ["5", "6", "7", "8", "9"],
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
      accesspost == 9
    ) {
      matchData = {
        $and: [
          {
            role: {
              $in: ["5", "6", "7", "8", "9"],
            },
          },
          {
            status: "0",
          },
        ],
      };
    }
    // pradesh id
    else if (
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
    }
    //loksabha
    else if (
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
              $in: ["14", "15", "16", "17", "18", "19", "20"],
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
    } else if (
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
    } else if (accesspost == 33 || accesspost == 34) {
      matchData = {
        $and: [
          {
            role: {
              $in: ["33", "34"],
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
    } else if (accesspost == 35 || accesspost == 36) {
      matchData = {
        $and: [
          {
            role: {
              $in: ["35", "36"],
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
          name: 1,
          father_name: 1,
          mobile: 1,
          gender: 1,
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

    if (!user) {
      return next(new creatError("User not Found!", 404));
    }

    res.status(200).json({
      success: true,
      status: "success",
      message: "Data Found successfull",
      user: user,
    });
  } catch (error) {
    next(error);
  }
};

exports.monitoringusers = async (req, res, next) => {
  try {
    var user = [];
    var loweruser = [];
    var counts = 0;
    var matchData = {};
    var matchData1 = {};
    const {
      lang,
      stateid,
      loksabha,
      vidhansabha,
      jila,
      block,
      booth,
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
    // not access monitoring teem
    if (booth > 0 || block > 0 || vidhansabha > 0) {
      res.status(200).json({
        success: true,
        status: "success",
        message: "Data not Found successfull",
        user: user,
      });
      return;
      //null data
    } else if (jila > 0) {
      matchData = {
        $and: [
          {
            role: {
              $in: ["29", "30", "31", "32"],
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
              $in: ["29", "30", "31", "32"],
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
              $in: ["21", "22", "23", "24"],
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
    } else if (
      accesspost == 10 ||
      accesspost == 11 ||
      accesspost == 12 ||
      accesspost == 13 ||
      accesspost == 21 ||
      accesspost == 22 ||
      accesspost == 23 ||
      accesspost == 24 ||
      accesspost == 29 ||
      accesspost == 30 ||
      accesspost == 31 ||
      accesspost == 32 ||
      accesspost == 33 ||
      accesspost == 34 ||
      accesspost == 35 ||
      accesspost == 36
    ) {
      res.status(200).json({
        success: true,
        status: "success",
        message: "Data not Found successfull",
        user: user,
      });
      return;
    }
    //
    else if (accesspost == 4) {
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
    } else if (
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
              $in: ["10", "11", "12", "13"],
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
          name: 1,
          father_name: 1,
          mobile: 1,
          gender: 1,
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

exports.lowerwarroomusers = async (req, res, next) => {
  try {
    var user = [];
    var counts = 0;
    var matchData = {};
    const {
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
    if (booth > 0) {
      res.status(200).json({
        success: true,
        status: "success",
        message: "Data not Found successfull",
        user: user,
      });
      return;
    } else if (block > 0) {
      matchData = {
        $and: [
          {
            role: {
              $in: ["37", "38", "39"],
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
              $in: ["35", "36"],
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
              $in: ["33", "34"],
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
              $in: ["33", "34"],
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
              $in: ["25", "26", "27", "28"],
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
    } else if (accesspost == 4) {
      matchData = {
        $and: [
          {
            role: {
              $in: ["14", "15", "16", "17", "18", "19", "20"],
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
      accesspost == 9
    ) {
      matchData = {
        $and: [
          {
            role: {
              $in: ["14", "15", "16", "17", "18", "19", "20"],
            },
          },
          {
            status: "0",
          },
        ],
      };
    }
    // pradesh id
    else if (
      accesspost == 10 ||
      accesspost == 11 ||
      accesspost == 12 ||
      accesspost == 13
    ) {
      matchData = {
        $and: [
          {
            role: {
              $in: ["14", "15", "16", "17", "18", "19", "20"],
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
              $in: ["25", "26", "27", "28"],
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
    } else if (
      accesspost == 21 ||
      accesspost == 22 ||
      accesspost == 23 ||
      accesspost == 24
    ) {
      matchData = {
        $and: [
          {
            role: {
              $in: ["25", "26", "27", "28"],
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
              $in: ["33", "34"],
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
              $in: ["33", "34"],
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
    } else if (accesspost == 33 || accesspost == 34) {
      matchData = {
        $and: [
          {
            role: {
              $in: ["35", "36"],
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
    } else if (accesspost == 35 || accesspost == 36) {
      matchData = {
        $and: [
          {
            role: {
              $in: ["37", "38", "39"],
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
          name: 1,
          father_name: 1,
          mobile: 1,
          gender: 1,
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

    if (!user) {
      return next(new creatError("User not Found!", 404));
    }

    res.status(200).json({
      success: true,
      status: "success",
      message: "Data Found successfull",
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
    const {
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
    if (booth > 0 || block > 0 || vidhansabha > 0 || jila > 0 || loksabha > 0) {
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
              $in: ["29", "30", "31", "32"],
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
    } else if (
      accesspost == 25 ||
      accesspost == 26 ||
      accesspost == 27 ||
      accesspost == 28 ||
      accesspost == 29 ||
      accesspost == 30 ||
      accesspost == 31 ||
      accesspost == 32 ||
      accesspost == 33 ||
      accesspost == 34 ||
      accesspost == 35 ||
      accesspost == 36
    ) {
      res.status(200).json({
        success: true,
        status: "success",
        message: "not Data Found successfull",
        user: user,
      });
      return;
    } else if (accesspost == 4) {
      matchData = {
        $and: [
          {
            role: {
              $in: ["21", "22", "23", "24"],
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
      accesspost == 9
    ) {
      matchData = {
        $and: [
          {
            role: {
              $in: ["21", "22", "23", "24"],
            },
          },
          {
            status: "0",
          },
        ],
      };
    }
    // pradesh id
    else if (
      accesspost == 10 ||
      accesspost == 11 ||
      accesspost == 12 ||
      accesspost == 13
    ) {
      matchData = {
        $and: [
          {
            role: {
              $in: ["21", "22", "23", "24"],
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
              $in: ["29", "30", "31", "32"],
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
    } else if (
      accesspost == 21 ||
      accesspost == 22 ||
      accesspost == 23 ||
      accesspost == 24
    ) {
      matchData = {
        $and: [
          {
            role: {
              $in: ["29", "30", "31", "32"],
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
          name: 1,
          father_name: 1,
          mobile: 1,
          gender: 1,
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
