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
exports.getfamilysurvey = async (req, res, next) => {
  try {
    var fam_data = [];
    var user = [];
    var que = [];
    var counts = 0;
    const {
      lang,
      categoryid,
      app_type,
      boothid,
      wardid,
      limit,
      skip,
      familyid,
    } = req.body;
    let familyinew = parseInt(familyid);
    // console.log("fam", familyid);
    var matchData = {};
    if (familyid != null && familyid != "" && familyinew != 0) {
      console.log("family data");
      fam_data = await SurveyFamily.aggregate([
        {
          $match: { familyid: familyinew },
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
          $lookup: {
            from: "religions",
            localField: "religionid",
            foreignField: "id",
            as: "religionData",
            pipeline: [
              {
                $project: {
                  _id: 0,
                  id: 1,
                  religion_en: 1,
                  religion: `$religion_${lang}`,
                },
              },
            ],
          },
        },

        {
          $lookup: {
            from: "categories",
            localField: "categoryid",
            foreignField: "id",
            as: "categoryData",
            pipeline: [
              {
                $project: {
                  _id: 0,
                  id: 1,
                  category_en: 1,
                  category: `$category_${lang}`,
                },
              },
            ],
          },
        },

        {
          $lookup: {
            from: "surveyvoters",
            localField: "familyid",
            foreignField: "familyid",
            as: "voterData",
            pipeline: [

              {
                $lookup: {
                  from: "professions",
                  localField: "professionid",
                  foreignField: "id",
                  pipeline: [
                    {
                      $project: {
                        _id: 0,
                        id: 1,
                        profession_en: 1,
                        profession: `$profession_${lang}`,
                      },
                    },
                  ],
                  as: "professionData",
                },
                // { "$unwind": "$reviews.comments.author" },
                $lookup: {
                  from: "educations",
                  localField: "educationid",
                  foreignField: "id",

                  pipeline: [
                    {
                      $project: {
                        _id: 0,
                        id: 1,
                        education_en: 1,
                        education: `$education_${lang}`,
                      },
                    },
                  ],
                  as: "educationData",
                  //  as: "educationData",
                },
              },
              {
                $project: {
                  _id: 0,
                  stateid: 0,
                  loksabhaid: 0,
                  jilaid: 0,
                  vidhansabhaid: 0,
                  blockid: 0,
                  boothid: 0,
                  status: 0,

                  // id: 1,
                  // caste_en: 1,
                  // caste: `$caste_${lang}`,
                },
              },
            ],
          },
        },
        {
          $project: {
            _id: 0,
            house_no: 1,
            familyid: 1,
            religionid: 1,
            casteid: 1,
            categoryid: 1,
            total_voters_count: 1,
            out_of_voter_count: 1,
            new_voters_count: 1,
            dead_voter_count: 1,
            card_type: 1,
            economics_condition: 1,
            vehicals: 1,
            new_voter_count_field: 1,
            permanent_address: 1,
            patra_hitkari_parivar: 1,
            pralobhan_prabhivit_parivar: 1,
            // stateid: 1,
            // loksabhaid: 1,
            // jilaid: 1,
            // vidhansabhaid: 1,
            // blockid: 1,
            // boothid: 1,
            // status: 1,
            casteData: 1,
            // voterData: 1,
            religionData: 1,
            categoryData: 1,
          },
        },
      ]);
      counts = await SurveyVoter.countDocuments({
        familyid: familyinew,
      });
      user = await SurveyVoter.aggregate([
        {
          $match: {
            familyid: familyinew,
          },
        },
        {
          $addFields: {
            name: {
              $ifNull: [
                {
                  $getField: {
                    field: { $concat: ['name_', lang] },
                    input: '$$ROOT'
                  }
                },
                '$name' // Fallback to default name if missing/null
              ]
            },
            father_name: {
              $ifNull: [
                {
                  $getField: {
                    field: { $concat: ['father_name_', lang] },
                    input: '$$ROOT'
                  }
                },
                '$father_name' // Fallback to default father_name
              ]
            }
          }
        },
        {
          $lookup: {
            from: "professions",
            localField: "professionid",
            foreignField: "id",

            pipeline: [
              {
                $project: {
                  _id: 0,
                  id: 1,
                  profession_en: 1,
                  profession: `$profession_${lang}`,
                },
              },
            ],
            as: "professionData",
          },
        },
        {
          $lookup: {
            from: "educations",
            localField: "educationid",
            foreignField: "id",
            pipeline: [
              {
                $project: {
                  _id: 0,
                  id: 1,
                  education_en: 1,
                  education: `$education_${lang}`,
                },
              },
            ],
            as: "educationData",
          },
        },
        {
          $lookup: {
            from: "genders",
            localField: "gender",
            foreignField: "id",
            pipeline: [
              {
                $project: {
                  _id: 0,
                  id: 1,
                  gender_en: 1,
                  gender: `$gender_${lang}`,
                },
              },
            ],
            as: "genderData",
          },
        },
        {
          $lookup: {
            from: "parties",
            localField: "partyid",
            foreignField: "id",
            pipeline: [
              {
                $project: {
                  _id: 0,
                  id: 1,
                  party_en: 1,
                  party: `$party_${lang}`,
                },
              },
            ],
            as: "partyData",
          },
        },
        {
          $project: {
            _id: 1,
            rel: 1,
            name_en: 1,
            name: 1,
            rel_name_en: 1,
            rel_name: 1,
            mobile: 1,
            whatsapp: 1,
            education_status: 1,
            dob: 1,
            doa: 1,
            current_address: 1,
            partyid: 1,
            gender: 1,
            disable_voter: 1,
            voterid: "$voterId",
            age: 1,
            head: 1,
            page_to: 1,
            page_from: 1,
            caste_dominant: 1,
            head_of_religion: 1,
            first_time_voter: 1,
            outoftown: 1,
            out_place: 1,
            out_distanse: 1,
            booth_speaker: 1,
            support_worker: 1,
            opposite_party_worker: 1,
            entrydatetime: 1,
            age: 1,
            jankalyan_yojana: 1,
            voter_kramank_no: 1,
            educationData: 1,
            professionData: 1,
            genderData: 1,
            partyData: 1,
          },
        },
      ]);
      que = await Surveyquestion.aggregate([
        {
          $match: {
            familyid: familyinew,
          },
        },
        {
          $lookup: {
            from: "questions",
            localField: "qid",
            foreignField: "id",

            pipeline: [
              {
                $project: {
                  _id: 0,
                  id: 1,
                  question_en: 1,
                  question: `$question_${lang}`,
                },
              },
            ],
            as: "questionData",
          },
        },

        {
          $project: {
            _id: 1,
            qid: 1,
            answer: 1,
            entrydatetime: 1,
            questionData: 1,
          },
        },
      ]);
      // console.log(user);

      // fam_data[0].voters = 0;
      const responseData = () => {
        res.status(200).json({
          status: "success",
          message: "Data Found successful",
          count: counts,
          fam_data: fam_data,
          voter: user,
          questions: que,
        });
      };
      await responseData();
    } else {
      if (app_type === "nigam") {
        matchData = {
          $and: [
            {
              wardid: wardid * 1,
            },
            {
              head: 1,
            },
          ],
        };
      } else {
        matchData = {
          $and: [
            {
              boothid: boothid * 1,
            },
            {
              head: 1,
            },
          ],
        };
      }
      if (req.body.search) {
        let newobj = { $or: [{ mobile: req.body.search }, { name: { $regex: req.body.search, $options: 'i' } }] };
        matchData.$and.push(newobj);
      }
      counts = await SurveyVoter.countDocuments(matchData)
      user = await SurveyVoter.aggregate([
        {
          $match: matchData
        },
        {
        $addFields: {
          name: {
            $ifNull: [
              {
                $getField: {
                  field: { $concat: ['name_', lang] },
                  input: '$$ROOT'
                }
              },
              '$name' // Fallback to default name if missing/null
            ]
          },
          father_name: {
            $ifNull: [
              {
                $getField: {
                  field: { $concat: ['father_name_', lang] },
                  input: '$$ROOT'
                }
              },
              '$father_name' // Fallback to default father_name
            ]
          }
        }
      },
        {
          $lookup: {
            from: "surveyfamilies",
            localField: "familyid",
            foreignField: "familyid",
            as: "famData",
            pipeline: [
              {
                $project: {
                  _id: 0,
                  appoved: `$nikay_approve`,
                  userId: 1,
                },
              },
            ],
          },
        },
        {
          $project: {
            _id: 1,
            familyid: 1,
            name_en: 1,
            name: 1,
            rel_name_en: 1,
            rel_name: 1,
            famData: { $arrayElemAt: ["$famData", 0] },
            // caste: `$caste_${lang}`,
            mobile: 1,
            rel: 1,
            // rel_name: 1,
          },
        },
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

exports.addfamilysurvey = async (req, res, next) => {
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
    const oldid = await SurveyFamily.find().sort({ _id: -1 }).limit(1);
    // const olddata = await SurveyFamily.find().sort({ $natural: -1 }).limit(2);
    // console.log("olddata is ", olddata.length);
    if (oldid.length > 0) {
      newid = oldid[0].familyid + 1;
      // console.log("old id", oldid);
    }
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
    var webId = 0;
    if (req.body.datatype == "update") {
      webId = parseInt(req.body.webId);
    } else {
      webId = newid;
    }
    // console.log("user details : -", user);
    const newdata = {
      userId: user[0]._id,
      familyid: webId,
      house_no: req.body.house_no,
      religionid: req.body.religionid,
      categoryid: req.body.categoryid,
      casteid: req.body.casteid,
      total_voters_count: req.body.total_voters_count,
      dead_voter_count: req.body.dead_voter_count,
      new_voters_count: req.body.new_voters_count,
      out_of_voter_count: req.body.out_of_voter_count,
      card_type: req.body.card_type,
      economics_condition: req.body.economics_condition,
      vehicals: req.body.vehicals,
      permanent_address: req.body.permanent_address,
      pralobhan_prabhivit_parivar: req.body.pralobhan_prabhivit_parivar,
      patra_hitkari_parivar: req.body.patra_hitkari_parivar,
      new_voter_count_field: req.body.new_voter_count_field,

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
      delete newdata.userId;
      const query = { familyid: req.body.webId };
      const update = { $set: newdata };
      const options = { new: true, runValidators: true } // Options: returns updated doc & runs validation;
      newSurvey = await SurveyFamily.updateOne(query, update, options);
    } else {
      newSurvey = await SurveyFamily.create(newdata);
    }

    // voterdatav.map()
    const voterdatav = req.body.voterDtos;
    // console.log(voterdatav);
    var voterdata = [];
    voterdatav.forEach(async (element) => {
      // console.log("new -", element);
      // voterdata.push();
      var voterobj = {
        userId: user[0]._id,
        familyid: webId,
        name: element.name,
        rel: element.rel,
        rel_name: element.rel_name,
        mobile: element.mobile,
        whatsapp: element.whatsapp,
        educationid: element.educationid,
        education_status: element.education_status,
        professionid: element.professionid,
        dob: element.dob,
        doa: element.doa,
        current_address: element.current_address,
        partyid: element.partyid,
        voterId: element.voterid,
        gender: element.gender,
        disable_voter: element.disable_voter,
        age: element.age,
        head: element.head,
        page_to: element.page_to,
        page_from: element.page_from,
        outoftown: element.outoftown,
        out_place: element.out_place,
        out_distanse: element.out_distanse,
        first_time_voting: element.first_time_voting,
        caste_dominant: element.caste_dominant,
        head_of_religion: element.head_of_religion,
        booth_speaker: element.booth_speaker,
        support_worker: element.support_worker,
        opposite_party_worker: element.opposite_party_worker,
        age: element.age,
        jankalyan_yojana: element.jankalyan_yojana,
        voter_kramank_no: element.voter_kramank_no,
        // stateid: booths.stateid,
        // jilaid: booths.jila_id,
        // loksabhaid: booths.loksabha_id,
        // vidhansabhaid: booths.vidhansabha_id,
        // blockid: booths.block_id,
        // boothid: boothid,
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
      if (element.datatype == "update") {
        const querys = { _id: new mongoose.Types.ObjectId(element.webId) };
        // console.log(querys._id);
        const updates = { $set: voterobj };
        newSurvey = await SurveyVoter.updateOne(querys, updates, {});
      } else {
        const voter_result = await SurveyVoter.create(voterobj);
      }
    });
    const questiondatav = req.body.questionDtos;
    // console.log(questiondatav);
    var questiondata = [];
    questiondatav.forEach(async (elements) => {
      // console.log("new -", elements);
      // questiondata.push();
      var questionobj = {
        familyid: webId,
        answer: elements.answer,
        qid: elements.qid,

        stateid: stateid,
        jilaid: jilaid,
        loksabhaid: loksabhaid,
        vidhansabhaid: vidhansabhaid,
        blockid: blockid,
        nikayid: nikayid,
        wardid: wardid,
        boothid: boothid,
        entrydatetime: new Date(),
      };
      if (elements.datatype == "update") {
        const querys = { _id: new mongoose.Types.ObjectId(elements.webId) };
        const updates = { $set: questionobj };
        newSurvey = await Surveyquestion.updateOne(querys, updates, {});
      } else {
        const question_result = await Surveyquestion.create(questionobj);
      }
    });
    // console.log(voterdata);
    // await SurveyVoter.insertMany(voterdata);
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
exports.addboothsurvey = async (req, res, next) => {
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
    const oldid = await Surveyboothvoter.find().sort({ _id: -1 }).limit(1);
    // const olddata = await SurveyFamily.find().sort({ $natural: -1 }).limit(2);
    // console.log("olddata is ", olddata.length);
    if (oldid.length > 0) {
      newid = oldid[0].surveyid + 1;
      // console.log("old id", oldid);
    }
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
    var webId = 0;
    if (req.body.datatype == "update") {
      webId = parseInt(req.body.webId);
    } else {
      webId = newid;
    }
    // console.log("user details : -", user);
    var newSurvey = [];

    // voterdatav.map()
    const voterdatav = req.body.voterDtos;
    // console.log(voterdatav);
    var voterdata = [];
    voterdatav.forEach(async (element) => {
      // console.log("new -", element);
      // voterdata.push();
      var voterobj = {
        userId: user[0]._id,
        image: req.body.image,
        surveyid: webId,
        name: element.name,
        mobile: element.mobile,
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
      if (element.datatype == "update") {
        const querys = { _id: new mongoose.Types.ObjectId(element.webId) };
        // console.log(querys._id);
        const updates = { $set: voterobj };
        newSurvey = await Surveyboothvoter.updateOne(querys, updates, {});
      } else {
        newSurvey = await Surveyboothvoter.create(voterobj);
      }
    });
    const questiondatav = req.body.questionDtos;
    // console.log(questiondatav);
    var questiondata = [];
    questiondatav.forEach(async (elements) => {
      // console.log("new -", elements);
      // questiondata.push();
      var questionobj = {
        surveyid: webId,
        answer: elements.answer,
        qid: elements.qid,
        stateid: stateid,
        jilaid: jilaid,
        loksabhaid: loksabhaid,
        vidhansabhaid: vidhansabhaid,
        blockid: blockid,
        nikayid: nikayid,
        wardid: wardid,
        boothid: boothid,
        entrydatetime: new Date(),
      };
      if (elements.datatype == "update") {
        const querys = { _id: new mongoose.Types.ObjectId(elements.webId) };
        const updates = { $set: questionobj };
        questiondata = await Surveyboothquestion.updateOne(querys, updates, {});
      } else {
        questiondata = await Surveyboothquestion.create(questionobj);
      }
    });
    // console.log(voterdata);
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
exports.getboothsurvey = async (req, res, next) => {
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
      surveyid,
    } = req.body;
    let familyinew = parseInt(surveyid);
    // console.log("fam", surveyid);
    var matchData = {};
    if (surveyid != null && surveyid != "" && familyinew != 0) {
      console.log("family data");
      user = await Surveyboothvoter.aggregate([
        {
          $match: { surveyid: familyinew },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            mobile: 1,
            Image: 1,
            entrydatetime: 1,
          },
        },
      ]);
      que = await Surveyboothquestion.aggregate([
        {
          $match: {
            surveyid: familyinew,
          },
        },
        {
          $lookup: {
            from: "questions",
            localField: "qid",
            foreignField: "id",
            pipeline: [
              {
                $project: {
                  _id: 0,
                  id: 1,
                  question_en: 1,
                  question: `$question_${lang}`,
                },
              },
            ],
            as: "questionData",
          },
        },

        {
          $project: {
            _id: 1,
            qid: 1,
            answer: 1,
            entrydatetime: 1,
            questionData: 1,
          },
        },
      ]);
      const responseData = () => {
        res.status(200).json({
          status: "success",
          message: "Data Found successful",
          count: counts,
          booth_data: {
            surveyid: familyinew,
            image: user[0].Image,
            voter: user,
            questions: que,
          },

        });
      };
      await responseData();
    } else {
      if (app_type === "nigam") {
        matchData = {
          $and: [
            {
              wardid: wardid * 1,
            },

          ],
        };
      } else {
        matchData = {
          $and: [
            {
              boothid: boothid * 1,
            },

          ],
        };
      }
      if (req.body.search) {
        let newobj = { $or: [{ mobile: req.body.search }, { name: { $regex: req.body.search, $options: 'i' } }] };
        matchData.$and.push(newobj);
      }

      // counts = await Surveyboothvoter.countDocuments(matchData)
      // Count total groups
      const totalGroups = await Surveyboothvoter.aggregate([
        {
          $match: matchData, // Match documents based on boothid or wardid
        },
        {
          $group: {
            _id: "$surveyid", // Group by surveyid
          },
        },
        {
          $count: "totalGroups", // Count the number of groups
        },
      ]);
      user = await Surveyboothvoter.aggregate([
        {
          $match: matchData
        },
        {
          $group: {
            _id: "$surveyid",
          }
        },
        {
          $project: {
            _id: 1,
            surveyid: `$_id`
          },
        },
        { $skip: parseInt(skip) },
        { $limit: parseInt(limit) },
      ]);

      const responseData = () => {
        res.status(200).json({
          status: "success",
          message: "Data Found successful",
          count: totalGroups[0]?.totalGroups || 0, // Total groups count
          // count: counts,
          data: user,
        });
      };
      responseData();
    }
  } catch (error) {
    next(error);
  }
};
// nikay_approve
//against level name
exports.approving = async (req, res, next) => {
  try {
    const { WebId, username, status } = req.body;
    // const user = await User.findOne({ mobile: username });
    const user = await mobilenumber_details(username, (lang = "hi"));
    if (!user) {
      return next(new creatError("User not Found!", 404));
    }

    const query = { familyid: WebId };
    // const querys = { _id: new mongoose.Types.ObjectId(WebId) };
    // console.log(user[0]);
    var setvalue = {
      nikay_approve: status,
      nikay_approve_apr_by: user[0]._id,
    };

    var update = { $set: setvalue };
    const options = {};
    const result = await SurveyFamily.updateOne(query, update, options);

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

exports.addproblesurvey = async (req, res, next) => {
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
      problem: req.body.problem,
      typeid: req.body.typeid,

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
      newSurvey = await Surveyproblem.updateOne(query, update, options);
    } else {
      newSurvey = await Surveyproblem.create(newdata);
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
exports.getproblemsurvey = async (req, res, next) => {
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
      counts = await Surveyproblem.countDocuments({
        wardid: wardid * 1,
      });
      user = await Surveyproblem.aggregate([
        {
          $match: {
            wardid: wardid * 1,
          },
        },
        {
          $lookup: {
            from: "problemtypes",
            localField: "typeid",
            foreignField: "id",
            as: "problemtype",
            pipeline: [
              {
                $project: {
                  _id: 0,
                  id: 1,
                  type: `$type_${lang}`,
                  type_en: 1,
                },
              },
            ],
          },
        },
        {
          $project: {
            _id: 1,
            problem: 1,
            typeid: 1,
            entrydatetime: {
              $dateToString: {
                format: "%d-%m-%Y",
                date: "$entrydatetime",
              },
            },
            problemtype: { $arrayElemAt: ["$problemtype", 0] },
          },
        },
        { $skip: parseInt(skip) },
        { $limit: parseInt(limit) },
      ]);
    } else {
      counts = await Surveyproblem.countDocuments({
        boothid: boothid * 1,
      });
      user = await Surveyproblem.aggregate([
        {
          $match: {
            boothid: boothid * 1,
          },
        },
        {
          $lookup: {
            from: "problemtypes",
            localField: "typeid",
            foreignField: "id",
            as: "problemtype",
            pipeline: [
              {
                $project: {
                  _id: 0,
                  id: 1,
                  type: `$type_${lang}`,
                  type_en: 1,
                },
              },
            ],
          },
        },
        {
          $project: {
            _id: 1,
            problem: 1,
            typeid: 1,
            entrydatetime: {
              $dateToString: {
                format: "%d-%m-%Y",
                date: "$entrydatetime",
              },
            },
            problemtype: { $arrayElemAt: ["$problemtype", 0] },
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

exports.addsurveysuggesion = async (req, res, next) => {
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
      suggesion: req.body.suggesion,

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
      newSurvey = await Surveysuggesion.updateOne(query, update, options);
    } else {
      newSurvey = await Surveysuggesion.create(newdata);
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
exports.getsurveysuggesion = async (req, res, next) => {
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
      counts = await Surveysuggesion.countDocuments({
        wardid: wardid * 1,
      });
      user = await Surveysuggesion.aggregate([
        {
          $match: {
            wardid: wardid * 1,
          },
        },
      
        {
          $project: {
            _id: 1,
            suggesion: 1,
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
      counts = await Surveysuggesion.countDocuments({
        boothid: boothid * 1,
      });
      user = await Surveysuggesion.aggregate([
        {
          $match: {
            boothid: boothid * 1,
          },
        },
        {
          $project: {
            _id: 1,
            suggesion: 1,
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
