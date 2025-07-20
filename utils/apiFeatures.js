const { Types } = require("mongoose");

class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    // Handle regex for known string fields
    const regexFields = ["name", "category"]; // Add more if needed
    regexFields.forEach((field) => {
      if (typeof queryObj[field] === "string") {
        queryObj[field] = { $regex: queryObj[field], $options: "i" };
      }
    });
    if (queryObj._id) {
      if (!Types.ObjectId.isValid(queryObj._id)) {
        throw new Error("Invalid order ID format");
      }
      queryObj._id = new Types.ObjectId(queryObj._id);
    }

    // Handle advanced filtering (gte, gt, lte, lt) on nested fields
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    const parsedQuery = JSON.parse(queryStr);

    this.query = this.query.find(parsedQuery);
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.replaceAll(",", " ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.replaceAll(",", " ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }

  paginate() {
    const page = +this.queryString.page || 1;
    const limit = +this.queryString.limit || 100;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = APIFeatures;
