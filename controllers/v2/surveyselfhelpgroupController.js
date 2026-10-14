// const { ObjectId } = require("mongodb"); // or ObjectID
var mongoose = require("mongoose");
const User = require("../../models/userModel");
const Category = require("../../models/categoryModel");
const Religion = require("../../models/religionModel");
const Education = require("../../models/educationModel");
const Profession = require("../../models/professionModel");
const Party = require("../../models/party");
const Gender = require("../../models/genderModel");
const Caste = require("../../models/casteModel");
const UserRole = require("../../models/UserroleModel");
const Booth = require("../../models/boothModel");
const Block = require("../../models/blockModel");
const Vidhansabha = require("../../models/vidhansabhaModel");
const Jila = require("../../models/jilaModel");
const Loksabha = require("../../models/loksabhaModel");
const State = require("../../models/stateModel");
const SurveyFamily = require("../../models/surveyfamilyModel");
const SurveyVoter = require("../../models/surveyvoterModel");
const Surveyquestion = require("../../models/surveyquestionModel");
const creatError = require("../../utils/appError");
const Ward = require("../../models/wardModel");
const Surveyproblem = require("../../models/surveyproblemsModel");
const problemtype = require("../../models/problemtypeModel");
const Surveyboothvoter = require("../../models/surveyboothvoterModel");
const Surveyboothquestion = require("../../models/surveyboothquestionModel");
const Surveysuggesion = require("../../models/surveysuggesionModel");

const selfhelpgroup = require("../../models/selfhelpgroupModel");
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
exports.addselfhelpgroup = async (req, res, next) => {
  try {
    var newid = 1;
    var boothid = 0;
    var wardid = 0;
    var {
      stateid,
      jilaid,
      loksabhaid,
      vidhansabhaid,
      blockid,
      zoneid,
      sectorid,
      nikayid,
    } = 0;
    if (req.body.boothid != "") {
      boothid = parseInt(req.body.boothid);
    }
    if (req.body.wardid != "") {
      wardid = parseInt(req.body.wardid);
    }
    // console.log(req.body.username);
    const user = await mobilenumber_details(req.body.username, (lang = "hi"));
    if (!user) {
      return next(new creatError("User not Found!", 404));
    }
    // const oldid = await SurveyFamily.find().sort({ _id: -1 }).limit(1);
    // const olddata = await SurveyFamily.find().sort({ $natural: -1 }).limit(2);
    // console.log("olddata is ", olddata.length);
    // if (oldid.length > 0) {
    //   newid = oldid[0].familyid + 1;
    //   // console.log("old id", oldid);
    // }
    // console.log(oldid.id);
    if (boothid > 0) {
      const booths = await Booth.findOne({ id: boothid });
      if (!booths) {
        return next(new creatError("booths not exists", 400));
      } else {
        stateid = booths.stateid;
        jilaid = booths.jila_id;
        loksabhaid = booths.loksabha_id;
        vidhansabhaid = booths.vidhansabha_id;
        blockid = booths.block_id;
        zoneid = booths.zone_id;
        sectorid = booths.sector_id;
      }
    } else {
      const wards = await Ward.findOne({ id: wardid });
      if (!wards) {
        return next(new creatError("wards not exists", 400));
      } else {
        stateid = wards.stateid;
        jilaid = wards.jila_id;
        nikayid = wards.nikay_id;
      }
    }
    // console.log(booths);
    // console.log(req.body.boothid);
    var webId = req.body.webId;

    // console.log("user details : -", user);
    const newdata = {
      userId: user[0]._id,
      groupname: req.body.groupname,
      name: req.body.name,
      father_name: req.body.father_name,
      age: req.body.age,
      mobile: req.body.mobile,
      casteid: req.body.casteid,
      remark: req.body.remark,

      stateid: stateid,
      jilaid: jilaid,
      loksabhaid: loksabhaid,
      vidhansabhaid: vidhansabhaid,
      blockid: blockid,
      sectorid: sectorid,
      zoneid: zoneid,
      nikayid: nikayid,
      wardid: wardid,
      boothid: boothid,
      entrydatetime: new Date(),
    };
    var newSurvey = [];
    if (req.body.datatype == "update") {
      const query = { familyid: req.body.webId };
      const update = { $set: newdata };
      const options = {};
      newSurvey = await selfhelpgroup.updateOne(query, update, options);
    } else {
      newSurvey = await selfhelpgroup.create(newdata);
    }

    // console.log(newSurvey._id.toString());
    // console.log(newSurvey.modifiedCount);
    if (newSurvey.modifiedCount > 0 || newSurvey._id != "") {
      res.status(201).json({
        success: true,
        status: "success",
        message: "Data Sync successful",
      });
    } else {
      res.status(200).json({
        success: false,
        status: "unsuccess",
        message: "user Not Sync successful",
      });
    }
  } catch (error) {
    next(error);
  }
};
exports.getselfhelpgroup = async (req, res, next) => {
  try {
    var fam_data = [];
    var user = [];
    var que = [];
    var counts = 0;
    const {
      lang,
      app_type,
      boothid,
      wardid,
      limit,
      skip,
    } = req.body;

    if (app_type === "nigam") {
      counts = await selfhelpgroup.countDocuments({
        wardid: wardid * 1,
      });
      user = await selfhelpgroup.aggregate([
        {
          $match: {
            wardid: wardid * 1,
          },
        },
      {
          $lookup: {
            from: "castes",
            localField: "casteid",
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
            groupname: 1,
            name: 1,
            mobile: 1,
            father_name: 1,
            age: 1,
            remark: 1,
            
            casteid: 1,
            casteData: 1,
            entrydatetime: {
              $dateToString: {
                format: "%d-%m-%Y",
                date: "$entrydatetime",
              },
            },            
          },
        },
        { $skip: parseInt(skip) },
        { $limit: parseInt(limit) },
      ]);
    } else {
      counts = await selfhelpgroup.countDocuments({
        boothid: boothid * 1,
      });
      user = await selfhelpgroup.aggregate([
        {
          $match: {
            boothid: boothid * 1,
          },
        },
        {
          $lookup: {
            from: "castes",
            localField: "casteid",
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
            groupname: 1,
            name: 1,
            mobile: 1,
            father_name: 1,
            age: 1,
            casteid: 1,
            casteData: 1,
            remark: 1,
            entrydatetime: {
              $dateToString: {
                format: "%d-%m-%Y",
                date: "$entrydatetime",
              },
            },
          },
        },
        { $skip: parseInt(skip) },
        { $limit: parseInt(limit) },
      ]);
    }

    const responseData = () => {
      res.status(200).json({
        status: "success",
        message: "Data Found successful",
        count: counts,
        data: user,
      });
    };
    responseData();

  } catch (error) {
    next(error);
  }
};
