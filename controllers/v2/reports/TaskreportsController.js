const Booth = require("../../../models/boothModel");
const Block = require("../../../models/blockModel");
const Vidhansabha = require("../../../models/vidhansabhaModel");
const Jila = require("../../../models/jilaModel");
const Loksabha = require("../../../models/loksabhaModel");
const State = require("../../../models/stateModel");
const Nikay = require("../../../models/nikayModel");
const Ward = require("../../../models/wardModel");
const Familysurvey = require("../../../models/surveyfamilyModel");

const creatError = require("../../../utils/appError");
const Surveyfamily = require("../../../models/surveyfamilyModel");
const Surveyvoter = require("../../../models/surveyvoterModel");
const Education = require("../../../models/educationModel");
const Profession = require("../../../models/professionModel");
const Party = require("../../../models/party");
const Gender = require("../../../models/genderModel");
const Task = require("../../../models/taskModel");
const Taskfeedback = require("../../../models/taskfeedbackModel");
const User = require("../../../models/userModel");
const User_role = require("../../../models/UserroleModel");
// const { all } = require("../../../routes/exportdataRoute");
async function checkstatus(userid, taskid) {
  const userIId = userid.toString();
  // console.log(userIId);
  const feedcounts = await Taskfeedback.find({
    userId: userIId,
    taskId: taskid,
  }).count();

  return feedcounts;
}
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

exports.taskfeedwise = async (req, res, next) => {
  try {
    var {
      lang,
      taskid,
      levletype,
      blockid,
      vidhansabhaid,
      loksabhaid,
      nikayid,
      wardid,
      jilaid,
      stateid,
      countryid,
      limit,
      skip,
      app_type,
    } = req.body;
    blockid = parseInt(blockid);
    nikayid = parseInt(nikayid);
    wardid = parseInt(wardid);
    vidhansabhaid = parseInt(vidhansabhaid);
    loksabhaid = parseInt(loksabhaid);
    jilaid = parseInt(jilaid);
    stateid = parseInt(stateid);

    const getTask = await Task.findOne({ _id: taskid });
    if (!getTask) {
      return next(new creatError("Task not Found!", 404));
    }
    var roleobj = {};
    var newsobj = {};
    var levelobj = {};
    // console.log("Task - ", getTask);
    if (getTask.role != 0) {
      const getRole = await User_role.findOne({ id: getTask.role });
      // console.log(getRole.level);
      if (getRole.level === "ward") {
        if (wardid > 0) {
          const warusers = await User.find({
            wardid: wardid,
            role: getTask.role,
          });
          // console.log(warusers);
          const finaluser = await Promise.all(
            warusers.map(async (levelss) => {
              const fdstatus = await checkstatus(levelss._id, taskid);
              // console.log({ us: levelss._id, task: taskid });
              return {
                id: levelss._id,
                name: levelss.name,
                father_name: levelss.father_name,
                image: levelss.image,
                feedback: fdstatus,
              };
            })
          );
          res.status(200).json({
            status: "success",
            message: "Data Found successful",
            count: 0,
            data: [],
            datauser: finaluser,
          });
          return;
        }
      }
      if (getRole.level === "ward" || getRole.level === "nikay") {
        if (nikayid > 0) {
          const warusers = await User.find({
            nikayid: nikayid,
            wardid: 0,
            role: getTask.role,
          });

          counts = await Ward.find({ nikay_id: nikayid }).count();
          data = await Ward.aggregate([
            { $match: { nikay_id: nikayid } },
            {
              $project: {
                _id: 0,
                id: 1,
                ward: `$ward_${lang}`,
                ward_en: 1,
                ward_type: 1,
              },
            },
            { $sort: { id: 1 } },
            { $skip: parseInt(skip) },
            { $limit: parseInt(limit) },
          ]);
          // console.log(data);
          var finalResult = [];
          if (getRole.level === "ward") {
            finalResult = await Promise.all(
              data.map(async (levelss) => {
                const feedcounts = await Taskfeedback.find({
                  wardid: levelss.id,
                  taskId: taskid,
                }).count();

                return {
                  id: levelss.id,
                  name_en: levelss.ward_en,
                  name: levelss.ward,
                  ward_type: levelss.ward_type,
                  feedcount: feedcounts,
                };
              })
            );
          }

          const finaluser = await Promise.all(
            warusers.map(async (levelss) => {
              const fdstatus = await checkstatus(levelss._id, taskid);
              return {
                id: levelss._id,
                name: levelss.name,
                father_name: levelss.father_name,
                image: levelss.image,
                feedback: fdstatus,
              };
            })
          );
          res.status(200).json({
            status: "success",
            message: "Data Found successful",
            count: counts,
            data: finalResult,
            datauser: finaluser,
          });
          return;
        }
      }
      if (
        getRole.level === "ward" ||
        getRole.level === "nikay" ||
        getRole.level === "jila"
      ) {
        if (jilaid > 0) {
          const warusers = await User.find({
            jilaid: jilaid,
            nikayid: 0,
            vidhansabhaid: 0,
            role: getTask.role,
          });

          counts = await Nikay.find({ jila_id: jilaid }).count();
          data = await Nikay.aggregate([
            { $match: { jila_id: jilaid } },
            {
              $project: {
                _id: 0,
                id: 1,
                nikay: `$nikay_${lang}`,
                nikay_en: 1,
                nikay_type: 1,
              },
            },
            { $sort: { id: 1 } },
            { $skip: parseInt(skip) },
            { $limit: parseInt(limit) },
          ]);
          // console.log(data);
          var finalResult = [];
          if (getRole.level === "ward" || getRole.level === "nikay") {
            finalResult = await Promise.all(
              data.map(async (levelss) => {
                const feedcounts = await Taskfeedback.find({
                  nikayid: levelss.id,
                  taskId: taskid,
                }).count();

                return {
                  id: levelss.id,
                  name_en: levelss.nikay_en,
                  name: levelss.nikay,
                  nikay_type: levelss.nikay_type,
                  feedcount: feedcounts,
                };
              })
            );
          }
          const finaluser = await Promise.all(
            warusers.map(async (levelss) => {
              const fdstatus = await checkstatus(levelss._id, taskid);

              return {
                id: levelss._id,
                name: levelss.name,
                father_name: levelss.father_name,
                image: levelss.image,
                feedback: fdstatus,
              };
            })
          );
          res.status(200).json({
            status: "success",
            message: "Data Found successful",
            count: counts,
            data: finalResult,
            datauser: finaluser,
          });
          return;
        }
      }
      if (
        getRole.level === "ward" ||
        getRole.level === "nikay" ||
        getRole.level === "jila" ||
        getRole.level === "state"
      ) {
        if (stateid > 0) {
          var lang1 = lang;
          if (lang === "hi") {
            lang1 = "hindi";
          }
          const warusers = await User.find({
            stateid: stateid,
            jilaid: 0,
            loksabhaid: 0,
            role: getTask.role,
          });

          counts = await Jila.find({ stateid: stateid }).count();
          data = await Jila.aggregate([
            { $match: { stateid: stateid } },
            {
              $project: {
                _id: 0,
                id: 1,
                jila: `$jila_${lang1}`,
                jila_en: 1,
              },
            },
            { $sort: { id: 1 } },
            { $skip: parseInt(skip) },
            { $limit: parseInt(limit) },
          ]);
          // console.log(data);
          var finalResult = [];
          if (
            getRole.level === "ward" ||
            getRole.level === "nikay" ||
            getRole.level === "jila"
          ) {
            finalResult = await Promise.all(
              data.map(async (levelss) => {
                const feedcounts = await Taskfeedback.find({
                  jilaid: levelss.id,
                  taskId: taskid,
                }).count();

                return {
                  id: levelss.id,
                  name_en: levelss.jila_en,
                  name: levelss.jila,
                  feedcount: feedcounts,
                };
              })
            );
          }
          const finaluser = await Promise.all(
            warusers.map(async (levelss) => {
              const fdstatus = await checkstatus(levelss._id, taskid);

              return {
                id: levelss._id,
                name: levelss.name,
                father_name: levelss.father_name,
                image: levelss.image,
                feedback: fdstatus,
              };
            })
          );
          res.status(200).json({
            status: "success",
            message: "Data Found successful",
            count: counts,
            data: finalResult,
            datauser: finaluser,
          });
          return;
        }
      }
      if (
        getRole.level === "ward" ||
        getRole.level === "nikay" ||
        getRole.level === "jila" ||
        getRole.level === "state" ||
        getRole.level === "national"
      ) {
        if (countryid > 0) {
          const warusers = await User.find({
            stateid: 0,
            jilaid: 0,
            loksabhaid: 0,
            role: getTask.role,
          });

          counts = await State.find({}).count();
          data = await State.aggregate([
            {
              $project: {
                _id: 0,
                id: 1,
                state: `$state_${lang}`,
                state_en: 1,
              },
            },
            { $sort: { id: 1 } },
            { $skip: parseInt(skip) },
            { $limit: parseInt(limit) },
          ]);
          // console.log(data);
          var finalResult = [];
          if (
            getRole.level === "ward" ||
            getRole.level === "nikay" ||
            getRole.level === "jila" ||
            getRole.level === "state"
          ) {
            finalResult = await Promise.all(
              data.map(async (levelss) => {
                const feedcounts = await Taskfeedback.find({
                  stateid: levelss.id,
                  taskId: taskid,
                }).count();

                return {
                  id: levelss.id,
                  name_en: levelss.state_en,
                  name: levelss.state,
                  feedcount: feedcounts,
                };
              })
            );
          }

          const finaluser = await Promise.all(
            warusers.map(async (levelss) => {
              const fdstatus = await checkstatus(levelss._id, taskid);

              return {
                id: levelss._id,
                name: levelss.name,
                father_name: levelss.father_name,
                image: levelss.image,
                feedback: fdstatus,
              };
            })
          );
          res.status(200).json({
            status: "success",
            message: "Data Found successful",
            count: counts,
            data: finalResult,
            datauser: finaluser,
          });
          return;
        } else {
          // console.log(getTask.role);
          const warusers = await User.find({
            stateid: 0,
            jilaid: 0,
            loksabhaid: 0,
            role: getTask.role,
          });
          var data = [];
          data[0] = {
            id: "1",
            country_en: "India",
            country: "भारत",
          };
          counts = 1;
          // console.log(data);
          const finalResult = await Promise.all(
            data.map(async (levelss) => {
              const feedcounts = await Taskfeedback.find({
                taskId: taskid,
              }).count();

              return {
                id: levelss.id,
                name_en: levelss.country_en,
                name: levelss.country,
                feedcount: feedcounts,
              };
            })
          );
          const finaluser = await Promise.all(
            warusers.map(async (levelss) => {
              const fdstatus = await checkstatus(levelss._id, taskid);

              return {
                id: levelss._id,
                name: levelss.name,
                father_name: levelss.father_name,
                image: levelss.image,
                feedback: fdstatus,
              };
            })
          );
          res.status(200).json({
            status: "success",
            message: "Data Found successful",
            count: counts,
            data: finalResult,
            datauser: finaluser,
          });
          return;
        }
      } else {
        res.status(200).json({
          status: "success",
          message: "User not authenticate",
          count: 0,
          data: [],
          datauser: [],
        });
        return;
      }
      // console.log("role level - ", getTask.role);
    } else {
      if (wardid > 0) {
        const warusers = await User.find({ wardid: wardid });
        // console.log(warusers);
        const finaluser = await Promise.all(
          warusers.map(async (levelss) => {
            const fdstatus = await checkstatus(levelss._id, taskid);
            // console.log({ us: levelss._id, task: taskid });

            return {
              id: levelss._id,
              name: levelss.name,
              father_name: levelss.father_name,
              image: levelss.image,
              feedback: fdstatus,
            };
          })
        );
        res.status(200).json({
          status: "success",
          message: "Data Found successful",
          count: 0,
          data: [],
          datauser: finaluser,
        });
      } else if (nikayid > 0) {
        const warusers = await User.find({ nikayid: nikayid, wardid: 0 });

        counts = await Ward.find({ nikay_id: nikayid }).count();
        data = await Ward.aggregate([
          { $match: { nikay_id: nikayid } },
          {
            $project: {
              _id: 0,
              id: 1,
              ward: `$ward_${lang}`,
              ward_en: 1,
              ward_type: 1,
            },
          },
          { $sort: { id: 1 } },
          { $skip: parseInt(skip) },
          { $limit: parseInt(limit) },
        ]);
        // console.log(data);
        const finalResult = await Promise.all(
          data.map(async (levelss) => {
            const feedcounts = await Taskfeedback.find({
              wardid: levelss.id,
              taskId: taskid,
            }).count();

            return {
              id: levelss.id,
              name_en: levelss.ward_en,
              name: levelss.ward,
              ward_type: levelss.ward_type,
              feedcount: feedcounts,
            };
          })
        );
        const finaluser = await Promise.all(
          warusers.map(async (levelss) => {
            const fdstatus = await checkstatus(levelss._id, taskid);
            return {
              id: levelss._id,
              name: levelss.name,
              father_name: levelss.father_name,
              image: levelss.image,
              feedback: fdstatus,
            };
          })
        );
        res.status(200).json({
          status: "success",
          message: "Data Found successful",
          count: counts,
          data: finalResult,
          datauser: finaluser,
        });
      } else if (jilaid > 0) {
        const warusers = await User.find({
          jilaid: jilaid,
          nikayid: 0,
          vidhansabhaid: 0,
        });

        counts = await Nikay.find({ jila_id: jilaid }).count();
        data = await Nikay.aggregate([
          { $match: { jila_id: jilaid } },
          {
            $project: {
              _id: 0,
              id: 1,
              nikay: `$nikay_${lang}`,
              nikay_en: 1,
              nikay_type: 1,
            },
          },
          { $sort: { id: 1 } },
          { $skip: parseInt(skip) },
          { $limit: parseInt(limit) },
        ]);
        // console.log(data);
        const finalResult = await Promise.all(
          data.map(async (levelss) => {
            const feedcounts = await Taskfeedback.find({
              nikayid: levelss.id,
              taskId: taskid,
            }).count();

            return {
              id: levelss.id,
              name_en: levelss.nikay_en,
              name: levelss.nikay,
              nikay_type: levelss.nikay_type,
              feedcount: feedcounts,
            };
          })
        );
        const finaluser = await Promise.all(
          warusers.map(async (levelss) => {
            const fdstatus = await checkstatus(levelss._id, taskid);

            return {
              id: levelss._id,
              name: levelss.name,
              father_name: levelss.father_name,
              image: levelss.image,
              feedback: fdstatus,
            };
          })
        );
        res.status(200).json({
          status: "success",
          message: "Data Found successful",
          count: counts,
          data: finalResult,
          datauser: finaluser,
        });
      } else if (stateid > 0) {
        var lang1 = lang;
        if (lang === "hi") {
          lang1 = "hindi";
        }
        const warusers = await User.find({
          stateid: stateid,
          jilaid: 0,
          loksabhaid: 0,
        });

        counts = await Jila.find({ stateid: stateid }).count();
        data = await Jila.aggregate([
          { $match: { stateid: stateid } },
          {
            $project: {
              _id: 0,
              id: 1,
              jila: `$jila_${lang1}`,
              jila_en: 1,
            },
          },
          { $sort: { id: 1 } },
          { $skip: parseInt(skip) },
          { $limit: parseInt(limit) },
        ]);
        // console.log(data);
        const finalResult = await Promise.all(
          data.map(async (levelss) => {
            const feedcounts = await Taskfeedback.find({
              jilaid: levelss.id,
              taskId: taskid,
            }).count();

            return {
              id: levelss.id,
              name_en: levelss.jila_en,
              name: levelss.jila,
              feedcount: feedcounts,
            };
          })
        );
        const finaluser = await Promise.all(
          warusers.map(async (levelss) => {
            const fdstatus = await checkstatus(levelss._id, taskid);

            return {
              id: levelss._id,
              name: levelss.name,
              father_name: levelss.father_name,
              image: levelss.image,
              feedback: fdstatus,
            };
          })
        );
        res.status(200).json({
          status: "success",
          message: "Data Found successful",
          count: counts,
          data: finalResult,
          datauser: finaluser,
        });
      } else if (countryid > 0) {
        const warusers = await User.find({
          stateid: 0,
          jilaid: 0,
          loksabhaid: 0,
        });

        counts = await State.find({}).count();
        data = await State.aggregate([
          {
            $project: {
              _id: 0,
              id: 1,
              state: `$state_${lang}`,
              state_en: 1,
            },
          },
          { $sort: { id: 1 } },
          { $skip: parseInt(skip) },
          { $limit: parseInt(limit) },
        ]);
        // console.log(data);
        const finalResult = await Promise.all(
          data.map(async (levelss) => {
            const feedcounts = await Taskfeedback.find({
              stateid: levelss.id,
              taskId: taskid,
            }).count();

            return {
              id: levelss.id,
              name_en: levelss.state_en,
              name: levelss.state,
              feedcount: feedcounts,
            };
          })
        );
        const finaluser = await Promise.all(
          warusers.map(async (levelss) => {
            const fdstatus = await checkstatus(levelss._id, taskid);

            return {
              id: levelss._id,
              name: levelss.name,
              father_name: levelss.father_name,
              image: levelss.image,
              feedback: fdstatus,
            };
          })
        );
        res.status(200).json({
          status: "success",
          message: "Data Found successful",
          count: counts,
          data: finalResult,
          datauser: finaluser,
        });
      } else {
        const warusers = await User.find({
          stateid: 0,
          jilaid: 0,
          loksabhaid: 0,
        });
        var data = [];
        data[0] = {
          id: "1",
          country_en: "India",
          country: "भारत",
        };
        counts = 1;
        // console.log(data);
        const finalResult = await Promise.all(
          data.map(async (levelss) => {
            const feedcounts = await Taskfeedback.find({
              taskId: taskid,
            }).count();

            return {
              id: levelss.id,
              name_en: levelss.country_en,
              name: levelss.country,
              feedcount: feedcounts,
            };
          })
        );
        const finaluser = await Promise.all(
          warusers.map(async (levelss) => {
            const fdstatus = await checkstatus(levelss._id, taskid);

            return {
              id: levelss._id,
              name: levelss.name,
              father_name: levelss.father_name,
              image: levelss.image,
              feedback: fdstatus,
            };
          })
        );
        res.status(200).json({
          status: "success",
          message: "Data Found successful",
          count: counts,
          data: finalResult,
          datauser: finaluser,
        });
      }
    }
    return;
  } catch (error) {
    console.error("Error fetching state data:", error);
    throw error;
  }
};

exports.taskuserwise = async (req, res, next) => {
  try {
    var { lang, taskid, userid, limit, skip, app_type } = req.body;

    const getTask = await Task.findOne({ _id: taskid });
    if (!getTask) {
      return next(new creatError("Task not Found!", 404));
    }
    const feedbackscount = await Taskfeedback.find({
      userId: userid,
      taskId: taskid,
    }).count();
    const feedbacks = await Taskfeedback.find(
      {
        userId: userid,
        taskId: taskid,
      },
      {
        id: 1,
        userId: 1,
        taskId: 1,
        attechment_link: 1,
        attechment_type: 1,
        feedback: 1,
        lat: 1,
        long: 1,
        entrydatetime: 1,
      }
    )
      .sort({ id: 1 })
      .skip(parseInt(skip))
      .limit(parseInt(limit));
    if (!feedbacks) {
      return next(new creatError("Task Feedback not Found!", 404));
    }
    res.status(200).json({
      status: "success",
      message: "Data Found successful",
      count: feedbackscount,
      datauser: feedbacks,
    });
    return;
  } catch (error) {
    console.error("Error fetching state data:", error);
    throw error;
  }
};
// nikay_approve
