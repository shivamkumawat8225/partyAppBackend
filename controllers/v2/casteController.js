const User = require("../../models/userModel");
const Caste = require("../../models/casteModel");
const creatError = require("../../utils/appError");

exports.addCaste = async (req, res, next) => {
  try {
    const oldid = await Caste.findOne().sort({ _id: -1 }).limit(1);
    // console.log(oldid);
    // console.log(oldid.id);
    const newid = oldid.id + 1;
    const casteData = {
      categoryid: req.body.categoryid,
      id: newid,
      stateid: req.body.stateid,
      caste_hi: req.body.caste,
      caste_en: req.body.caste,
      caste_kn: req.body.caste,
      caste_gu: req.body.caste,
      caste_mr: req.body.caste,
      caste_ml: req.body.caste,
      caste_pu: req.body.caste,
      caste_bn: req.body.caste,
      caste_te: req.body.caste,
      caste_ta: req.body.caste,
      caste_or: req.body.caste,
      caste_lus: req.body.caste,
      caste_as: req.body.caste,
      caste_doi: req.body.caste,
      status: 1,
    };
    var casteResponse = [];

    casteResponse = await Caste.create(casteData);

    // console.log(casteResponse);
    // console.log(casteResponse.modifiedCount);
    if (casteResponse.modifiedCount > 0 || casteResponse._id != "") {
      res.status(201).json({
        success: true,
        status: "success",
        message: "Caste Add successful",
        user: casteResponse,
      });
    } else {
      res.status(200).json({
        success: false,
        status: "unsuccess",
        message: "Caste Not Sync successful",
      });
    }
  } catch (error) {
    next(error);
  }
};
