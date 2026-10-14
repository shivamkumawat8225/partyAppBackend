const User = require("../models/userModel");
const Category = require("../models/categoryModel");
const Religion = require("../models/religionModel");
const Education = require("../models/educationModel");
const Profession = require("../models/professionModel");
const Party = require("../models/party");
const Gender = require("../models/genderModel");
const Caste = require("../models/casteModel");
const UserRole = require("../models/UserroleModel");
const Booth = require("../models/boothModel");
const Block = require("../models/blockModel");
const Vidhansabha = require("../models/vidhansabhaModel");
const Jila = require("../models/jilaModel");
const Loksabha = require("../models/loksabhaModel");
const State = require("../models/stateModel");
const SurveyFamily = require("../models/surveyfamilyModel");
const SurveyVoter = require("../models/surveyvoterModel");
const Surveyquestion = require("../models/surveyquestionModel");
const creatError = require("../utils/appError");
// const Surveyquestion = require("../models/surveyquestionModel");

exports.getfamilysurvey = async (req, res, next) => {
  try {
    var fam_data = [];
    var user = [];
    var que = [];
    var counts = 0;
    const { lang, categoryid, boothid, limit, skip, familyid } = req.body;
    let familyinew = parseInt(familyid);
    console.log("fam", familyid);
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
      counts = await SurveyVoter.find({
        familyid: familyinew,
      }).count();
      user = await SurveyVoter.aggregate([
        {
          $match: {
            familyid: familyinew,
          },
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
            name: 1,
            rel: 1,
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
            age: 1,
            head: 1,
            page_to: 1,
            page_from: 1,
            caste_dominant: 1,
            head_of_religion: 1,
            first_time_voter: 1,
            booth_speaker: 1,
            support_worker: 1,
            opposite_party_worker: 1,
            entrydatetime: 1,
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
      counts = await SurveyVoter.find({
        boothid: boothid * 1,
        head: 1,
      }).count();
      user = await SurveyVoter.aggregate([
        {
          $match: {
            boothid: boothid * 1,
            head: 1,
          },
        },
        {
          $project: {
            _id: 1,
            familyid: 1,
            name: 1,
            // caste: `$caste_${lang}`,
            mobile: 1,
            rel: 1,
            rel_name: 1,
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
    boothid = req.body.boothid;
    const oldid = await SurveyFamily.find().sort({ _id: -1 }).limit(1);
    // const olddata = await SurveyFamily.find().sort({ $natural: -1 }).limit(2);
    // console.log("olddata is ", olddata.length);
    if (oldid.length > 0) {
      newid = oldid[0].familyid + 1;
      // console.log("old id", oldid);
    }
    // console.log(oldid.id);

    const booths = await Booth.findOne({ id: boothid });
    if (!booths) {
      return next(new creatError("booths not exists", 400));
    }
    // console.log(booths);
    // console.log(req.body.boothid);
    var webId = "";
    if (req.body.datatype == "update") {
      webId = req.body.webId;
    } else {
      webId = newid;
    }
    const newdata = {
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

      stateid: booths.stateid,
      jilaid: booths.jila_id,
      loksabhaid: booths.loksabha_id,
      vidhansabhaid: booths.vidhansabha_id,
      blockid: booths.block_id,
      boothid: boothid,
      entrydatetime: new Date(),
    };
    var newSurvey = [];
    if (req.body.datatype == "update") {
      const query = { _id: req.body.webId };
      const update = { $set: newdata };
      const options = {};
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
        voterid: element.voterid,
        gender: element.gender,
        disable_voter: element.disable_voter,
        age: element.age,
        head: element.head,
        page_to: element.page_to,
        page_from: element.page_from,
        first_time_voting: element.first_time_voting,
        caste_dominant: element.caste_dominant,
        head_of_religion: element.head_of_religion,
        booth_speaker: element.booth_speaker,
        support_worker: element.support_worker,
        opposite_party_worker: element.opposite_party_worker,

        stateid: booths.stateid,
        jilaid: booths.jila_id,
        loksabhaid: booths.loksabha_id,
        vidhansabhaid: booths.vidhansabha_id,
        blockid: booths.block_id,
        boothid: boothid,
        entrydatetime: new Date(),
      };
      if (element.datatype == "update") {
        const querys = { _id: element.webId };
        const updates = { $set: voterobj };
        newSurvey = await SurveyVoter.update(querys, updates, {});
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

        stateid: booths.stateid,
        jilaid: booths.jila_id,
        loksabhaid: booths.loksabha_id,
        vidhansabhaid: booths.vidhansabha_id,
        blockid: booths.block_id,
        boothid: boothid,
        entrydatetime: new Date(),
      };
      if (elements.datatype == "update") {
        const querys = { _id: elements.webId };
        const updates = { $set: questionobj };
        newSurvey = await Surveyquestion.update(querys, updates, {});
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
        message: "user Add successful",
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
