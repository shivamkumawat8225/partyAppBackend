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

exports.usersbypost = async (req, res, next) => {
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
      roleid,
      app_type,
      datatype,
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
    roleid = parseInt(roleid);
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
            role: roleid,
          },
          {
            boothid: booth,
          },
          {
            status: "0",
          },
        ],
      };
    } else if (sector > 0) {
      matchData = {
        $and: [
          {
            role: roleid,
          },
          {
            sectorid: sector,
          },
          {
            status: "0",
          },
        ],
      };
    } else if (zone > 0) {
      matchData = {
        $and: [
          {
            role: roleid,
          },
          {
            zoneid: zone,
          },
          {
            status: "0",
          },
        ],
      };
    } else if (block > 0) {
      matchData = {
        $and: [
          {
            role: roleid,
          },
          {
            blockid: block,
          },
          {
            status: "0",
          },
        ],
      };
    } else if (vidhansabha > 0) {
      matchData = {
        $and: [
          {
            role: roleid,
          },
          {
            vidhansabhaid: vidhansabha,
          },
          {
            status: "0",
          },
        ],
      };
    } else if (ward > 0) {
      matchData = {
        $and: [
          {
            role: roleid,
          },
          {
            wardid: ward,
          },
          {
            status: "0",
          },
        ],
      };
    } else if (nikay > 0) {
      matchData = {
        $and: [
          {
            role: roleid,
          },
          {
            nikayid: nikay,
          },
          {
            status: "0",
          },
        ],
      };
    } else if (jila > 0) {
      matchData = {
        $and: [
          {
            role: roleid,
          },
          {
            jilaid: jila,
          },
          {
            status: "0",
          },
        ],
      };
    } else if (loksabha > 0) {
      matchData = {
        $and: [
          {
            role: roleid,
          },
          {
            loksabhaid: loksabha,
          },
          {
            status: "0",
          },
        ],
      };
    } else if (stateid > 0) {
      matchData = {
        $and: [
          {
            role: roleid,
          },
          {
            stateid: stateid,
          },
          {
            status: "0",
          },
        ],
      };
    }
    // national id
    // block ids
    //search
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
    const usercount = await User.countDocuments(matchData);
    user = await User.aggregate([
      {
        $match: matchData,
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
      {
        $lookup: {
          from: "professions",
          localField: "profession",
          foreignField: "id",
          as: "professionData",
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
        },
      },
      {
        $lookup: {
          from: "castes",
          localField: "caste",
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
          name_en: 1,
          name: `$name_${lang}`,
          father_name_en: 1,
          father_name: `$father_name_${lang}`,
          address: 1,
          mobile: 1,
          gender: 1,
          assign_family: 1,
          sr_start: 1,
          sr_end: 1,
          whatsapp: 1,
          caste: 1,
          profession: 1,
          patrol_team: 1,
          table_prabhari: 1,
          polling_agent: 1,
          speaker: 1,
          whatsapp_prabhari: 1,

          stateid: 1,
          loksabhaid: 1,
          vidhansabhaid: 1,
          postData: 1,
          professionData: 1,
          casteData: 1,
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
          image: 1,
        },
      },
      { $skip: parseInt(skip) },
      { $limit: parseInt(limit) },
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

exports.addvehiclesurvey = async (req, res, next) => {
  try {
    // Find user
    const user = await User.find({ mobile: req.body.username });
    // console.log("user", user);
    if (!user || user.length === 0) {
      return next(new creatError("User not Found!", 404));
    }
    // Prepare owner data
    const ownerData = {
      userId: user[0]._id,
      ownername: req.body.ownername,
      addhar_no: req.body.addhar_no,
      mobile: req.body.mobile,
      no_of_vehicles: req.body.no_of_vehicles,
      image: req.body.image,
      address: req.body.address,
      entrydatetime: new Date(),
    };
    // console.log("ownerData is", ownerData);
    let newSurvey = [];
    if (req.body.datatype == "update") {
      const query = { _id: req.body.webId };
      const update = { $set: ownerData };
      newSurvey = await VehiclesOwner.updateOne(query, update, {});
    } else {
      newSurvey = await VehiclesOwner.create(ownerData);
    }

    // Prepare vehicles array with drivers
    const vehicles = req.body.vehiclesDtos.map((vehicle) => ({
      vehicle_name: vehicle.name,
      vehicle_color: vehicle.color,
      vehicle_number: vehicle.number,
      model: vehicle.model,
      vehicles_images: vehicle.image,
      drivername: vehicle.driver_name,
      license_no: vehicle.driver_license_no,
      mobile: vehicle.driver_mobile,
      address: vehicle.driver_address,
      aadhar_card: vehicle.aadhar_card,
      // Add more vehicle fields as needed
    }));
    console.log("vehicles datas is ", vehicles);
    // Save vehicles with drivers
    for (const vehicle of vehicles) {
      const vehicleDoc = await Vehicles.create({
        ownerId: newSurvey._id || req.body.webId,
        ...vehicle,
        entrydatetime: new Date(),
      });

      // Optionally, you can push vehicleDoc._id to VehiclesOwner if you want to reference vehicles from owner
    }
    // Handle questions if needed (as in your original code)
    // ...
    res.status(201).json({
      success: true,
      status: "success",
      message: "Vehicle owner, vehicles, and drivers saved successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllVehiclesWithOwner = async (req, res, next) => {
  try {
    const { search } = req.query; // Get search string from query params

    // Build match conditions for search
    let matchStage = {};
    if (search && search.trim() !== "") {
      const regex = new RegExp(search, "i");
      matchStage = {
        $or: [
          { vehicle_number: { $regex: regex } },
          { vehicle_name: { $regex: regex } },
          { drivername: { $regex: regex } },
          { mobile: { $regex: regex } }, // driver's mobile
        ],
      };
    }
    const vehicles = await Vehicles.aggregate([
      // Search in Vehicles collection
      ...(search && search.trim() !== "" ? [{ $match: matchStage }] : []),
      // Lookup owner info
      {
        $lookup: {
          from: "vehicleowners", // collection name in MongoDB (should be lowercase and plural)
          localField: "ownerId",
          foreignField: "_id",
          as: "ownerInfo",
        },
      },
      {
        $unwind: "$ownerInfo",
      },

      // Search in owner fields if search is present
      ...(search && search.trim() !== ""
        ? [
            {
              $match: {
                $or: [
                  {
                    "ownerInfo.ownername": { $regex: new RegExp(search, "i") },
                  },
                  { "ownerInfo.mobile": { $regex: new RegExp(search, "i") } },
                ],
              },
            },
          ]
        : []),
      {
        $project: {
          _id: 1,
          vehicle_name: 1,
          vehicle_color: 1,
          vehicle_number: 1,
          model: 1,
          vehicles_images: 1,
          entrydatetime: 1,
          drivername: 1,
          mobile: 1, // driver's mobile
          ownername: "$ownerInfo.ownername",
          owner_mobile: "$ownerInfo.mobile",
          owner_image: "$ownerInfo.image",
        },
      },
    ]);
    res.status(200).json({
      success: true,
      data: vehicles,
    });
  } catch (error) {
    next(error);
  }
};
