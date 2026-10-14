const UserRole = require("../../models/UserroleModel");
const Booth = require("../../models/boothModel");
const Block = require("../../models/blockModel");
const Vidhansabha = require("../../models/vidhansabhaModel");
const Jila = require("../../models/jilaModel");
const Loksabha = require("../../models/loksabhaModel");
const State = require("../../models/stateModel");

const User = require("../../models/userModel");
const SuggestionMdl = require("../../models/suggestionModel");
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
exports.addsuggestion = async (req, res, next) => {
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
    const oldid = await SuggestionMdl.find().sort({ id: -1 }).limit(1);
    if (oldid.length > 0) {
      newid = oldid[0].id + 1;
      // console.log("old id", oldid);
    }
    //level managed
    console.log("user level is", level);
    if (level === "state") {
      step4_ver = "1";
      stateid = users[0].stateid;
    }
    if (level === "jila") {
      step3_ver = "1";
      stateid = users[0].stateid;
      jilaid = users[0].jilaid;
    }
    if (level === "loksabha") {
      step3_ver = "1";
      stateid = users[0].stateid;
      loksabhaid = users[0].loksabhaid;
    }
    if (level === "nikay") {
      step2_ver = "1";
      stateid = users[0].stateid;
      jilaid = users[0].jilaid;
      nikayid = users[0].nikayid;
    }
    if (level === "vidhansabha") {
      step2_ver = "1";
      stateid = users[0].stateid;
      loksabhaid = users[0].loksabhaid;
      vidhansabhaid = users[0].vidhansabhaid;
      jilaid = users[0].jilaid;
    }
    if (level === "block") {
      step1_ver = "1";
      stateid = users[0].stateid;
      loksabhaid = users[0].loksabhaid;
      vidhansabhaid = users[0].vidhansabhaid;
      blockid = users[0].blockid;
      jilaid = users[0].jilaid;
    }
    if (level === "booth") {
      stateid = users[0].stateid;
      loksabhaid = users[0].loksabhaid;
      jilaid = users[0].jilaid;
      vidhansabhaid = users[0].vidhansabhaid;
      blockid = users[0].blockid;
      boothid = users[0].boothid;
    }
    if (level === "ward") {
      stateid = users[0].stateid;
      jilaid = users[0].jilaid;
      wardid = users[0].wardid;
      nikayid = users[0].nikayid;
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
      boothid: boothid,
      wardid: wardid,
      nikayid: nikayid,

      step4_approved: step4_ver,
      step3_approved: step3_ver,
      step2_approved: step2_ver,
      step1_approved: step1_ver,
      entrydatetime: new Date(),
    };
    var newSurvey = [];
    newSurvey = await SuggestionMdl.create(newdata);

    if (newSurvey._id != "") {
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
exports.getsuggestion = async (req, res, next) => {
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
    if (!users) {
      return next(new creatError("users not exists", 400));
    }
    // console.log(users[0]);
    if (lang == "hi") {
      lang1 = "hindi";
    }
    const level = users[0].postData[0].level;
    let webIdnew = parseInt(webId);
    // console.log("fam", webId);
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
      } else if (block > 0) {
        if (category == "approved") {
          matchData = {
            $and: [
              {
                blockid: block,
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
                blockid: block,
              },
              {
                step1_approved: 0,
              },
            ],
          };
        }
      } else if (vidhansabha > 0) {
        if (category == "approved") {
          matchData = {
            $and: [
              {
                vidhansabhaid: vidhansabhaid,
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
                vidhansabhaid: vidhansabhaid,
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
      } else if (loksabha > 0) {
        if (category == "approved") {
          matchData = {
            $and: [
              {
                loksabhaid: loksabha,
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
                loksabhaid: loksabha,
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
      } else if (jila > 0) {
        if (category == "approved") {
          matchData = {
            $and: [
              {
                jilaid: jila,
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
                jilaid: jila,
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
      } else if (stateid > 0) {
        if (category == "approved") {
          matchData = {
            $and: [
              {
                stateid: stateid,
              },
              {
                step4_approved: 1,
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
                step3_approved: 1,
              },
              {
                step4_approved: 0,
              },
            ],
          };
        }
      } else if (level === "national") {
        matchData = {
          $and: [
            {
              step4_approved: 1,
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
                step4_approved: 1,
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
                step3_approved: 1,
              },
              {
                step4_approved: 0,
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
                step3_approved: 1,
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
                step2_approved: 1,
              },
              {
                step3_approved: 0,
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
                step3_approved: 1,
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
                step2_approved: 1,
              },
              {
                step3_approved: 0,
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
                step2_approved: 1,
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
                step1_approved: 1,
              },
              {
                step2_approved: 0,
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
                step1_approved: 1,
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

      counts = await SuggestionMdl.find(matchData).count();
      user = await SuggestionMdl.aggregate([
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
            comment1: "$step1_comment",
            comment2: "$step2_comment",
            comment3: "$step3_comment",
            comment4: "$step4_comment",
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
            loksabhaData: 1,
            jilaData: 1,
            vidhansabhaData: 1,
            blockData: 1,
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
    const { WebId, username, comment, level, status } = req.body;
    const user = await User.findOne({ mobile: username });

    if (!user) {
      return next(new creatError("User not Found!", 404));
    }

    const query = { _id: WebId };
    const querys = { _id: new mongoose.Types.ObjectId(WebId) };

    var setvalue = {};
    if (level === "state") {
      setvalue = {
        step4_approved: 1,
        step4_comment: comment,
        step4_approved_by: user[0]._id,
      };
    } else if (level === "jila") {
      setvalue = {
        step3_approved: 1,
        step3_comment: comment,
        step3_approved_by: user[0]._id,
      };
    } else if (level === "loksabha") {
      setvalue = {
        step3_approved: 1,
        step3_comment: comment,
        step3_approved_by: user[0]._id,
      };
    } else if (level === "nikay") {
      setvalue = {
        step1_approved: 1,
        step1_comment: comment,
        step1_approved_by: user[0]._id,
      };
    } else if (level === "vidhansabha") {
      setvalue = {
        step2_approved: 1,
        step2_comment: comment,
        step2_approved_by: user[0]._id,
      };
    } else if (level === "block") {
      setvalue = {
        step1_approved: 1,
        step1_comment: comment,
        step1_approved_by: user[0]._id,
      };
    } else {
      return res.status(200).json({
        success: false,
        status: "unsuccess",
        message: "level Not found for Update",
      });
    }
    var update = { $set: setvalue };
    const options = {};
    const result = await SuggestionMdl.updateOne(query, update, options);

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

// add level name like ward name
// nikay name
//  jila name
//
