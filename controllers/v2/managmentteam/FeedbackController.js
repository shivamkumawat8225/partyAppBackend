var mongoose = require("mongoose");
const Booth = require("../../../models/boothModel");
const Block = require("../../../models/blockModel");
const Vidhansabha = require("../../../models/vidhansabhaModel");
const Jila = require("../../../models/jilaModel");
const Loksabha = require("../../../models/loksabhaModel");
const State = require("../../../models/stateModel");
const Nikay = require("../../../models/nikayModel");
const Ward = require("../../../models/wardModel");
const Zone = require("../../../models/zoneModel");
const Sector = require("../../../models/sectorModel");
const Familysurvey = require("../../../models/surveyfamilyModel");
const Generalnews = require("../../../models/generalnewsModel");
const Suggestion = require("../../../models/suggestionModel");

const creatError = require("../../../utils/appError");
const Surveyfamily = require("../../../models/surveyfamilyModel");
const Surveyvoter = require("../../../models/surveyvoterModel");
const Education = require("../../../models/educationModel");
const Profession = require("../../../models/professionModel");
const Party = require("../../../models/party");
const Gender = require("../../../models/genderModel");
const User_role = require("../../../models/UserroleModel");
const User = require("../../../models/userModel");
const Surveyproblem = require("../../../models/surveyproblemsModel");
const Surveyboothvoter = require("../../../models/surveyboothvoterModel");
const VehiclesOwner = require("../../../models/vehicleownerModel");
const Vehicles = require("../../../models/vehiclesModel");
const Feedback = require("../../../models/feedbackModel");
const DailyFeedback = require("../../../models/dailyfeedbackModel");
const Nagetivekhabar = require("../../../models/nagetivekhabarModel");

exports.addfeedback = async (req, res, next) => {
  try {
    // Find user
    const user = await User.find({ mobile: req.body.username });
    // console.log("user", user);
    if (!user || user.length === 0) {
      return next(new creatError("User not Found!", 404));
    }
    // Prepare owner
    // console.log("users ",user)
    let feedbackData = {};
    if (req.body.formId === "1") {
      feedbackData = {
        createrId: user[0]._id,
        userId: req.body.userId,
        feedback: req.body.feedback,
        teamId: req.body.teamId,
        roleId: req.body.roleId,
        entrydatetime: new Date(),
      };
    } else if (req.body.formId === "2") {
      // req raw body is like this
      // addfeedback json raw face1
      // {
      //   "formId": "1",
      //   "userId": "1234567890",
      //   "feedback": "This is a feedback",
      //   "teamId": "111",
      //   "roleId": "93",
      //   "username": "user123"
      // }
      // (reqtype = "whatsapp_prabhari"),
      //   "patrol_team",
      //   "table_prabhari",
      //   "polling_agent",
      //   "speaker";
      // role is whatsapp_prabhari(ws) ,patrol_team(pt), table_prabhari(tp), polling_agent(pa), speaker(bs)
      feedbackData = {
        createrId: user[0]._id,
        userId: req.body.userId,
        feedback: req.body.feedback,
        teamId: req.body.teamId,
        role: req.body.role,
        entrydatetime: new Date(),
      };
    } else if (req.body.formId === "3") {
      // req raw body is like this
      // {
      //   "formId": "3",
      //   "userId": "1234567890",
      //   "feedback": "This is a feedback",
      //   "teamId": "team123",
      //   "roleId": "role123",
      //   "q1": "1",
      //   "q2": "0",
      //   "q3": "0",
      //   "q4": "1",
      //   "q5": "0",
      //   "q6": "1",
      //   "q7": "0",
      //   "q8": "1",
      //   "q9": "0",
      //   "q10": "1",
      //   "username": "user123"
      // }
      feedbackData = {
        createrId: user[0]._id,
        userId: req.body.userId,
        feedback: req.body.feedback,
        teamId: req.body.teamId,
        roleId: req.body.roleId,
        q1: req.body.q1,
        q2: req.body.q2,
        q3: req.body.q3,
        q4: req.body.q4,
        q5: req.body.q5,
        q6: req.body.q6,
        q7: req.body.q7 ? req.body.q7 : 0,
        q8: req.body.q8 ? req.body.q8 : 0,
        q9: req.body.q9 ? req.body.q9 : 0,
        q10: req.body.q10 ? req.body.q10 : 0,
        entrydatetime: new Date(),
      };
    } else {
      feedbackData = {
        createrId: user[0]._id,
        userId: req.body.userId,
        feedback: req.body.feedback,
        teamId: req.body.teamId,
        roleId: req.body.roleId,
        entrydatetime: new Date(),
      };
    }
    let newSurvey = [];
    newSurvey = await Feedback.create(feedbackData);
    res.status(201).json({
      success: true,
      status: "success",
      message: "Feedback saved successfully",
    });
  } catch (error) {
    next(error);
  }
};
exports.addNagativeKhabar = async (req, res, next) => {
  try {
    var {
      description,
      boothid,
      sectorid,
      zoneid,
      blockid,
      vidhansabhaid,
      loksabhaid,
      stateid,
      nikayid,
      wardid,
      jilaid,
    } = req.body;
    boothid = parseInt(boothid);
    sectorid = parseInt(sectorid);
    zoneid = parseInt(zoneid);
    blockid = parseInt(blockid);
    vidhansabhaid = parseInt(vidhansabhaid);
    loksabhaid = parseInt(loksabhaid);
    stateid = parseInt(stateid);
    nikayid = parseInt(nikayid);
    wardid = parseInt(wardid);
    jilaid = parseInt(jilaid);

    // Find user
    const user = await User.find({ mobile: req.body.username });
    if (!user || user.length === 0) {
      return next(new creatError("User not Found!", 404));
    }
    let feedbackData = {};
    if (boothid !== 0 && !isNaN(boothid)) {
      const data = await Booth.findOne({ id: boothid });
      if (!data) {
        return next(new creatError("Booth not found", 404));
      }
      feedbackData.boothid = data.id;
      feedbackData.sectorid = data.sector_id;
      feedbackData.zoneid = data.zone_id;
      feedbackData.blockid = data.block_id;
      feedbackData.vidhansabhaid = data.vidhansabha_id;
      feedbackData.loksabhaid = data.loksabha_id;
      feedbackData.stateid = data.stateid;
    } else if (sectorid !== 0 && !isNaN(sectorid)) {
      const data = await Sector.findOne({ id: sectorid });
      if (!data) {
        return next(new creatError("Sector not found", 404));
      }
      feedbackData.sectorid = data.id;
      feedbackData.zoneid = data.zone_id;
      feedbackData.blockid = data.block_id;
      feedbackData.vidhansabhaid = data.vidhansabha_id;
      feedbackData.loksabhaid = data.loksabha_id;
      feedbackData.stateid = data.stateid;
    } else if (zoneid !== 0 && !isNaN(zoneid)) {
      const data = await Zone.findOne({ id: zoneid });
      if (!data) {
        return next(new creatError("Zone not found", 404));
      }
      feedbackData.zoneid = data.id;
      feedbackData.blockid = data.block_id;
      feedbackData.vidhansabhaid = data.vidhansabha_id;
      feedbackData.loksabhaid = data.loksabha_id;
      feedbackData.stateid = data.stateid;
    } else if (blockid !== 0 && !isNaN(blockid)) {
      const data = await Block.findOne({ id: blockid });
      if (!data) {
        return next(new creatError("block not found", 404));
      }
      feedbackData.blockid = data.id;
      feedbackData.vidhansabhaid = data.vidhansabha_id;
      feedbackData.loksabhaid = data.loksabha_id;
      feedbackData.stateid = data.stateid;
    } else if (vidhansabhaid !== 0 && !isNaN(vidhansabhaid)) {
      const data = await Vidhansabha.findOne({ id: vidhansabhaid });
      if (!data) {
        return next(new creatError("vidhansabha not found", 404));
      }
      feedbackData.vidhansabhaid = data.id;
      feedbackData.loksabhaid = data.loksabha_id;
      feedbackData.stateid = data.stateid;
    } else if (loksabhaid !== 0 && !isNaN(loksabhaid)) {
      const data = await Loksabha.findOne({ id: loksabhaid });
      if (!data) {
        return next(new creatError("loksabha not found", 404));
      }
      feedbackData.loksabhaid = data.id;
      feedbackData.stateid = data.stateid;
    } else if (stateid !== 0 && !isNaN(stateid)) {
      const data = await State.findOne({ id: stateid });
      if (!data) {
        return next(new creatError("state not found", 404));
      }
      feedbackData.stateid = data.id;
    }

    feedbackData.description = description;
    feedbackData.createrId = user[0]._id;
    feedbackData.entrydatetime = new Date();

    let newSurvey = [];
    newSurvey = await Nagetivekhabar.create(feedbackData);
    res.status(201).json({
      success: true,
      status: "success",
      message: "Nagetive Khabar saved successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.getFeedbacklist = async (req, res, next) => {
  try {
    const { userId, teamId, roleId, username, lang } = req.body;
    const user = await User.find({ mobile: username });
    if (!user || user.length === 0) {
      return next(new creatError("User not Found!", 404));
    }
    let matchStage = {};
    let createrId = user[0]._id;
    const feedbackData = await Feedback.find({
      createrId: user[0]._id,
      // userId: userId,
      teamId: req.body.teamId,
      roleId: req.body.roleId,
    });
    res.status(200).json({
      success: true,
      data: feedbackData,
    });
  } catch (error) {
    next(error);
  }
};

exports.nagetiveKhabarList = async (req, res, next) => {
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
      booth,
      zone,
      sector,
      nikay,
      ward,
      app_type,
      datatype,
      reqtype,
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
            boothid: booth,
          },

          {
            status: false,
          },
        ],
      };
    } else if (sector > 0) {
      matchData = {
        $and: [
          {
            sectorid: sector,
          },
          {
            status: false,
          },
        ],
      };
    } else if (zone > 0) {
      matchData = {
        $and: [
          {
            zoneid: zone,
          },
          {
            status: false,
          },
        ],
      };
    } else if (block > 0) {
      matchData = {
        $and: [
          {
            blockid: block,
          },
          {
            status: false,
          },
        ],
      };
    } else if (vidhansabha > 0) {
      matchData = {
        $and: [
          {
            vidhansabhaid: vidhansabha,
          },
          {
            status: false,
          },
        ],
      };
    } else if (ward > 0) {
      matchData = {
        $and: [
          {
            wardid: ward,
          },
          {
            status: false,
          },
        ],
      };
    } else if (nikay > 0) {
      matchData = {
        $and: [
          {
            nikayid: nikay,
          },
          {
            status: false,
          },
        ],
      };
    } else if (jila > 0) {
      matchData = {
        $and: [
          {
            jilaid: jila,
          },
          {
            status: false,
          },
        ],
      };
    } else if (loksabha > 0) {
      matchData = {
        $and: [
          {
            loksabhaid: loksabha,
          },
          {
            status: false,
          },
        ],
      };
    } else if (stateid > 0) {
      matchData = {
        $and: [
          {
            stateid: stateid,
          },
          {
            status: false,
          },
        ],
      };
    }
    // national id
    // block ids

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
    const usercount = await Nagetivekhabar.countDocuments(matchData);
    user = await Nagetivekhabar.aggregate([
      {
        $match: matchData,
      },

      {
        $lookup: {
          from: "users",
          localField: "createrId",
          foreignField: "_id",
          as: "userData",
          pipeline: [
            {
              $project: {
                _id: 0,
                id: 1,
                name_en: 1,
                name: `$name_${lang}`,
                defaultname: `$name`,
                mobile: 1,
                image: 1,
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
      { $sort: { entrydatetime: -1 } },
      { $skip: parseInt(skip) },
      { $limit: parseInt(limit) },
      {
        $project: {
          _id: 1,
          description: 1,
          userId: `$createrId`,
          stateid: 1,
          loksabhaid: 1,
          vidhansabhaid: 1,
          blockid: 1,
          zoneid: 1,
          sectorid: 1,
          boothid: 1,
          nikayid: 1,
          wardid: 1,
          jilaid: 1,
          userData: 1,
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
        },
      },
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

exports.getDailyFeedbacklist = async (req, res, next) => {
  try {
    const { userId, teamId, roleId, username, lang } = req.body;
    const user = await User.find({ mobile: username });
    if (!user || user.length === 0) {
      return next(new creatError("User not Found!", 404));
    }
    let matchStage = {};
    let createrId = user[0]._id;
    const feedbackData = await DailyFeedback.find({
      createrId: user[0]._id,
      // userId: userId,
      // teamId: user[0].role,
    });
    res.status(200).json({
      success: true,
      data: feedbackData,
    });
  } catch (error) {
    next(error);
  }
};
exports.adddailyfeedback = async (req, res, next) => {
  try {
    // Find user
    const user = await User.find({ mobile: req.body.username });
    if (!user || user.length === 0) {
      return next(new creatError("User not Found!", 404));
    }
    let feedbackData = {};

    feedbackData = {
      createrId: user[0]._id,
      userId: req.body.userId,
      feedback: req.body.feedback,
      teamId: user[0].role,
      entrydatetime: new Date(),
    };

    let newSurvey = [];
    newSurvey = await DailyFeedback.create(feedbackData);
    res.status(201).json({
      success: true,
      status: "success",
      message: "Daily Feedback saved successfully",
    });
  } catch (error) {
    next(error);
  }
};
