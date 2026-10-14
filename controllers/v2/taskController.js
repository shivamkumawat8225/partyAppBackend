const UserRole = require("../../models/UserroleModel");
const Booth = require("../../models/boothModel");
const Block = require("../../models/blockModel");
const Vidhansabha = require("../../models/vidhansabhaModel");
const Jila = require("../../models/jilaModel");
const Loksabha = require("../../models/loksabhaModel");
const State = require("../../models/stateModel");

const User = require("../../models/userModel");
const Task = require("../../models/taskModel");
const Taskfeed = require("../../models/taskfeedbackModel");
const creatError = require("../../utils/appError");
const user = require("../../routes/exportdataRoute");
const mongoose = require("mongoose");
const Taskfeedback = require("../../models/taskfeedbackModel");
const { getUsersTokenRoleIdByType, gettaskUsersTokenRoleIdByType } = require("./Basics/commonController");
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
exports.addtask = async (req, res, next) => {
  try {
    var newid = 1;
    var {
      boothid,
      blockid,
      zoneid,
      sectorid,
      vidhansabhaid,
      loksabhaid,
      jilaid,
      stateid,
      wardid,
      nikayid,
    } = 0;
    var {
      state,
      loksabha,
      jila,
      vidhansabha,
      block,
      booth,
      zone,
      sector,
      nikay,
      ward,
      role,
    } = req.body;
    nikay = nikay * 1;
    ward = ward * 1;
    block = block * 1;
    vidhansabha = vidhansabha * 1;
    loksabha = loksabha * 1;
    jila = jila * 1;
    state = state * 1;
    booth = booth * 1;
    zone = zone * 1;
    sector = sector * 1;
    role = role * 1;
    // console.log({
    //   state: state,
    //   loksabha: loksabha,
    //   jila: jila,
    //   vidhansabha: vidhansabha,
    //   block: block,
    //   booth: booth,
    //   nikay: nikay,
    //   ward: ward,
    //   role: role,
    // });
    const users = await mobilenumber_details(req.body.username, req.body.lang);
    if (!users) {
      return next(new creatError("users not exists", 400));
    }
    const level = users[0].postData[0].level;
    // console.log("level", level)
    const oldid = await Task.find().sort({ id: -1 }).limit(1);
    if (oldid.length > 0) {
      newid = oldid[0].id + 1;
      // console.log("old id", oldid);
    }
    var matchadat = {}
    //level managed
    // console.log("user level is", level);
    if (level === "national") {
      stateid = state;
      loksabhaid = loksabha;
      vidhansabhaid = vidhansabha;
      blockid = block;
      boothid = booth;
      zoneid = zone;
      sectorid = sector;
      jilaid = jila;
      nikayid = nikay;
      wardid = ward;
      if (ward > 0) {
        matchadat.wardid = ward
      }
      else if (nikay > 0) {
        matchadat.nikayid = nikay
      }
      else if (booth > 0) {
        matchadat.boothid = booth
      }
      else if (sector > 0) {
        matchadat.sectorid = sector
      }
      else if (zone > 0) {
        matchadat.zoneid = zone
      }
      else if (block > 0) {
        matchadat.blockid = block
      }
      else if (vidhansabha > 0) {
        matchadat.vidhansabhaid = vidhansabha
      }
      else if (jila > 0) {
        matchadat.jilaid = jila
      }
      else if (loksabha > 0) {
        matchadat.loksabhaid = loksabha
      }
      else if (state > 0) {
        matchadat.stateid = state
      }
    }
    if (level === "state") {
      stateid = users[0].stateid;
      loksabhaid = loksabha;
      vidhansabhaid = vidhansabha;
      blockid = block;
      zoneid = zone;
      sectorid = sector;
      boothid = booth;
      jilaid = jila;
      nikayid = nikay;
      wardid = ward;
      if (ward > 0) {
        matchadat.wardid = ward
      }
      else if (nikay > 0) {
        matchadat.nikayid = nikay
      }
      else if (booth > 0) {
        matchadat.boothid = booth
      }
      else if (sector > 0) {
        matchadat.sectorid = sector
      }
      else if (zone > 0) {
        matchadat.zoneid = zone
      }
      else if (block > 0) {
        matchadat.blockid = block
      }
      else if (vidhansabha > 0) {
        matchadat.vidhansabhaid = vidhansabha
      }
      else if (jila > 0) {
        matchadat.jilaid = jila
      }
      else if (loksabha > 0) {
        matchadat.loksabhaid = loksabha
      }
      else {
        matchadat.stateid = {
          $in: stateid,
        }
      }
    }
    if (level === "jila") {
      stateid = users[0].stateid;
      jilaid = users[0].jilaid;

      nikayid = nikay;
      wardid = ward;
      if (ward > 0) {
        matchadat.wardid = ward
      }
      else if (nikay > 0) {
        matchadat.nikayid = nikay
      }
      else if (booth > 0) {
        matchadat.boothid = booth
      }
      else if (sector > 0) {
        matchadat.sectorid = sector
      }
      else if (zone > 0) {
        matchadat.zoneid = zone
      }
      else if (block > 0) {
        matchadat.blockid = block
      }
      else if (vidhansabha > 0) {
        matchadat.vidhansabhaid = vidhansabha
      }
      else if (loksabha > 0) {
        matchadat.loksabhaid = loksabha
      }
      else {
        matchadat.jilaid = {
          $in: jilaid,
        }
      }
    }
    if (level === "loksabha") {
      stateid = users[0].stateid;
      loksabhaid = users[0].loksabhaid;

      vidhansabhaid = vidhansabha;
      blockid = block;
      zoneid = zone;
      sectorid = sector;
      boothid = booth;
      if (ward > 0) {
        matchadat.wardid = ward
      }
      else if (nikay > 0) {
        matchadat.nikayid = nikay
      }
      else if (booth > 0) {
        matchadat.boothid = booth
      }
      else if (sector > 0) {
        matchadat.sectorid = sector
      }
      else if (zone > 0) {
        matchadat.zoneid = zone
      }
      else if (block > 0) {
        matchadat.blockid = block
      }
      else if (vidhansabha > 0) {
        matchadat.vidhansabhaid = vidhansabha
      }
      else {
        matchadat.loksabhaid = {
          $in: loksabhaid,
        }
      }
    }
    if (level === "nigam") {
      stateid = users[0].stateid;
      jilaid = users[0].jilaid;
      nikayid = users[0].nikayid;
      wardid = ward;
      if (ward > 0) {
        matchadat.wardid = ward
      }
      else {
        matchadat.nikayid = {
          $in: nikayid,
        }
      }
    }
    if (level === "vidhansabha") {
      stateid = users[0].stateid;
      loksabhaid = users[0].loksabhaid;
      vidhansabhaid = users[0].vidhansabhaid;
      jilaid = users[0].jilaid;

      blockid = block;
      zoneid = zone;
      sectorid = sector;
      boothid = booth;

      if (booth > 0) {
        matchadat.boothid = booth
      }
      else if (sector > 0) {
        matchadat.sectorid = sector
      }
      else if (zone > 0) {
        matchadat.zoneid = zone
      }
      else if (block > 0) {
        matchadat.blockid = block
      }
      else {
        matchadat.vidhansabhaid = {
          $in: vidhansabhaid,
        }
      }
    }
    if (level === "block") {
      stateid = users[0].stateid;
      loksabhaid = users[0].loksabhaid;
      vidhansabhaid = users[0].vidhansabhaid;
      blockid = users[0].blockid;
      zoneid = zone;
      sectorid = sector;
      jilaid = users[0].jilaid;
      boothid = booth;
      if (booth > 0) {
        matchadat.boothid = booth
      }
      else if (sector > 0) {
        matchadat.sectorid = sector
      }
      else if (zone > 0) {
        matchadat.zoneid = zone
      }
      else {
        matchadat.blockid = {
          $in: blockid,
        }
      }
    }

    if (level === "zone") {
      stateid = users[0].stateid;
      loksabhaid = users[0].loksabhaid;
      vidhansabhaid = users[0].vidhansabhaid;
      blockid = users[0].blockid;
      zoneid = users[0].zoneid;
      sectorid = sector;
      jilaid = users[0].jilaid;
      boothid = booth;
      if (booth > 0) {
        matchadat.boothid = booth
      }
      else if (sector > 0) {
        matchadat.sectorid = sector
      }
      else {
        matchadat.zoneid = {
          $in: zoneid,
        }
      }
    }
    if (level === "sector") {
      stateid = users[0].stateid;
      loksabhaid = users[0].loksabhaid;
      vidhansabhaid = users[0].vidhansabhaid;
      blockid = users[0].blockid;
      zoneid = users[0].zone;
      sectorid = users[0].sector;
      jilaid = users[0].jilaid;
      boothid = booth;
      if (booth > 0) {
        matchadat.boothid = booth
      }
      else {
        matchadat.sectorid = {
          $in: sectorid,
        }
      }
    }
    if (role > 0) {
      matchadat.role = role
    }
    var matchdata = {};
    var notification = {
      body: (req.body.title) + " " + (req.body.title),
      title: "Recently Add New Task",
    };

    var notificationdata = {
      module: "task",
      path: "task",
      type: "new", //new ,approve
    };
    // console.log("matchadat ", matchadat)
    var newtokendata = [];
    newtokendata = await gettaskUsersTokenRoleIdByType(
      matchadat,
      notification,
      notificationdata
    )

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
      role: role,

      entrydatetime: new Date(),
    };
    var newSurvey = [];
    newSurvey = await Task.create(newdata);

    if (newSurvey._id != "") {
      res.status(201).json({
        success: true,
        status: "success",
        message: "Task Add successful",
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
exports.gettask = async (req, res, next) => {
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
      zone,
      sector,
      booth,
      nikay,
      ward,
      app_type,
      category,
      datatype,
      limit,
      skip,
      webId,
      taskid,
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
    const users = await mobilenumber_details(username, lang);
    const userID = users[0]._id;
    if (!users) {
      return next(new creatError("users not exists", 400));
    }
    // console.log(users[0]);
    if (lang == "hi") {
      lang1 = "hindi";
    }
    const level = users[0].postData[0].level;
    const userroleid = users[0].postData[0].id;

    // console.log("fam", users[0]);
    if (taskid != null && taskid != "" && taskid != 0) {
      // console.log("Task data with full detail");
      matchData = {
        _id: new mongoose.Types.ObjectId(taskid),
      };
      counts = await Taskfeedback.countDocuments({ taskId: taskid });

      user = await Task.aggregate([
        {
          $match: matchData,
        },

        {
          $project: {
            _id: 1,
            title: 1,
            // userId: 1,
            attechment_type: 1,
            attechment_link: 1,
            entrydatetime: {
              $dateToString: {
                format: "%d-%m-%Y",
                date: "$entrydatetime",
              },
            },
            // commentId: 1,
            // collectionBData: 1,
          },
        },
      ]);
      var feeduser = [];

      feeduser = await Taskfeed.aggregate([
        {
          $match: { taskId: taskid },
        },

        {
          $lookup: {
            from: "users",
            let: {
              aId: { $toObjectId: "$userId" },
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
            _id: 0,
            WebId: "$_id",
            feedback: 1,
            attechment_type: 1,
            attechment_link: 1,
            entrydatetime: {
              $dateToString: {
                format: "%d-%m-%Y",
                date: "$entrydatetime",
              },
            },
            usersData: { $arrayElemAt: ["$collectionBDatausers", 0] },
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
          task: user,
          data: feeduser,
        });
      };
      responseData();
    } else {
      if (category == "all") {
        if (level === "national") {
          matchData = {};
        }
        if (level === "state") {
          matchData = {
            stateid: {
              $in: users[0].stateid,
            },
          };
        }
        if (level === "jila") {
          matchData = {
            jilaid: {
              $in: users[0].jilaid,
            },
          };
        }
        if (level === "loksabha") {
          matchData = {
            loksabhaid: {
              $in: users[0].loksabhaid,
            },
          };
        }
        if (level === "nikay") {
          matchData = {
            nikayid: {
              $in: users[0].nikayid,
            },
          };
        }
        if (level === "vidhansabha") {
          matchData = {
            vidhansabhaid: {
              $in: users[0].vidhansabhaid,
            },
          };
        }
        if (level === "block") {
          matchData = {
            blockid: {
              $in: users[0].blockid,
            },
          };
        }
        if (level === "zone") {
          matchData = {
            zoneid: {
              $in: users[0].zoneid,
            },
          };
        }
        if (level === "sector") {
          matchData = {
            sectorid: {
              $in: users[0].sectorid,
            },
          };
        }
        if (level === "booth" || level === "ward") {
          res.status(200).json({
            status: "unsuccess",
            message: "Sorry ! this users not access to all Task",
            count: counts,
            data: user,
          });
          return;
        }
      } else if (category == "my_task") {
        if (level === "booth" || level === "ward") {
          res.status(200).json({
            status: "unsuccess",
            message: "Sorry ! this users not access to all Task",
            count: counts,
            data: user,
          });
          return;
        }
        matchData = {
          userId: userID.toString(),
        };
      } else {
        if (level === "national") {
          matchData = {
            $and: [
              {
                $or: [
                  {
                    role: userroleid,
                  },
                  {
                    role: 0,
                  },
                ],
              },
              {
                $and: [
                  {
                    wardid: 0,
                    nikayid: 0,
                    jilaid: 0,
                    loksabhaid: 0,
                    vidhansabhaid: 0,
                    blockid: 0,
                    zoneid: 0,
                    sectorid: 0,
                    boothid: 0,
                    stateid: 0,
                  },
                ],
              },
            ],
          };
        } else if (level === "state") {
          matchData = {
            $and: [
              {
                $or: [
                  {
                    role: userroleid,
                  },
                  {
                    role: 0,
                  },
                ],
              },
              {
                $and: [
                  {
                    $or: [
                      {
                        stateid: { $in: users[0].stateid },
                      },
                      {
                        stateid: 0,
                      },
                    ],
                  },
                  {
                    wardid: 0,
                    nikayid: 0,
                    jilaid: 0,
                    loksabhaid: 0,
                    vidhansabhaid: 0,
                    blockid: 0,
                    zoneid: 0,
                    sectorid: 0,
                    boothid: 0,
                  },
                ],
              },
            ],
          };
        } else if (level === "ward") {
          matchData = {
            $and: [
              {
                $or: [
                  {
                    role: userroleid,
                  },
                  {
                    role: 0,
                  },
                ],
              },
              {
                $and: [
                  {
                    $or: [
                      {
                        wardid: { $in: users[0].wardid },
                      },
                      {
                        // wardid: { ne: 0 },
                        wardid: 0,
                      },
                    ],
                  },
                  {
                    $or: [
                      {
                        nikayid: { $in: users[0].nikayid },
                      },
                      {
                        nikayid: 0,
                      },
                    ],
                  },
                  {
                    $or: [
                      {
                        jilaid: { $in: users[0].jilaid },
                      },
                      {
                        jilaid: 0,
                      },
                    ],
                  },
                  {
                    $or: [
                      {
                        stateid: { $in: users[0].stateid },
                      },
                      {
                        stateid: 0,
                      },
                    ],
                  },
                  {
                    // wardid: 0,
                    loksabhaid: 0,
                    vidhansabhaid: 0,
                    blockid: 0,
                    zoneid: 0,
                    sectorid: 0,
                    boothid: 0,
                  },
                ],
              },
            ],
          };
        } else if (level === "nikay") {
          matchData = {
            $and: [
              {
                $or: [
                  {
                    role: userroleid,
                  },
                  {
                    role: 0,
                  },
                ],
              },
              {
                $and: [
                  {
                    $or: [
                      {
                        nikayid: { $in: users[0].nikayid },
                      },
                      {
                        nikayid: 0,
                      },
                    ],
                  },
                  {
                    $or: [
                      {
                        jilaid: { $in: users[0].jilaid },
                      },
                      {
                        jilaid: 0,
                      },
                    ],
                  },
                  {
                    $or: [
                      {
                        stateid: { $in: users[0].stateid },
                      },
                      {
                        stateid: 0,
                      },
                    ],
                  },
                  {
                    wardid: 0,
                    loksabhaid: 0,
                    vidhansabhaid: 0,
                    blockid: 0,
                    zoneid: 0,
                    sectorid: 0,
                    boothid: 0,
                  },
                ],
              },
            ],
          };
        } else if (level === "jila") {
          matchData = {
            $and: [
              {
                $or: [
                  {
                    role: userroleid,
                  },
                  {
                    role: 0,
                  },
                ],
              },
              {
                $and: [
                  {
                    $or: [
                      {
                        jilaid: { $in: users[0].jilaid },
                      },
                      {
                        jilaid: 0,
                      },
                    ],
                  },
                  {
                    $or: [
                      {
                        stateid: { $in: users[0].stateid },
                      },
                      {
                        stateid: 0,
                      },
                    ],
                  },
                  {
                    wardid: 0,
                    nikayid: 0,
                    loksabhaid: 0,
                    vidhansabhaid: 0,
                    blockid: 0,
                    zoneid: 0,
                    sectorid: 0,
                    boothid: 0,
                  },
                ],
              },
            ],
          };
        } else if (level === "booth") {
          matchData = {
            $and: [
              {
                $or: [
                  {
                    role: userroleid,
                  },
                  {
                    role: 0,
                  },
                ],
              },
              {
                $and: [
                  {
                    $or: [
                      {
                        boothid: { $in: users[0].boothid },
                      },
                      {
                        // boothid: { ne: 0 },
                        boothid: 0,
                      },
                    ],
                  },
                  {
                    $or: [
                      {
                        sectorid: { $in: users[0].sectorid },
                      },
                      {
                        sectorid: 0,
                      },
                    ],
                  },
                  {
                    $or: [
                      {
                        zoneid: { $in: users[0].zoneid },
                      },
                      {
                        zoneid: 0,
                      },
                    ],
                  },
                  {
                    $or: [
                      {
                        blockid: { $in: users[0].blockid },
                      },
                      {
                        blockid: 0,
                      },
                    ],
                  },
                  {
                    $or: [
                      {
                        vidhansabhaid: { $in: users[0].vidhansabhaid },
                      },
                      {
                        vidhansabhaid: 0,
                      },
                    ],
                  },
                  {
                    $or: [
                      {
                        loksabhaid: { $in: users[0].loksabhaid },
                      },
                      {
                        loksabhaid: 0,
                      },
                    ],
                  },
                  // {
                  //   $or: [
                  //     {
                  //       jilaid: { $in: users[0].jilaid },
                  //     },
                  //     {
                  //       jilaid: 0,
                  //     },
                  //   ],
                  // },
                  {
                    $or: [
                      {
                        stateid: { $in: users[0].stateid },
                      },
                      {
                        stateid: 0,
                      },
                    ],
                  },
                  {
                    wardid: 0,
                    nikayid: 0,
                    jilaid: 0,

                    // loksabhaid: 0,
                    // vidhansabhaid: 0,
                    // blockid: 0,
                    // zoneid: 0,
                    // sectorid: 0,
                    // boothid: 0,
                  },
                ],
              },
            ],
          };
        } else if (level === "sector") {
          matchData = {
            $and: [
              {
                $or: [
                  {
                    role: userroleid,
                  },
                  {
                    role: 0,
                  },
                ],
              },
              {
                $and: [
                  {
                    $or: [
                      {
                        sectorid: { $in: users[0].sectorid },
                      },
                      {
                        sectorid: 0,
                      },
                    ],
                  },
                  {
                    $or: [
                      {
                        zoneid: { $in: users[0].zoneid },
                      },
                      {
                        zoneid: 0,
                      },
                    ],
                  },
                  {
                    $or: [
                      {
                        blockid: { $in: users[0].blockid },
                      },
                      {
                        blockid: 0,
                      },
                    ],
                  },
                  {
                    $or: [
                      {
                        vidhansabhaid: { $in: users[0].vidhansabhaid },
                      },
                      {
                        vidhansabhaid: 0,
                      },
                    ],
                  },
                  {
                    $or: [
                      {
                        loksabhaid: { $in: users[0].loksabhaid },
                      },
                      {
                        loksabhaid: 0,
                      },
                    ],
                  },
                  // {
                  //   $or: [
                  //     {
                  //       jilaid: { $in: users[0].jilaid },
                  //     },
                  //     {
                  //       jilaid: 0,
                  //     },
                  //   ],
                  // },
                  {
                    $or: [
                      {
                        stateid: { $in: users[0].stateid },
                      },
                      {
                        stateid: 0,
                      },
                    ],
                  },
                  {
                    wardid: 0,
                    nikayid: 0,
                    jilaid: 0,

                    // loksabhaid: 0,
                    // vidhansabhaid: 0,
                    // blockid: 0,
                    // zoneid: 0,
                    // sectorid: 0,
                    boothid: 0,
                  },
                ],
              },
            ],
          };
        } else if (level === "zone") {
          matchData = {
            $and: [
              {
                $or: [
                  {
                    role: userroleid,
                  },
                  {
                    role: 0,
                  },
                ],
              },
              {
                $and: [
                  {
                    $or: [
                      {
                        zoneid: { $in: users[0].zoneid },
                      },
                      {
                        zoneid: 0,
                      },
                    ],
                  },
                  {
                    $or: [
                      {
                        blockid: { $in: users[0].blockid },
                      },
                      {
                        blockid: 0,
                      },
                    ],
                  },
                  {
                    $or: [
                      {
                        vidhansabhaid: { $in: users[0].vidhansabhaid },
                      },
                      {
                        vidhansabhaid: 0,
                      },
                    ],
                  },
                  {
                    $or: [
                      {
                        loksabhaid: { $in: users[0].loksabhaid },
                      },
                      {
                        loksabhaid: 0,
                      },
                    ],
                  },
                  // {
                  //   $or: [
                  //     {
                  //       jilaid: { $in: users[0].jilaid },
                  //     },
                  //     {
                  //       jilaid: 0,
                  //     },
                  //   ],
                  // },
                  {
                    $or: [
                      {
                        stateid: { $in: users[0].stateid },
                      },
                      {
                        stateid: 0,
                      },
                    ],
                  },
                  {
                    wardid: 0,
                    nikayid: 0,
                    jilaid: 0,

                    // loksabhaid: 0,
                    // vidhansabhaid: 0,
                    // blockid: 0,
                    // zoneid: 0,
                    sectorid: 0,
                    boothid: 0,
                  },
                ],
              },
            ],
          };
        } else if (level === "block") {
          matchData = {
            $and: [
              {
                $or: [
                  {
                    role: userroleid,
                  },
                  {
                    role: 0,
                  },
                ],
              },
              {
                $and: [
                  {
                    $or: [
                      {
                        blockid: { $in: users[0].blockid },
                      },
                      {
                        blockid: 0,
                      },
                    ],
                  },
                  {
                    $or: [
                      {
                        vidhansabhaid: { $in: users[0].vidhansabhaid },
                      },
                      {
                        vidhansabhaid: 0,
                      },
                    ],
                  },
                  {
                    $or: [
                      {
                        loksabhaid: { $in: users[0].loksabhaid },
                      },
                      {
                        loksabhaid: 0,
                      },
                    ],
                  },
                  // {
                  //   $or: [
                  //     {
                  //       jilaid: { $in: users[0].jilaid },
                  //     },
                  //     {
                  //       jilaid: 0,
                  //     },
                  //   ],
                  // },
                  {
                    $or: [
                      {
                        stateid: { $in: users[0].stateid },
                      },
                      {
                        stateid: 0,
                      },
                    ],
                  },
                  {
                    wardid: 0,
                    nikayid: 0,
                    jilaid: 0,

                    // loksabhaid: 0,
                    // vidhansabhaid: 0,
                    // blockid: 0,
                    zoneid: 0,
                    sectorid: 0,
                    boothid: 0,
                  },
                ],
              },
            ],
          };
        } else if (level === "vidhansabha") {
          matchData = {
            $and: [
              {
                $or: [
                  {
                    role: userroleid,
                  },
                  {
                    role: 0,
                  },
                ],
              },
              {
                $and: [
                  {
                    $or: [
                      {
                        vidhansabhaid: { $in: users[0].vidhansabhaid },
                      },
                      {
                        vidhansabhaid: 0,
                      },
                    ],
                  },
                  {
                    $or: [
                      {
                        loksabhaid: { $in: users[0].loksabhaid },
                      },
                      {
                        loksabhaid: 0,
                      },
                    ],
                  },
                  // {
                  //   $or: [
                  //     {
                  //       jilaid: { $in: users[0].jilaid },
                  //     },
                  //     {
                  //       jilaid: 0,
                  //     },
                  //   ],
                  // },
                  {
                    $or: [
                      {
                        stateid: { $in: users[0].stateid },
                      },
                      {
                        stateid: 0,
                      },
                    ],
                  },
                  {
                    wardid: 0,
                    nikayid: 0,
                    jilaid: 0,

                    // loksabhaid: 0,
                    // vidhansabhaid: 0,
                    blockid: 0,
                    zoneid: 0,
                    sectorid: 0,
                    boothid: 0,
                  },
                ],
              },
            ],
          };
        } else if (level === "loksabha") {
          matchData = {
            $and: [
              {
                $or: [
                  {
                    role: userroleid,
                  },
                  {
                    role: 0,
                  },
                ],
              },
              {
                $and: [
                  {
                    $or: [
                      {
                        loksabhaid: { $in: users[0].loksabhaid },
                      },
                      {
                        loksabhaid: 0,
                      },
                    ],
                  },
                  // {
                  //   $or: [
                  //     {
                  //       jilaid: { $in: users[0].jilaid },
                  //     },
                  //     {
                  //       jilaid: 0,
                  //     },
                  //   ],
                  // },
                  {
                    $or: [
                      {
                        stateid: { $in: users[0].stateid },
                      },
                      {
                        stateid: 0,
                      },
                    ],
                  },
                  {
                    wardid: 0,
                    nikayid: 0,
                    jilaid: 0,

                    // loksabhaid: 0,
                    vidhansabhaid: 0,
                    blockid: 0,
                    zoneid: 0,
                    sectorid: 0,
                    boothid: 0,
                  },
                ],
              },
            ],
          };
        } else {
          matchData = {
            $and: [
              {
                $or: [
                  {
                    role: userroleid,
                  },
                  {
                    role: 0,
                  },
                ],
              },
              {
                $or: [
                  {
                    $or: [
                      {
                        wardid: { $in: users[0].wardid },
                      },
                      {
                        // wardid: { ne: 0 },
                        wardid: 0,
                      },
                    ],
                  },
                  {
                    $and: [
                      {
                        nikayid: { $in: users[0].nikayid },
                      },
                      {
                        wardid: 0,

                        loksabhaid: 0,
                        vidhansabhaid: 0,
                        blockid: 0,
                        boothid: 0,
                      },
                    ],
                  },
                  {
                    $and: [
                      {
                        jilaid: { $in: users[0].jilaid },
                      },
                      {
                        nikayid: 0,
                        wardid: 0,
                        loksabhaid: 0,
                        vidhansabhaid: 0,
                        blockid: 0,
                        boothid: 0,
                      },
                    ],
                  },
                  {
                    $or: [
                      {
                        boothid: { $in: users[0].boothid },
                      },
                      {
                        // boothid: { ne: 0 },
                        boothid: 0,
                      },
                    ],
                  },
                  {
                    $and: [
                      {
                        blockid: { $in: users[0].blockid },
                      },
                      {
                        boothid: 0,
                        // jilaid: 0,
                        nikayid: 0,
                        wardid: 0,
                      },
                    ],
                  },
                  {
                    $and: [
                      {
                        zoneid: { $in: users[0].zoneid },
                      },
                      {
                        boothid: 0,
                        // jilaid: 0,
                        nikayid: 0,
                        wardid: 0,
                      },
                    ],
                  },
                  {
                    $and: [
                      {
                        sectorid: { $in: users[0].sectorid },
                      },
                      {
                        boothid: 0,
                        // jilaid: 0,
                        nikayid: 0,
                        wardid: 0,
                      },
                    ],
                  },
                  {
                    $and: [
                      {
                        vidhansabhaid: { $in: users[0].vidhansabhaid },
                      },
                      {
                        // jilaid: 0,
                        nikayid: 0,
                        wardid: 0,
                        blockid: 0,
                        boothid: 0,
                      },
                    ],
                  },
                  {
                    $and: [
                      {
                        loksabhaid: { $in: users[0].loksabhaid },
                      },
                      {
                        // jilaid: 0,
                        nikayid: 0,
                        wardid: 0,
                        vidhansabhaid: 0,
                        blockid: 0,
                        boothid: 0,
                      },
                    ],
                  },
                  {
                    $and: [
                      {
                        stateid: { $in: users[0].stateid },
                      },
                      {
                        jilaid: 0,
                        nikayid: 0,
                        wardid: 0,
                        loksabhaid: 0,
                        vidhansabhaid: 0,
                        blockid: 0,
                        boothid: 0,
                      },
                    ],
                  },
                  {
                    stateid: 0,
                    jilaid: 0,
                    nikayid: 0,
                    wardid: 0,
                    loksabhaid: 0,
                    vidhansabhaid: 0,
                    blockid: 0,
                    boothid: 0,
                  },
                ],
              },
            ],
          };
        }
      }

      // JSON.stringify(matchData);
      // console.log(userID.toString());
      // console.log("query");
      // console.log(JSON.stringify(matchData));
      counts = await Task.countDocuments(matchData);
      user = await Task.aggregate([
        {
          $match: matchData,
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
            WebId: "$_id",
            _id: 1,
            title: 1,
            desc: 1,
            role: 1,
            attechment_type: 1,
            attechment_link: 1,
            usersData: { $arrayElemAt: ["$collectionBDatausers", 0] },
            entrydatetime: {
              $dateToString: { format: "%d-%m-%Y", date: "$entrydatetime" },
            },
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

// add level name like ward name
// nikay name
//  jila name
//
exports.addtaskfeed = async (req, res, next) => {
  try {
    var newid = 1;

    var { username, taskid } = req.body;

    const users = await mobilenumber_details(req.body.username, req.body.lang);
    if (!users) {
      return next(new creatError("users not exists", 400));
    }
    const level = users[0].postData[0].level;

    const oldid = await Taskfeed.find().sort({ id: -1 }).limit(1);
    if (oldid.length > 0) {
      newid = oldid[0].id + 1;
      // console.log("old id", oldid);
    }
    const stateid = users[0].stateid;
    const loksabhaid = users[0].loksabhaid;
    const vidhansabhaid = users[0].vidhansabhaid;
    const blockid = users[0].blockid;
    const jilaid = users[0].jilaid;
    const nikayid = users[0].nikayid;
    const wardid = users[0].wardid;
    const boothid = users[0].boothid;
    const zoneid = users[0].zoneid;
    const sectorid = users[0].sectorid;

    // var webId = users[0].newid;

    const newdata = {
      id: newid,
      userId: users[0]._id,
      taskId: taskid,
      feedback: req.body.feedback,
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
      lat: req.body.lat,
      long: req.body.long,

      entrydatetime: new Date(),
    };
    var newSurvey = [];
    newSurvey = await Taskfeed.create(newdata);

    if (newSurvey._id != "") {
      res.status(201).json({
        success: true,
        status: "success",
        message: "Thanks For giveing our Important Feedback",
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
