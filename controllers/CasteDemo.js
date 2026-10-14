Caste.aggregate([
  {
    $lookup: {
      from: "Category",
      localField: "categoryid",
      foreignField: "id",
      as: "categoryData",
    },
  },
  {
    $project: {
      _id: 0,
      id: 1,
      caste_en: 1,
      caste: `$caste_${lang}`,
      stateid: 1,
      categoryid: 1,
    },
  },
  { $skip: parseInt(skip) },
  { $limit: parseInt(limit) },
]);
