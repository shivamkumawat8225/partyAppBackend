const User = require("../models/userModel");
const creatError = require("../utils/appError");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");

exports.users = async (req, res, next) => {
  try {
    var user = [];
    var counts = 0;
    var matchData = {};
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

    console.log(accesspost);
    console.log(accessstate);
    const array = accessstate;
    console.log(array);
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
              $in: ["10", "11", "12", "13", "14"],
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
          // { loksabhaid: { $lte: "0" } },
          // { jilaid: { $lte: "0" } },
          // { vidhansabhaid: { $lte: "0" } },
          // { blockid: { $lte: "0" } },
          // { boothid: { $lte: "0" } },
        ],
      };
    }

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
              $in: ["10", "11", "12", "13", "14"],
            },
          },
          // { loksabhaid: { $lte: "0" } },
          // { jilaid: { $lte: "0" } },
          // { vidhansabhaid: { $lte: "0" } },
          // { blockid: { $lte: "0" } },
          // { boothid: { $lte: "0" } },
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

    res.status(201).json({
      status: "success",
      message: "Data Found successfull",
      imgUrl: imgUrl,
      user: user,
    });
  } catch (error) {
    next(error);
  }
};
