let io; // Variable to hold the Socket.IO instance

// Function to initialize the Socket.IO instance

const Booth = require("../../../models/boothModel");
const Block = require("../../../models/blockModel");
const Vidhansabha = require("../../../models/vidhansabhaModel");
const Jila = require("../../../models/jilaModel");
const Loksabha = require("../../../models/loksabhaModel");
const State = require("../../../models/stateModel");
const Nikay = require("../../../models/nikayModel");
const Ward = require("../../../models/wardModel");
const Familysurvey = require("../../../models/surveyfamilyModel");
const Religion = require("../../../models/religionModel");
const ElectionDayLive = require("../../../models/electionDayLiveModel");
const Common = require("../../../models/commonModel");

const creatError = require("../../../utils/appError");
const Surveyfamily = require("../../../models/surveyfamilyModel");
const Category = require("../../../models/categoryModel");
const Caste = require("../../../models/casteModel");
const Surveyvoter = require("../../../models/surveyvoterModel");
const Education = require("../../../models/educationModel");
const Sector = require("../../../models/sectorModel");
const Zone = require("../../../models/zoneModel");
const User = require("../../../models/userModel");
const user = require("../../../routes/exportdataRoute");

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
exports.setSocketIoInstance = async (socketIoInstance) => {
  io = socketIoInstance;
};
exports.boothdata = async (req, res, next) => {
  try {
    var {
      username,
      lang,
      app_type,
    } = req.body;
    // console.log(req.body)
    const users = await mobilenumber_details(username, req.body.lang);
    if (!users) {
      return next(new creatError("users not exists", 400));
    }
    const level = users[0].postData[0].level;
    if (level === "booth") {
      var boothid = req.body.boothid * 1;
      const total_votecount = await Surveyvoter.countDocuments({ boothid: boothid, vote: 1 });
      const total_votercount = await Surveyvoter.countDocuments({ boothid: boothid });
      res.status(200).json({
        status: "success",
        message: "Data Found successful",

        countData: {
          total_votecount: total_votecount,
          total_votercount: total_votercount,
          remaining_votecount: total_votercount - total_votecount,
        },
        data: [],
        familydata: [],
      });
    } else if (level === "ward") {
      const count = await User.countDocuments({ role: 94, wardid: { $in: users[0].wardid } });
      const levels = await User.aggregate([
        {
          $match: {
            role: 94,
            wardid: { $in: users[0].wardid },
          }
        },
        {
          $project: {
            _id: 1,
            name: `$name_${lang}`,
            name_en: `$name_en`,
            father_name: `$father_name_${lang}`,
            father_name_en: `$father_name_en`,
            mobile: 1,
          },
        },
        { $sort: { "_id": 1 } },
      ]);
      const allvoter = await Surveyvoter.countDocuments({ wardid: { $in: users[0].wardid } });
      const avgvoter = Math.ceil(allvoter / count);

      const finalResult = await Promise.all(
        levels.map(async (levelss, index) => {
          const voterDetails = await Surveyvoter.aggregate([
            {
              $match: {
                wardid: { $in: users[0].wardid },
              },
            },
            {
              $project: {
                _id: 1,
                name: `$name_${lang}`,
                name_en: `$name_en`,
                rel_name: `$rel_name_${lang}`,
                rel_name_en: `$rel_name_en`,
                mobile: `$mobile`,
                vote: 1,
                voter_kramank: 1,
                voterId: 1,
              },
            },
            { $skip: index * avgvoter },
            { $limit: avgvoter },
          ]);
          return {
            id: levelss._id,
            name_en: levelss.name_en,
            name: levelss.name,
            father_name_en: levelss.father_name_en,
            mobile: levelss.mobile,
            father_name: levelss.name,
            voterDetails: voterDetails,
          };
        })
      );
      res.status(200).json({
        status: "success",
        message: "Data Found successful",
        count: count,
        data: finalResult,
        familydata: [],
      });
    }
  } catch (error) {
    console.error("Error fetching state data:", error);
    throw error;
  }
};
exports.livevotingdata = async (req, res, next) => {
  try {
    var {
      username,
      lang,
      limit,
      skip,
      app_type,
    } = req.body;
    // console.log(req.body)
    const users = await mobilenumber_details(username, req.body.lang);
    if (!users) {
      return next(new creatError("users not exists", 400));
    }
    const level = users[0].postData[0].level;
    if (level === "booth") {
      var boothid = req.body.boothid * 1;
      const total_votecount = await Surveyvoter.countDocuments({ boothid: boothid, vote: 1 });
      const total_votercount = await Surveyvoter.countDocuments({ boothid: boothid });

      const count = await User.countDocuments({ boothid: boothid });
      // const count = await User.countDocuments({ role: 94, boothid: boothid });
      const levels = await User.aggregate([
        {
          $match: {
            // role: 94,
            boothid: boothid,
          }
        },
        {
          $project: {
            _id: 1,
            name: `$name_${lang}`,
            name_en: `$name_en`,
            father_name: `$father_name_${lang}`,
            father_name_en: `$father_name_en`,
            mobile: 1,
            sr_start: 1,
            sr_end: 1,
          },
        },
        { $sort: { "sr_start": 1 } },
      ]);

      const finalResult = await Promise.all(
        levels.map(async (levelss, index) => {
          const voterDetails = await Surveyvoter.aggregate([
            {
              $match: {
                boothid: boothid,
                voter_kramank: { $gte: levelss.sr_start, $lte: levelss.sr_end },

              },
            },
            {
              $project: {
                _id: 1,
                name: `$name_${lang}`,
                name_en: `$name_en`,
                rel_name: `$rel_name_${lang}`,
                rel_name_en: `$rel_name_en`,
                mobile: `$mobile`,
                vote: 1,
                voter_kramank: 1,
                voterId: 1,
              },
            },

          ]);
          const ktotal_votecount = await Surveyvoter.countDocuments({ boothid: boothid, vote: 1, voter_kramank: { $gte: levelss.sr_start, $lte: levelss.sr_end } });
          const ktotal_votercount = await Surveyvoter.countDocuments({ boothid: boothid, voter_kramank: { $gte: levelss.sr_start, $lte: levelss.sr_end } });

          return {
            id: levelss._id,
            name_en: levelss.name_en,
            name: levelss.name,
            father_name_en: levelss.father_name_en,
            mobile: levelss.mobile,
            sr_start: levelss.sr_start,
            sr_end: levelss.sr_end,
            father_name: levelss.name,
            voterDetails: voterDetails,
            karyakartacountData: {
              total_votecount: ktotal_votecount,
              total_votercount: ktotal_votercount,
              remaining_votecount: ktotal_votercount - ktotal_votecount,
            },
          };
        })
      );
      res.status(200).json({
        status: "success",
        message: "Data Found successful",
        usercount: count,
        countData: {
          total_votecount: total_votecount,
          total_votercount: total_votercount,
          remaining_votecount: total_votercount - total_votecount,
        },
        data: finalResult,
        familydata: [],
      });
    } else if (level === "ward") {
      const count = await User.countDocuments({ role: 94, wardid: { $in: users[0].wardid } });
      const levels = await User.aggregate([
        {
          $match: {
            role: 94,
            wardid: { $in: users[0].wardid },
          }
        },
        {
          $project: {
            _id: 1,
            name: `$name_${lang}`,
            name_en: `$name_en`,
            father_name: `$father_name_${lang}`,
            father_name_en: `$father_name_en`,
            mobile: 1,
          },
        },
        { $sort: { "_id": 1 } },
      ]);
      const allvoter = await Surveyvoter.countDocuments({ wardid: { $in: users[0].wardid } });
      const avgvoter = Math.ceil(allvoter / count);

      const finalResult = await Promise.all(
        levels.map(async (levelss, index) => {
          const voterDetails = await Surveyvoter.aggregate([
            {
              $match: {
                wardid: { $in: users[0].wardid },
              },
            },
            {
              $project: {
                _id: 1,
                name: `$name_${lang}`,
                name_en: `$name_en`,
                rel_name: `$rel_name_${lang}`,
                rel_name_en: `$rel_name_en`,
                mobile: `$mobile`,
                vote: 1,
                voter_kramank: 1,
                voterId: 1,
              },
            },
            { $skip: index * avgvoter },
            { $limit: avgvoter },
          ]);
          return {
            id: levelss._id,
            name_en: levelss.name_en,
            name: levelss.name,
            father_name_en: levelss.father_name_en,
            mobile: levelss.mobile,
            father_name: levelss.name,
            voterDetails: voterDetails,
          };
        })
      );
      res.status(200).json({
        status: "success",
        message: "Data Found successful",
        count: count,
        data: finalResult,
        familydata: [],
      });
    }
  } catch (error) {
    console.error("Error fetching state data:", error);
    throw error;
  }
};
//cronjob assign voter kramank on user and update random voter kramank on surveyvoter
exports.livevoting = async (req, res, next) => {
  try {
    var {
      username,
      lang,
      webId,
    } = req.body;
    const users = await mobilenumber_details(username, req.body.lang);
    if (!users) {
      return next(new creatError("users not exists", 400));
    }
    let boothid = 1
    // const user = await User.find({ boothid: 1 });
    // const count = await User.countDocuments({ boothid: 1 });
    // const allvoter = await Surveyvoter.countDocuments({ boothid: 1 });
    // const avgvoter = Math.ceil(allvoter / count);
    // Fetch all users and voter counts for the booth
    const userList = await User.find({ boothid: boothid });
    const userCount = await User.countDocuments({ boothid: boothid });
    const totalVoters = await Surveyvoter.countDocuments({ boothid: boothid });

    // Calculate average voters per user
    const avgvoter = Math.ceil(totalVoters / userCount);

    // Initialize start and end values
    var start = 1;
    // Update each user's sr_start and sr_end
    for (let i = 0; i < userList.length; i++) {
      const user = userList[i];
      const end = start + avgvoter - 1;
      const query = { _id: user._id };
      const update = { $set: { sr_start: start, sr_end: end } };
      const options = { upsert: true };
      await User.updateOne(query, update);
      start = end + 1;
    }

    res.status(200).json({
      success: true,
      message: "Users updated successfully",
      // data: updatedUsers,
    });
    // var newUser = []
    // user.map(async (user, index) => {
    //   console.log("user", user._id, "start", start, "end", end, "index", index, "avgvoter", avgvoter, "user name", user.name)
    //   const query = { _id: user._id };
    //   const update = { $set: { sr_start: start, sr_end: end } };
    //   const options = { upsert: true };
    //   newUser = await User.updateOne(query, update);
    //   start = end + 1;
    //   // end = start + avgvoter - 1;
    //   console.log("start", start, "end", end)
    // });

    // const alluseer = await Surveyvoter.find({ boothid: 1 });
    // if (alluseer.length > 0) {
    //   alluseer.map(async (user, index) => {
    //     const query = { _id: user._id };
    //     const update = { $set: { voter_kramank: index + 1 } };
    //     const options = { upsert: true };
    //     newUser = await Surveyvoter.updateOne(query, update);
    //   });
    // }
    // const newuserdata = {
    //   vote: req.body.votestatus
    // };
    // // var newUser = [];
    // const query = { _id: req.body.webId };
    // const update = { $set: newuserdata };
    // const options = { upsert: true };
    // newUser = await Surveyvoter.updateOne(query, update);

    // if (newUser.modifiedCount > 0 || newUser._id != "") {
    //   res.status(200).json({
    //     success: true,
    //     status: "success",
    //     message: "Data Sync successful",
    //   });
    // } else {
    //   res.status(200).json({
    //     success: false,
    //     status: "unsuccess",
    //     message: "Data not sync successful",
    //     data: data,
    //   });
    // }
  } catch (error) {
    console.error("Error fetching state data:", error);
    throw error;
  }
};
exports.livevoting1 = async (req, res, next) => {
  try {
    var {
      username,
      lang,
      webId,
    } = req.body;
    const users = await mobilenumber_details(username, req.body.lang);
    if (!users) {
      return next(new creatError("users not exists", 400));
    }
    const newuserdata = {
      vote: req.body.votestatus
    };
    var newUser = [];
    const query = { _id: req.body.webId };
    const update = { $set: newuserdata };
    const options = { upsert: true };
    newUser = await Surveyvoter.updateOne(query, update);

    if (newUser.modifiedCount > 0 || newUser._id != "") {
      res.status(200).json({
        success: true,
        status: "success",
        message: "Data Sync successful",
      });
    } else {
      res.status(200).json({
        success: false,
        status: "unsuccess",
        message: "Data not sync successful",
        data: data,
      });
    }
  } catch (error) {
    console.error("Error fetching state data:", error);
    throw error;
  }
};

exports.setupSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("updatevote", async (data) => {
      try {
        const req = { body: data }; // Mock request object
        const res = {
          status: (code) => ({
            json: (response) => {
              // console.log("Response:", response);
              socket.emit("updatevote_response", response); // Emit response back to client
            },
          }),
        };
        const next = (err) => {
          console.error("Error:", err);
          socket.emit("updatevote_error", { error: err.message });
        };

        await exports.livevoting(req, res, next);
      } catch (error) {
        console.error("Socket error:", error);
        socket.emit("updatevote_error", { error: "Internal server error" });
      }
    });
  });
};

exports.viewElectionDayLiveBoothDetail = async (req, res) => {
  try {
    const { ltype, vidhansabhaid, ids } = req.body;
    const lang = req.body.lang; // Assuming language code is "hi"
    let totalLvoter = 0, lpaksh = 0, lrpaksh = 0;

    let booths = [];
    if (ltype === "vidhansabha") {
      booths = await Common.getBoothByVidhansabha(vidhansabhaid);
      // console.log(booths, "boothsssss")
      totalLvoter = await ElectionDayLive.getTotalVoterVid(vidhansabhaid, "", "", "", "");
      lpaksh = await ElectionDayLive.getElectionResultByRemark(vidhansabhaid, "", "", "", "", 1);
      lrpaksh = await ElectionDayLive.getNotVoteElectionResultByRemark(vidhansabhaid, "", "", "", "", 1);
    } else if (ltype === "block") {
      booths = await Common.getBoothByBlockId(ids);
      totalLvoter = await ElectionDayLive.getTotalVoterVid("", ids, "", "", "");
      lpaksh = await ElectionDayLive.getElectionResultByRemark("", ids, "", "", "", 1);
      lrpaksh = await ElectionDayLive.getNotVoteElectionResultByRemark("", ids, "", "", "", 1);
    } else if (ltype === "zone") {
      booths = await Common.getBoothByZoneId(ids);
      totalLvoter = await ElectionDayLive.getTotalVoterVid("", "", ids, "", "");
      lpaksh = await ElectionDayLive.getElectionResultByRemark("", "", ids, "", "", 1);
      lrpaksh = await ElectionDayLive.getNotVoteElectionResultByRemark("", "", ids, "", "", 1);
    } else if (ltype === "sector") {
      booths = await Common.getBoothBySectorId(ids);
      totalLvoter = await ElectionDayLive.getTotalVoterVid("", "", "", ids, "");
      lpaksh = await ElectionDayLive.getElectionResultByRemark("", "", "", ids, "", 1);
      lrpaksh = await ElectionDayLive.getNotVoteElectionResultByRemark("", "", "", ids, "", 1);
    } else if (ltype === "booth") {
      booths = await Common.getBoothByBoothId(ids);
      totalLvoter = await ElectionDayLive.getTotalVoterVid("", "", "", "", ids);
      lpaksh = await ElectionDayLive.getElectionResultByRemark("", "", "", "", ids, 1);
      lrpaksh = await ElectionDayLive.getNotVoteElectionResultByRemark("", "", "", "", ids, 1);
    }

    const boothDetails = await Promise.all(
      booths.map(async (booth) => {
        const totalVoter = await ElectionDayLive.getTotalVoterVid("", "", "", "", booth.id);//total
        const paksh = await ElectionDayLive.getElectionResultByRemark("", "", "", "", booth.id, 1);//total voting
        const rpaksh = await ElectionDayLive.getNotVoteElectionResultByRemark("", "", "", "", booth.id, 1);
        //remaining voting
        return {
          boothid: booth.id,
          boothName: booth[`booth_${lang}`],
          totalVoter: totalVoter[0]?.count || 0,
          paksh: paksh[0]?.count || 0,
          rpaksh: rpaksh[0]?.count || 0,
          // tpaksh: (paksh[0]?.count || 0) + (rpaksh[0]?.count || 0),
        };
      })
    );

    if (boothDetails.length > 0) {
      res.status(200).json({
        status: "success",
        totalLvoter: totalLvoter[0]?.count || 0,
        lpaksh: lpaksh[0]?.count || 0,
        lrpaksh: lrpaksh[0]?.count || 0,
        boothDetails,
      });
    } else {
      res.status(404).json({
        status: "error",
        message: "Data not available",
      });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

exports.changeBoothDetailById = async (req, res) => {
  try {
    const lang = req.body.lang; // Assuming language code is "hi"
    const boothId = (req.body.boothid) * 1;
    // console.log(req.body, "change data")
    const booths = await Common.getBoothByBoothId(boothId);
    if (!booths || booths.length === 0) {
      return res.status(404).json({
        status: "error",
        msg: "Data not available",
      });
    }
    const totalVoterS = await ElectionDayLive.getTotalVoterVid("", "", "", "", boothId);
    const paksh = await ElectionDayLive.getElectionResultByRemark("", "", "", "", boothId, 1); //voting
    const rpaksh = await ElectionDayLive.getNotVoteElectionResultByRemark("", "", "", "", boothId, 1); //not voting

    const totalVoters = totalVoterS[0]?.count || 0;
    const pakshCount = paksh[0]?.count || 0;
    const rpakshCount = rpaksh[0]?.count || 0;
    const tpaksh = pakshCount + rpakshCount;

    const boothName = booths[0][`booth_${lang}`];
    const boothIdResult = booths[0].boothid;

    res.status(200).json({
      status: "success",
      booth: [],
      booth_name: [boothName],
      boothid: boothIdResult,
      paksh: pakshCount,
      rpaksh: rpakshCount,
      tpaksh: tpaksh,
      total_voters: totalVoters,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      status: "error",
      msg: "Internal server error",
    });
  }
};

// Controller method to emit the updatevote event
exports.updateVote = async (req, res) => {
  const { username, lang, webId, votestatus, boothid } = req.body;
  if (!username || !lang || !webId || !votestatus || !boothid) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  if (!io) {
    return res.status(500).json({ error: 'Socket.IO instance not initialized' });
  }
  // Emit the updatevote event
  io.emit('updatevote', { username, lang, webId, votestatus, boothid });
  res.status(200).json({ message: 'Vote update emitted successfully' });
};

exports.updateVoteDetailss = async (data) => {
  try {
    const { username, lang, webId, votestatus, boothid } = data;
    if (!username || !lang || !webId || !votestatus || !boothid) {
      return { error: 'Missing required fields', result: null };
    }
    const newuserdata = {
      vote: votestatus
    };
    const query = { _id: webId };
    const update = { $set: newuserdata };
    const options = { upsert: true };
    const newUser = await Surveyvoter.updateOne(query, update);

    return { error: null, result: newUser };
  } catch (err) {
    return { error: err.message, result: null };
  }
};

exports.updateVoteDetail = async (data, callback) => {
  try {
    // Perform the necessary database operations or logic here
    // Example: Update vote details in the database
    const { webId, votestatus, karyakartaid, boothid, lang } = data;
    // if (!username || !lang || !webId || !votestatus || !boothid) {
    //   return { error: 'Missing required fields', result: null };
    // }
    if (!webId || !votestatus) {
      return { error: 'Missing required fields', result: null };
    }
    const newuserdata = {
      vote: votestatus
    };
    const query = { _id: webId };
    const update = { $set: newuserdata };
    const options = { upsert: true };
    const result = await Surveyvoter.updateOne(query, update);
    // console.log("result", result)
    if (result.modifiedCount > 0 || result._id != "") {
      if (karyakartaid) {
        const query = { _id: karyakartaid };
        const user = await User.findOne(query);
        const userdata = await Surveyvoter.find({ boothid: boothid * 1, voter_kramank: { $gte: user.sr_start, $lte: user.sr_end } }, {
          _id: 1,
          name: `$name_${lang}`,
          name_en: `$name_en`,
          rel_name: `$rel_name_${lang}`,
          rel_name_en: `$rel_name_en`,
          mobile: `$mobile`,
          vote: 1,
          voter_kramank: 1,
          voterId: 1,
        }
        );
        const ktotal_votecount = await Surveyvoter.countDocuments({ boothid: boothid, vote: 1, voter_kramank: { $gte: user.sr_start, $lte: user.sr_end } });
        const ktotal_votercount = await Surveyvoter.countDocuments({ boothid: boothid, voter_kramank: { $gte: user.sr_start, $lte: user.sr_end } });
        let karyakartacountData = {
          total_votecount: ktotal_votecount,
          total_votercount: ktotal_votercount,
          remaining_votecount: ktotal_votercount - ktotal_votecount,
        }
        // let result2 = userdata;
        callback(null, karyakartacountData);
      }
    }
    // return { error: null, result: newUser };

    // callback(null, result);
  } catch (error) {
    // console.error('Error in updateVoteDetail:', error);
    callback(error, null);
  }
};





