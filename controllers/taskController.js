const UserRole = require("../models/UserroleModel");
const Booth = require("../models/boothModel");
const Block = require("../models/blockModel");
const Vidhansabha = require("../models/vidhansabhaModel");
const Jila = require("../models/jilaModel");
const Loksabha = require("../models/loksabhaModel");
const State = require("../models/stateModel");

const User = require("../models/userModel");
const Generalnews = require("../models/generalnewsModel");
const creatError = require("../utils/appError");
// const Surveyquestion = require("../models/surveyquestionModel");

exports.addnews = async (req, res, next) => {
  try {
    var newid = 1;
    var boothid = 0;
    boothid = req.body.boothid;
    const oldid = await Generalnews.find().sort({ id: -1 }).limit(1);
    // const olddata = await SurveyFamily.find().sort({ $natural: -1 }).limit(2);
    // console.log("olddata is ", olddata.length);
    if (oldid.length > 0) {
      newid = oldid[0].id + 1;
      // console.log("old id", oldid);
    }
    // console.log(oldid.id);

    const booths = await Booth.findOne({ id: boothid });
    if (!booths) {
      return next(new creatError("booths not exists", 400));
    }
    // console.log(booths);
    // console.log(req.body.boothid);
    var webId = newid;

    const newdata = {
      id: webId,
      title: req.body.title,
      desc: req.body.desc,
      attechment_type: req.body.attechment_type,
      attechment_link: req.body.attechment_link,

      stateid: booths.stateid,
      jilaid: booths.jila_id,
      loksabhaid: booths.loksabha_id,
      vidhansabhaid: booths.vidhansabha_id,
      blockid: booths.block_id,
      boothid: boothid,
      block_approve: 0,
      vidhansabha_approve: 0,
      jila_approve: 0,
      state_approve: 0,
      entrydatetime: new Date(),
    };
    var newSurvey = [];
    newSurvey = await Generalnews.create(newdata);

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
