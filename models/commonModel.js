const mongoose = require("mongoose");
const Booth = require("./boothModel");

const Common = {
  async getBoothByVidhansabha(vidhansabhaid) {
    // const ids = vidhansabhaid.split(",");
    return await Booth.find({ vidhansabha_id: vidhansabhaid })
      .select("id booth_en booth_mr booth_gu booth_hi booth_kn booth_kramank vidhansabhaid")
      .sort({ booth_kramank: 1 });
  },

  async getBoothByBlockId(blockId) {
    const ids = blockId.split(",");
    return await Booth.find({ blockid: { $in: ids } })
      .select("id booth_en booth_mr booth_gu booth_hindi booth_kn booth_kramank blockid")
      .sort({ booth_kramank: 1 });
  },

  async getBoothByZoneId(zoneId) {
    const ids = zoneId.split(",");
    return await Booth.find({ zoneid: { $in: ids } })
      .select("id booth_en booth_mr booth_gu booth_hindi booth_kn booth_kramank zoneid")
      .sort({ booth_kramank: 1 });
  },

  async getBoothBySectorId(sectorId) {
    const ids = sectorId.split(",");
    return await Booth.find({ sectorid: { $in: ids } })
      .select("id booth_en booth_mr booth_gu booth_hindi booth_kn booth_kramank sectorid")
      .sort({ booth_kramank: 1 });
  },

  async getBoothByBoothId(boothId) {
    // const ids = boothId.split(",");
    return await Booth.find({ id: boothId })
      .select("id booth_en booth_mr booth_gu booth_hindi booth_kn booth_kramank")
      .sort({ booth_kramank: 1 });
  },
};

module.exports = Common;
