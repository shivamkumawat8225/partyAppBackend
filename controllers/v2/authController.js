// const translateText = require("../../googletranslate");
const translateText = require("../../translate");
const User = require("../../models/userModel");
const creatError = require("../../utils/appError");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const User_role = require("../../models/UserroleModel");
const { authenticateToken } = require("../../middilware/authMiddleware");
const Projectsetting = require("../../models/projectSettingModel");
const {
  getboothsdetailsbyvidhansabhaid,
  getboothsdetailsbyboothid,
  getsectorsdetailsbysectorid,
  getvidhansabhasdetailsbyvidhansabhaid,
  getblocksdetailsbyblockid,
  getzonesdetailsbyzoneid,
} = require("./Basics/commonController");

exports.signup = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      return next(new creatError("User Already exists", 400));
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    const newUser = await User.create({
      ...req.body,
      password: hashedPassword,
    });
    //jsonwebtoken JWT
    const token = jwt.sign({ _id: newUser._id }, "secretkey123", {
      expiresIn: "90d",
    });
    res.status(201).json({
      status: "success",
      message: "user Add successful",
      token,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        mobile: newUser.mobile,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password, lang } = req.body;
    var user = await User.findOne({
      $or: [
        {
          email: email,
        },
        {
          mobile: email,
        },
      ],
    });

    if (!user) {
      return next(new creatError("User not Found!", 404));
    }

    const rolesaccess = await User_role.findOne(
      { id: user.role },
      {
        _id: 0,
        id: 1,
        role_en: 1,
        role: `$role_${lang}`,
        level: 1,
        role_type: 1,
        app_type: 1,
        add: 1,
        delete: 1,
        edit: 1,
        view: 1,
      },
    );
    user.roles = rolesaccess;
    // if (user.role !== 4) {
    //   const isPasswordvalid = await bcrypt.compare(password, user.password);
    //   if (!isPasswordvalid) {
    //     return next(new creatError("Invalid email and password!", 401));
    //   }
    // }
    //jsonwebtoken JWT
    // const token = jwt.sign({ _id: user._id }, "secretkey123", { expiresIn: '1h' });
    const token = jwt.sign(
      { _id: user._id, username: user.name },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "3d" },
    );
    res.status(201).json({
      status: "success",
      message: "Logged In successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        father_name: user.father_name,
        address: user.address,
        mobile: user.mobile,
        email: user.email,
        role: user.role,
        addaccess: rolesaccess,
        stateid: user.stateid,
        loksabhaid: user.loksabhaid,
        jilaid: user.jilaid,
        vidhansabhaid: user.vidhansabhaid,
        blockid: user.blockid,
        sectorid: user.sectorid,
        zoneid: user.zoneid,
        nikayid: user.nikayid,
        wardid: user.wardid,
        boothid: user.boothid,
        image: user.image,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.mobilelogin = async (req, res, next) => {
  try {
    const { mobile, lang, gcmtoken } = req.body;

    const user = await User.findOne({ mobile });
    const rolesaccess = await User_role.findOne(
      { id: user.role },
      {
        _id: 0,
        id: 1,
        role_en: 1,
        role: `$role_${lang}`,
        level: 1,
        role_type: 1,
        app_type: 1,
        add: 1,
        delete: 1,
        edit: 1,
        view: 1,
      },
    );
    // console.log(rolesaccess);
    if (!user) {
      return next(new creatError("User not Found!", 404));
    }

    const otp = otpGenerator.generate(4, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });
    //jsonwebtoken JWT
    // const token = jwt.sign({ _id: user._id }, process.env.ACCESS_TOKEN_SECRET, {
    //   expiresIn: "5d",
    // });
    const token = jwt.sign(
      { _id: user._id, id: user._id, username: user.name },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "7d" },
    );
    let ip = req.body.ip_address;
    let latitude = req.body.lat;
    let longitude = req.body.long;

    const query = { mobile: mobile };
    const update = {
      $set: {
        token: token,
        gcmtoken: gcmtoken,
        latitude: latitude,
        longitude: longitude,
        ip: ip,
      },
    };
    const options = {
      upsert: true,
    };
    await User.updateOne(query, update, options);
    res.cookie("token", token, { httpOnly: true });
    res.status(201).json({
      status: "success",
      message: "Logged In successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        father_name: user.father_name,
        address: user.address,
        mobile: user.mobile,
        email: user.email,
        role: user.role,
        addaccess: rolesaccess,
        stateid: user.stateid,
        loksabhaid: user.loksabhaid,
        jilaid: user.jilaid,
        vidhansabhaid: user.vidhansabhaid,
        blockid: user.blockid,
        sectorid: user.sectorid,
        zoneid: user.zoneid,
        nikayid: user.nikayid,
        wardid: user.wardid,
        boothid: user.boothid,
        image: user.image,
        otp: otp,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.mobileuserregister = async (req, res, next) => {
  try {
    var nikayid = 0;
    var wardid = 0;
    var boothid = 0;
    var blockid = 0;
    var zoneid = 0;
    var sectorid = 0;
    var vidhansabhaid = 0;
    var loksabhaid = 0;
    var jilaid = 0;

    const users = await User.findOne({ mobile: req.body.username });
    if (!users) {
      return next(new creatError("User not exists", 400));
    }

    // console.log(req.body);
    if (req.body.wardid) {
      wardid = req.body.wardid.split(",");
    }
    if (req.body.nikayid) {
      nikayid = req.body.nikayid.split(",");
    }
    if (req.body.boothid) {
      boothid = req.body.boothid.split(",");
    }
    // console.log(boothid);
    if (req.body.blockid) {
      blockid = req.body.blockid.split(",");
    }
    if (req.body.zoneid) {
      zoneid = req.body.zoneid.split(",");
    }
    if (req.body.sectorid) {
      sectorid = req.body.sectorid.split(",");
    }
    if (req.body.vidhansabhaid) {
      vidhansabhaid = req.body.vidhansabhaid.split(",");
    }
    if (req.body.loksabhaid) {
      loksabhaid = req.body.loksabhaid.split(",");
    }
    if (req.body.jilaid) {
      jilaid = req.body.jilaid.split(",");
    }
    // var state = req.body.stateid;
    var stateid = 0;
    if (req.body.stateid) {
      stateid = req.body.stateid.split(",");
    }
    // console.log(stateid);
    // throw new Error("check state data");
    //new code here
    if (req.body.boothid) {
      const data = await getboothsdetailsbyboothid(req.body.boothid);
      boothid = data.id;
      sectorid = data.sector_id;
      zoneid = data.zone_id;
      blockid = data.block_id;
      vidhansabhaid = data.vidhansabha_id;
      loksabhaid = data.loksabha_id;
      stateid = data.stateid;
      jilaid = data.jila_id;
    }else if (req.body.sectorid) {
      const data = await getsectorsdetailsbysectorid(req.body.sectorid);
      boothid = 0;
      sectorid = data.id;
      zoneid = data.zone_id;
      blockid = data.block_id;
      vidhansabhaid = data.vidhansabha_id;
      loksabhaid = data.loksabha_id;
      stateid = data.stateid;
      jilaid = data.jila_id;
    }else if (req.body.zoneid) {
      const data = await getzonesdetailsbyzoneid(req.body.zoneid);
      boothid = 0;
      sectorid = 0;
      zoneid = data.id;
      blockid = data.block_id;
      vidhansabhaid = data.vidhansabha_id;
      loksabhaid = data.loksabha_id;
      stateid = data.stateid;
      jilaid = data.jila_id;
    }else if (req.body.blockid) {
      const data = await getblocksdetailsbyblockid(req.body.blockid);
      boothid = 0;
      sectorid = 0;
      zoneid = 0;
      blockid = data.id;
      vidhansabhaid = data.vidhansabha_id;
      loksabhaid = data.loksabha_id;
      stateid = data.stateid;
      jilaid = data.jila_id;
    
    }else if (req.body.vidhansabhaid) {
      const data = await getvidhansabhasdetailsbyvidhansabhaid(req.body.vidhansabhaid);
      boothid = 0;
      sectorid = 0;
      zoneid = 0;
      blockid = 0;
      vidhansabhaid = req.body.vidhansabhaid;
      loksabhaid = data.loksabha_id;
      stateid = data.stateid;
      jilaid = data.jila_id;
    }
    // res.status(200).json({
    //   datais: {
    //     boothid,
    //     zoneid,
    //     sectorid,
    //     blockid,
    //     vidhansabhaid,
    //     loksabhaid,
    //     jilaid,stateid
    //   },
    // });

    //new code here

    let translatedTexten = "";
    let translatedTextas = "";
    let translatedTexthi = "";
    let translatedTextgu = "";
    let translatedTextfatheren = "";
    let translatedTextfatheras = "";
    let translatedTextfatherhi = "";
    let translatedTextfathergu = "";
    let translateOn = true;
    if (translateOn === true) {
      if (req.body.name) {
        if (req.body.lang == "en") {
          translatedTexten = req.body.name;
        } else {
          translatedTexten = await translateText(
            req.body.name,
            req.body.lang,
            "en",
          );
        }
        // if (req.body.lang == "as") {
        //   translatedTextas = req.body.name;
        // } else {
        //   translatedTextas = await translateText(
        //     req.body.name,
        //     req.body.lang,
        //     "as",
        //   );
        // }

        if (req.body.lang == "hi") {
          translatedTexthi = req.body.name;
        } else {
          translatedTexthi = await translateText(
            req.body.name,
            req.body.lang,
            "hi",
          );
        }

        if (req.body.lang == "gu") {
          translatedTextgu = req.body.name;
        } else {
          translatedTextgu = await translateText(
            req.body.name,
            req.body.lang,
            "gu",
          );
        }
      }

      if (req.body.father_name) {
        if (req.body.lang == "en") {
          translatedTextfatheren = req.body.father_name;
        } else {
          translatedTextfatheren = await translateText(
            req.body.father_name,
            req.body.lang,
            "en",
          );
        }
        // if (req.body.lang == "as") {
        //   translatedTextfatheras = req.body.father_name;
        // } else {
        //   translatedTextfatheras = await translateText(
        //     req.body.father_name,
        //     req.body.lang,
        //     "as",
        //   );
        // }
        if (req.body.lang == "hi") {
          translatedTextfatherhi = req.body.father_name;
        } else {
          translatedTextfatherhi = await translateText(
            req.body.father_name,
            req.body.lang,
            "hi",
          );
        }
        if (req.body.lang == "gu") {
          translatedTextfathergu = req.body.father_name;
        } else {
          translatedTextfathergu = await translateText(
            req.body.father_name,
            req.body.lang,
            "gu",
          );
        }
      }
    } else {
      translatedTexten = req.body.name;
      translatedTextas = req.body.name;
      translatedTexthi = req.body.name;
      translatedTextgu = req.body.name;
      translatedTextfatheren = req.body.father_name;
      translatedTextfatheras = req.body.father_name;
      translatedTextfatherhi = req.body.father_name;
      translatedTextfathergu = req.body.father_name;
    }
    if (req.body.whatsapp_prabhari === undefined || req.body.whatsapp_prabhari === null) {
      req.body.whatsapp_prabhari = 0;
    }
    // console.log("name_gu", translatedTextgu);
    const newuserdata = {
      userId: users._id,
      name: req.body.name,
      name_en: translatedTexten,
      name_hi: translatedTexthi,
      // name_as: translatedTextas,
      name_gu: translatedTextgu,
      father_name: req.body.father_name,
      father_name_en: translatedTextfatheren,
      father_name_hi: translatedTextfatherhi,
      // father_name_as: translatedTextfatheras,
      father_name_gu: translatedTextfathergu,
      address: req.body.address,
      mobile: req.body.mobile,
      role: req.body.role,
      age: req.body.age,
      gender: req.body.gender,
      image: req.body.image,
      assign_family: req.body.assign_family,
      sr_start: req.body.sr_start,
      sr_end: req.body.sr_end,
      whatsapp: req.body.whatsapp,
      caste: req.body.caste,
      profession: req.body.profession,
      patrol_team: req.body.patrol_team,
      table_prabhari: req.body.table_prabhari,
      polling_agent: req.body.polling_agent,
      speaker: req.body.speaker,
      // whatsapp_prabhari: req.body.whatsapp_prabhari,
      narajReason: req.body.narajReason,
      stateid: stateid,
      jilaid: jilaid,
      loksabhaid: loksabhaid,
      vidhansabhaid: vidhansabhaid,
      blockid: blockid,
      zoneid: zoneid,
      sectorid: sectorid,
      boothid: boothid,
      nikayid: nikayid,
      wardid: wardid,
      entrydatetime: new Date(),
    };
    var newUser = [];
    if (req.body.datatype == "update") {
      const query = { _id: req.body.webId };
      const update = { $set: newuserdata };
      const options = { upsert: true };
      newUser = await User.updateOne(query, update);
    } else {
      const user = await User.findOne({ mobile: req.body.mobile });
      if (user) {
        return next(new creatError("User Already exists", 400));
      }
      newUser = await User.create(newuserdata);
    }
    // console.log(newUser);
    // console.log(newUser.modifiedCount);
    if (newUser.modifiedCount > 0 || newUser._id != "") {
      res.status(201).json({
        success: true,
        status: "success",
        message: "user Add successful",
        user: {
          // _id: newUser._id,
          name: newUser.name,
          father_name: newUser.father_name,
          mobile: newUser.mobile,
          role: newUser.role,
          gender: newUser.gender,
          assign_family: newUser.assign_family,
          image: newUser.image,
        },
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
exports.getBasicDetails = async (req, res, next) => {
  try {
    const data = await Projectsetting.findOne({});
    if (data) {
      res.status(201).json({
        success: true,
        status: "success",
        message: "Find successful",
        data: data,
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
