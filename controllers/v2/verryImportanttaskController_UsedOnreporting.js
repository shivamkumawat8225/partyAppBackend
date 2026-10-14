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
    const oldid = await Task.find().sort({ id: -1 }).limit(1);
    if (oldid.length > 0) {
      newid = oldid[0].id + 1;
      // console.log("old id", oldid);
    }

    //level managed
    // console.log("user level is", level);
    if (level === "national") {
      stateid = state;
      loksabhaid = loksabha;
      vidhansabhaid = vidhansabha;
      blockid = block;
      boothid = booth;
      jilaid = jila;
      nikayid = nikay;
      wardid = ward;
    }
    if (level === "state") {
      stateid = users[0].stateid;
      loksabhaid = loksabha;
      vidhansabhaid = vidhansabha;
      blockid = block;
      boothid = booth;
      jilaid = jila;
      nikayid = nikay;
      wardid = ward;
    }
    if (level === "jila") {
      stateid = users[0].stateid;
      jilaid = users[0].jilaid;

      nikayid = nikay;
      wardid = ward;
    }
    if (level === "loksabha") {
      stateid = users[0].stateid;
      loksabhaid = users[0].loksabhaid;

      vidhansabhaid = vidhansabha;
      blockid = block;
      boothid = booth;
    }
    if (level === "nikay") {
      stateid = users[0].stateid;
      jilaid = users[0].jilaid;
      nikayid = users[0].nikayid;
      wardid = ward;
    }
    if (level === "vidhansabha") {
      stateid = users[0].stateid;
      loksabhaid = users[0].loksabhaid;
      vidhansabhaid = users[0].vidhansabhaid;
      jilaid = users[0].jilaid;

      blockid = block;
      boothid = booth;
    }
    if (level === "block") {
      stateid = users[0].stateid;
      loksabhaid = users[0].loksabhaid;
      vidhansabhaid = users[0].vidhansabhaid;
      blockid = users[0].blockid;
      jilaid = users[0].jilaid;
      boothid = booth;
    }
    // if (level === "booth") {
    //   stateid = users[0].stateid;
    //   loksabhaid = users[0].loksabhaid;
    //   jilaid = users[0].jilaid;
    //   vidhansabhaid = users[0].vidhansabhaid;
    //   blockid = users[0].blockid;
    //   boothid = users[0].boothid;
    // }
    // if (level === "ward") {
    //   stateid = users[0].stateid;
    //   jilaid = users[0].jilaid;
    //   wardid = users[0].wardid;
    //   nikayid = users[0].nikayid;
    // }

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
      console.log("Task data with full detail");
      matchData = {
        _id: new mongoose.Types.ObjectId(taskid),
      };
      counts = await Task.find(matchData).count();
      user = await Task.aggregate([
        {
          $match: matchData,
        },

        {
          $lookup: {
            from: "taskfeedbacks",
            let: {
              aId: { $toString: "$_id" },
              aUserId: "$userId",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [{ $eq: ["$taskId", "$$aId"] }],
                  },
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
            ],
            as: "collectionBData",
          },
        },

        {
          $project: {
            _id: 1,
            title: 1,
            userId: 1,
            commentId: 1,
            collectionBData: 1,
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
                    },
                  ],
                },
                {
                  $and: [
                    {
                      vidhansabhaid: { $in: users[0].vidhansabhaid },
                    },
                    {
                      blockid: 0,
                    },
                  ],
                },
                {
                  $and: [
                    {
                      loksabhaid: { $in: users[0].loksabhaid },
                    },
                    {
                      vidhansabhaid: 0,
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
                    },
                  ],
                },
                {
                  stateid: 0,
                },
              ],
            },
          ],
        };
      }

      // JSON.stringify(matchData);
      // console.log(userID.toString());
      // console.log(JSON.stringify(matchData));
      counts = await Task.find(matchData).count();
      user = await Task.aggregate([
        {
          $match: matchData,
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

    var webId = newid;

    const newdata = {
      id: webId,
      userId: users[0]._id,
      taskId: taskid,
      feedback: req.body.feedback,
      attechment_type: req.body.attechment_type,
      attechment_link: req.body.attechment_link,

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
