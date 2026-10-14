const UserRole = require("../../models/UserroleModel");
const Booth = require("../../models/boothModel");
const Block = require("../../models/blockModel");
const Vidhansabha = require("../../models/vidhansabhaModel");
const Jila = require("../../models/jilaModel");
const Loksabha = require("../../models/loksabhaModel");
const State = require("../../models/stateModel");

const User = require("../../models/userModel");
const Generalnews = require("../../models/generalnewsModel");
const creatError = require("../../utils/appError");
const user = require("../../routes/exportdataRoute");
const mongoose = require("mongoose");
const { admin, sendNotifacation } = require("../../firebaseConfig");
// const { generalnewspush } = require("./pushNotifications/generalnews");
const { getUsersTokenRoleIdByType } = require("./Basics/commonController");
// const Surveyquestion = require("../../models/surveyquestionModel");
async function mobilenumber_details(username, lang) {
  const users = await User.aggregate([
    {
      $match: { mobile: username },
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
              role_type: 1,
              level: 1,
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
        role: 1,
        stateid: 1,
        loksabhaid: 1,
        vidhansabhaid: 1,
        blockid: 1,
        boothid: 1,
        jilaid: 1,
        wardid: 1,
        nikayid: 1,
        postData: 1,
      },
    },
    { $sort: { _id: -1 } },
    { $skip: 0 },
    { $limit: 1 },
  ]);
  return users;
}
exports.addnews = async (req, res, next) => {
  try {
    var newid = 1;
    var {
      boothid,
      zoneid,
      sectorid,
      blockid,
      vidhansabhaid,
      loksabhaid,
      jilaid,
      stateid,
      wardid,
      nikayid,
      step6_ver,
      step5_ver,
      step4_ver,
      step3_ver,
      step2_ver,
      step1_ver,
    } = 0;
    const users = await mobilenumber_details(req.body.username, req.body.lang);
    if (!users) {
      return next(new creatError("users not exists", 400));
    }
    const level = users[0].postData[0].level;
    const oldid = await Generalnews.find().sort({ id: -1 }).limit(1);
    if (oldid.length > 0) {
      newid = oldid[0].id + 1;
      // console.log("old id", oldid);
    }
    var matchdata = {};
    var notification = {
      body: req.body.title,
      title: "Recently added new General news",
    };

    var notificationdata = {
      module: "generalnews",
      path: "generalnews",
      type: "new", //new ,approve
    };
    var newtokendata = [];
    //level managed
    console.log("user level is", level);
    if (level === "state") {
      step6_ver = "1";
      stateid = users[0].stateid;
      newtokendata = await getUsersTokenRoleIdByType(
        "national",
        [1],
        notification,
        notificationdata
      );
    }
    if (level === "jila") {
      step5_ver = "1";
      stateid = users[0].stateid;
      jilaid = users[0].jilaid;
      newtokendata = await getUsersTokenRoleIdByType(
        "state",
        users[0].stateid,
        notification,
        notificationdata
      );
    }
    if (level === "loksabha") {
      step5_ver = "1";
      stateid = users[0].stateid;
      loksabhaid = users[0].loksabhaid;
      newtokendata = await getUsersTokenRoleIdByType(
        "state",
        users[0].stateid,
        notification,
        notificationdata
      );
    }
    if (level === "nikay") {
      step1_ver = "1";
      stateid = users[0].stateid;
      jilaid = users[0].jilaid;
      nikayid = users[0].nikayid;
      newtokendata = await getUsersTokenRoleIdByType(
        "jila",
        users[0].jilaid,
        notification,
        notificationdata
      );
    }
    if (level === "vidhansabha") {
      step4_ver = "1";
      stateid = users[0].stateid;
      loksabhaid = users[0].loksabhaid;
      vidhansabhaid = users[0].vidhansabhaid;
      jilaid = users[0].jilaid;
      newtokendata = await getUsersTokenRoleIdByType(
        "loksabha",
        users[0].loksabhaid,
        notification,
        notificationdata
      );
    }
    if (level === "block") {
      step3_ver = "1";
      stateid = users[0].stateid;
      loksabhaid = users[0].loksabhaid;
      vidhansabhaid = users[0].vidhansabhaid;
      blockid = users[0].blockid;
      jilaid = users[0].jilaid;
      newtokendata = await getUsersTokenRoleIdByType(
        "vidhansabha",
        users[0].vidhansabhaid,
        notification,
        notificationdata
      );
    }
    if (level === "zone") {
      step2_ver = "1";
      stateid = users[0].stateid;
      loksabhaid = users[0].loksabhaid;
      vidhansabhaid = users[0].vidhansabhaid;
      blockid = users[0].blockid;
      zoneid = users[0].zoneid;
      jilaid = users[0].jilaid;
      newtokendata = await getUsersTokenRoleIdByType(
        "block",
        users[0].blockid,
        notification,
        notificationdata
      );
    }
    if (level === "sector") {
      step1_ver = "1";
      stateid = users[0].stateid;
      loksabhaid = users[0].loksabhaid;
      vidhansabhaid = users[0].vidhansabhaid;
      blockid = users[0].blockid;
      zoneid = users[0].zoneid;
      sectorid = users[0].sectorid;
      jilaid = users[0].jilaid;
      newtokendata = await getUsersTokenRoleIdByType(
        "zone",
        users[0].zoneid,
        notification,
        notificationdata
      );
    }
    if (level === "booth") {
      stateid = users[0].stateid;
      loksabhaid = users[0].loksabhaid;
      jilaid = users[0].jilaid;
      vidhansabhaid = users[0].vidhansabhaid;
      blockid = users[0].blockid;
      zoneid = users[0].zoneid;
      sectorid = users[0].sectorid;
      boothid = users[0].boothid;
      newtokendata = await getUsersTokenRoleIdByType(
        "sector",
        users[0].sectorid,
        notification,
        notificationdata
      );
    }
    if (level === "ward") {
      stateid = users[0].stateid;
      jilaid = users[0].jilaid;
      wardid = users[0].wardid;
      nikayid = users[0].nikayid;


      newtokendata = await getUsersTokenRoleIdByType(
        "nigam",
        users[0].nikayid,
        notification,
        notificationdata
      );
    }

    // console.log(booths);
    // console.log(req.body.boothid);
    var webId = newid;

    const newdata = {
      id: webId,
      userId: users[0]._id,
      title: req.body.title,
      desc: req.body.desc,
      attechment_type: req.body.attechment_type,
      attechment_link: req.body.attechment_link,

      stateid: stateid,
      jilaid: jilaid,
      loksabhaid: loksabhaid,
      vidhansabhaid: vidhansabhaid,
      blockid: blockid,
      zoneid: zoneid,
      sectorid: sectorid,
      boothid: boothid,
      wardid: wardid,
      nikayid: nikayid,

      step6_approved: step6_ver,
      step5_approved: step5_ver,
      step4_approved: step4_ver,
      step3_approved: step3_ver,
      step2_approved: step2_ver,
      step1_approved: step1_ver,
      entrydatetime: new Date(),
    };
    var newSurvey = [];
    newSurvey = await Generalnews.create(newdata);

    if (newSurvey._id != "") {
      generalnewspush({ id: newSurvey._id, type: "generalnews" });
      res.status(201).json({
        success: true,
        status: "success",
        message: "General News Add successful",
      });
    } else {
      res.status(200).json({
        success: false,
        status: "unsuccess",
        message: "Data Not Sync successful",
      });
    }
  } catch (error) {
    next(error);
  }
};
exports.getnews = async (req, res, next) => {
  try {
    var fam_data = [];
    var user = [];
    var que = [];
    var counts = 0;
    var {
      username,
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
      category,
      datatype,
      limit,
      skip,
      webId,
    } = req.body;
    nikay = parseInt(nikay);
    ward = parseInt(ward);
    block = parseInt(block);
    zone = parseInt(zone);
    sector = parseInt(sector);
    vidhansabha = parseInt(vidhansabha);
    loksabha = parseInt(loksabha);
    jila = parseInt(jila);
    stateid = parseInt(stateid);
    booth = parseInt(booth);
    const users = await mobilenumber_details(username, lang);
    if (!users) {
      return next(new creatError("users not exists", 400));
    }
    var lang1 = lang;
    // console.log(users[0]);
    if (lang == "hi") {
      lang1 = "hindi";
    }
    const level = users[0].postData[0].level;
    let webIdnew = parseInt(webId);
    // console.log("fam", webId);
    var matchData = {};
    if (webId != null && webId != "" && webIdnew != 0) {
      console.log("Survey data");
    } else {
      if (ward > 0) {
        if (category == "approved") {
          matchData = {
            $and: [
              {
                wardid: ward,
              },
              {
                step1_approved: 1,
              },
            ],
          };
        } else {
          matchData = {
            $and: [
              {
                wardid: ward,
              },
              {
                step1_approved: 0,
              },
            ],
          };
        }
      } else if (nikay > 0) {
        if (category == "approved") {
          matchData = {
            $and: [
              {
                nikayid: nikay,
              },
              {
                step1_approved: 1,
              },
            ],
          };
        } else {
          matchData = {
            $and: [
              {
                nikayid: nikay,
              },
              {
                step1_approved: 0,
              },
            ],
          };
        }
      } else if (booth > 0) {
        if (category == "approved") {
          matchData = {
            $and: [
              {
                boothid: booth,
              },
              {
                step1_approved: 1,
              },
            ],
          };
        } else {
          matchData = {
            $and: [
              {
                boothid: booth,
              },
              {
                step1_approved: 0,
              },
            ],
          };
        }
      } else if (sector > 0) {
        if (category == "approved") {
          matchData = {
            $and: [
              {
                sectorid: sector,
              },
              {
                step1_approved: 1,
              },
            ],
          };
        } else {
          matchData = {
            $and: [
              {
                sectorid: sector,
              },
              {
                step1_approved: 0,
              },
            ],
          };
        }
      } else if (zone > 0) {
        if (category == "approved") {
          matchData = {
            $and: [
              {
                zoneid: zone,
              },
              {
                step2_approved: 1,
              },
            ],
          };
        } else {
          matchData = {
            $and: [
              {
                zoneid: zone,
              },
              {
                step1_approved: 1,
              },
              {
                step2_approved: 0,
              },
            ],
          };
        }
      } else if (block > 0) {
        if (category == "approved") {
          matchData = {
            $and: [
              {
                blockid: block,
              },
              {
                step3_approved: 1,
              },
            ],
          };
        } else {
          matchData = {
            $and: [
              {
                blockid: block,
              },
              {
                step2_approved: 1,
              },
              {
                step3_approved: 0,
              },
            ],
          };
        }
      } else if (vidhansabha > 0) {
        if (category == "approved") {
          matchData = {
            $and: [
              {
                vidhansabhaid: vidhansabha,
              },
              {
                step4_approved: 1,
              },
            ],
          };
        } else {
          matchData = {
            $and: [
              {
                vidhansabhaid: vidhansabha,
              },
              {
                step3_approved: 1,
              },
              {
                step4_approved: 0,
              },
            ],
          };
        }
      } else if (loksabha > 0) {
        if (category == "approved") {
          matchData = {
            $and: [
              {
                loksabhaid: loksabha,
              },
              {
                step5_approved: 1,
              },
            ],
          };
        } else {
          matchData = {
            $and: [
              {
                loksabhaid: loksabha,
              },
              {
                step4_approved: 1,
              },
              {
                step5_approved: 0,
              },
            ],
          };
        }
      } else if (jila > 0) {
        if (category == "approved") {
          matchData = {
            $and: [
              {
                jilaid: jila,
              },
              {
                step5_approved: 1,
              },
            ],
          };
        } else {
          matchData = {
            $and: [
              {
                jilaid: jila,
              },
              {
                step4_approved: 1,
              },
              {
                step5_approved: 0,
              },
            ],
          };
        }
      } else if (stateid > 0) {
        if (category == "approved") {
          matchData = {
            $and: [
              {
                stateid: stateid,
              },
              {
                step6_approved: 1,
              },
              // {
              //   status: "0",
              // },
            ],
          };
        } else {
          matchData = {
            $and: [
              {
                stateid: stateid,
              },
              {
                step5_approved: 1,
              },
              {
                step6_approved: 0,
              },
            ],
          };
        }
      } else if (level === "national") {
        matchData = {
          $and: [
            {
              step6_approved: 1,
            },
          ],
        };
      } else if (level === "state") {
        if (category == "approved") {
          matchData = {
            $and: [
              {
                stateid: { $in: users[0].stateid },
              },
              {
                step6_approved: 1,
              },
              // {
              //   status: "0",
              // },
            ],
          };
        } else {
          matchData = {
            $and: [
              {
                stateid: { $in: users[0].stateid },
              },
              {
                step5_approved: 1,
              },
              {
                step6_approved: 0,
              },
              // {
              //   status: "0",
              // },
            ],
          };
        }
      } else if (level === "jila") {
        if (category == "approved") {
          matchData = {
            $and: [
              {
                jilaid: { $in: users[0].jilaid },
              },
              {
                step5_approved: 1,
              },
            ],
          };
        } else {
          matchData = {
            $and: [
              {
                jilaid: { $in: users[0].jilaid },
              },
              {
                step4_approved: 1,
              },
              {
                step5_approved: 0,
              },
            ],
          };
        }
      } else if (level === "loksabha") {
        if (category == "approved") {
          matchData = {
            $and: [
              {
                loksabhaid: { $in: users[0].loksabhaid },
              },
              {
                step5_approved: 1,
              },
            ],
          };
        } else {
          matchData = {
            $and: [
              {
                loksabhaid: { $in: users[0].loksabhaid },
              },
              {
                step4_approved: 1,
              },
              {
                step5_approved: 0,
              },
            ],
          };
        }
      } else if (level === "nikay") {
        if (category == "approved") {
          matchData = {
            $and: [
              {
                nikayid: { $in: users[0].nikayid },
              },
              {
                step1_approved: 1,
              },
            ],
          };
        } else {
          matchData = {
            $and: [
              {
                nikayid: { $in: users[0].nikayid },
              },
              {
                step1_approved: 0,
              },
            ],
          };
        }
      } else if (level === "vidhansabha") {
        if (category == "approved") {
          matchData = {
            $and: [
              {
                vidhansabhaid: { $in: users[0].vidhansabhaid },
              },
              {
                step4_approved: 1,
              },
            ],
          };
        } else {
          matchData = {
            $and: [
              {
                vidhansabhaid: { $in: users[0].vidhansabhaid },
              },
              {
                step3_approved: 1,
              },
              {
                step4_approved: 0,
              },
            ],
          };
        }
      } else if (level === "block") {
        if (category == "approved") {
          matchData = {
            $and: [
              {
                blockid: { $in: users[0].blockid },
              },
              {
                step3_approved: 1,
              },
            ],
          };
        } else {
          matchData = {
            $and: [
              {
                blockid: { $in: users[0].blockid },
              },
              {
                step2_approved: 1,
              },
              {
                step3_approved: 0,
              },
            ],
          };
        }
      } else if (level === "zone") {
        if (category == "approved") {
          matchData = {
            $and: [
              {
                zoneid: { $in: users[0].zoneid },
              },
              {
                step2_approved: 1,
              },
            ],
          };
        } else {
          matchData = {
            $and: [
              {
                zoneid: { $in: users[0].zoneid },
              },
              {
                step1_approved: 1,
              },
              {
                step2_approved: 0,
              },
            ],
          };
        }
      } else if (level === "sector") {
        if (category == "approved") {
          matchData = {
            $and: [
              {
                sectorid: { $in: users[0].sectorid },
              },
              {
                step1_approved: 1,
              },
            ],
          };
        } else {
          matchData = {
            $and: [
              {
                sectorid: { $in: users[0].sectorid },
              },
              {
                step1_approved: 0,
              },
            ],
          };
        }
      } else if (level === "booth") {
        if (category == "approved") {
          matchData = {
            $and: [
              {
                boothid: { $in: users[0].boothid },
              },
              {
                userId: users[0]._id.toString(),
              },
              {
                step1_approved: 1,
              },
            ],
          };
        } else {
          matchData = {
            $and: [
              {
                boothid: { $in: users[0].boothid },
              },
              {
                userId: users[0]._id.toString(),
              },
              {
                step1_approved: 0,
              },
            ],
          };
        }
      } else if (level === "ward") {
        if (category == "approved") {
          matchData = {
            $and: [
              {
                wardid: { $in: users[0].wardid },
              },
              {
                userId: users[0]._id.toString(),
              },
              {
                step1_approved: 1,
              },
            ],
          };
        } else {
          matchData = {
            $and: [
              {
                wardid: { $in: users[0].wardid },
              },
              {
                userId: users[0]._id.toString(),
              },
              {
                step1_approved: 0,
              },
            ],
          };
        }
      }
      console.log(matchData);

      counts = await Generalnews.countDocuments(matchData);
      user = await Generalnews.aggregate([
        {
          $match: matchData,
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
          $lookup: {
            from: "users",
            let: {
              aId: { $toObjectId: "$userId" },
              aUserId: "$userId",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [{ $eq: ["$_id", "$$aId"] }],
                  },
                },
              },
              {
                $project: {
                  _id: 0,
                  WebId: "$_id",
                  name: 1,
                  father_name: 1,
                  role: 1,
                  mobile: 1,
                  image: 1,
                },
              },
            ],
            as: "collectionBDatausers",
          },
        },
        {
          $project: {
            comment1: "$step1_comment",
            comment2: "$step2_comment",
            comment3: "$step3_comment",
            comment4: "$step4_comment",
            comment5: "$step5_comment",
            comment6: "$step6_comment",
            WebId: "$_id",
            _id: 1,
            title: 1,
            desc: 1,
            attechment_type: 1,
            attechment_link: 1,
            entrydatetime: {
              $dateToString: { format: "%d-%m-%Y", date: "$entrydatetime" },
            },
            stateData: 1,
            usersData: { $arrayElemAt: ["$collectionBDatausers", 0] },
            loksabhaData: 1,
            jilaData: 1,
            
            vidhansabhaData: 1,
            blockData: 1,
            zoneData: 1,
            sectorData: 1,
            boothData: 1,
            nikayData: 1,
            wardData: 1,
          },
        },
        { $sort: { _id: -1 } },
        { $skip: parseInt(skip) },
        { $limit: parseInt(limit) },
      ]);

      const responseData = () => {
        res.status(200).json({
          status: "success",
          message: "Data Found successful",
          count: counts,
          data: user,
        });
      };
      responseData();
    }
  } catch (error) {
    next(error);
  }
};

//approved proccess
//against level name
exports.approving = async (req, res, next) => {
  try {
    const { WebId, username, level, comment, status } = req.body;
    // const user = await User.findOne({ mobile: username });
    const user = await mobilenumber_details(username, (lang = "hi"));
    if (!user) {
      return next(new creatError("User not Found!", 404));
    }
    console.log("users jila ", user[0].jilaid)
    const newsdata = await Generalnews.find({ _id: WebId });
    if (!newsdata) {
      return next(new creatError("General News not Found!", 404));
    }
    console.log("general news data ", newsdata[0].title);

    const query = { _id: WebId };
    const querys = { _id: new mongoose.Types.ObjectId(WebId) };
    // console.log(user[0]);
    var matchdata = {};
    var notification = {
      body: (newsdata[0].title) + " " + (newsdata[0].desc),
      title: "Recently Approve  General news",
    };

    var notificationdata = {
      module: "generalnews",
      path: "generalnews",
      type: "approve", //new ,approve
    };
    var newtokendata = [];
    var setvalue = {};
    if (level === "state") {
      setvalue = {
        step6_approved: 1,
        step6_comment: comment,
        step6_approved_by: user[0]._id,
      };
      newtokendata = await getUsersTokenRoleIdByType(
        "national",
        [1],
        notification,
        notificationdata
      )
    } else if (level === "jila") {
      setvalue = {
        step5_approved: 1,
        step5_comment: comment,
        step5_approved_by: user[0]._id,
      };
      newtokendata = await getUsersTokenRoleIdByType(
        "state",
        user[0].stateid,
        notification,
        notificationdata
      )
    } else if (level === "nikay") {
      setvalue = {
        step1_approved: 1,
        step1_comment: comment,
        step1_approved_by: user[0]._id,
      };
      newtokendata = await getUsersTokenRoleIdByType(
        "jila",
        user[0].jilaid,
        notification,
        notificationdata
      )
    } else if (level === "loksabha") {
      setvalue = {
        step5_approved: 1,
        step5_comment: comment,
        step5_approved_by: user[0]._id,
      };
      newtokendata = await getUsersTokenRoleIdByType(
        "state",
        user[0].stateid,
        notification,
        notificationdata
      )
    } else if (level === "vidhansabha") {
      setvalue = {
        step4_approved: 1,
        step4_comment: comment,
        step4_approved_by: user[0]._id,
      };
      newtokendata = await getUsersTokenRoleIdByType(
        "loksabha",
        user[0].loksabhaid,
        notification,
        notificationdata
      )
    } else if (level === "block") {
      setvalue = {
        step3_approved: 1,
        step3_comment: comment,
        step3_approved_by: user[0]._id,
      };
      newtokendata = await getUsersTokenRoleIdByType(
        "vidhansabha",
        user[0].vidhansabhaid,
        notification,
        notificationdata
      )
    } else if (level === "zone") {
      setvalue = {
        step2_approved: 1,
        step2_comment: comment,
        step2_approved_by: user[0]._id,
      };
      newtokendata = await getUsersTokenRoleIdByType(
        "block",
        user[0].blockid,
        notification,
        notificationdata
      )
    } else if (level === "sector") {
      setvalue = {
        step1_approved: 1,
        step1_comment: comment,
        step1_approved_by: user[0]._id,
      };
      newtokendata = await getUsersTokenRoleIdByType(
        "zone",
        user[0].zoneid,
        notification,
        notificationdata
      )
    } else {
      return res.status(200).json({
        success: false,
        status: "unsuccess",
        message: "level Not found for Update",
      });
    }
    var update = { $set: setvalue };
    const options = {};
    const result = await Generalnews.updateOne(query, update, options);

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
//against level name
exports.testing = async (req, res, next) => {
  try {
    const topic = "all";

    const registrationTokens = [
      "deLujU8lS2ODlSDRNlM21u:APA91bGZouHKgm0iFU_gS1EdUX0BgcD4QoByTcsdHbrJ-qoKb-xAitZzzrvWH0z-l6-1mI1P25ciSsyN7PwPHrxBSITvB2aIIbStkrnUyxTYwkPJm9HNw1w",
    ];
    const response = await sendNotifacation(
      registrationTokens,
      {
        title: "Add New General news",
        body: "Desc General news by post",
      },
      {
        module: "generalnews",
        path: "generalnews",
        type: "new", //new ,approve
      }
    );

    res.status(200).json({
      success: true,
      status: "success",
      message: "Updateted successful",
    });
  } catch (error) {
    next(error);
  }
};

// add level name like ward name
// nikay name
//  jila name
//
