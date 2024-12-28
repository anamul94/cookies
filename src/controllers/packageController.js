const DurationTypes = require("../enums/DurationTypes");
const Status = require("../enums/Status");
const Package = require("../models/Package");
const Product = require("../models/Product");
const { Op } = require("sequelize"); // Import Sequelize operators
const imagekit = require("../utils/imageKit");
const fs = require("fs");

exports.createPackage = async (req, res) => {
  console.log("createPackage", req.body);
  try {
    const {
      title,
      priceInBdt,
      priceInUsd,
      productID,
      durationType,
      durationValue,
      status,
      packageType,
    } = req.body;

    // Validate durationType against DurationTypes enum
    if (!Object.values(DurationTypes).includes(durationType)) {
      return res.status(400).json({ message: "Invalid duration type" });
    }

    // Validate status against Status enum (optional input)
    if (status && !Object.values(Status).includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Please upload a file" });
    }
    const filePath = req.file.path;
    const fileName = title + "_" + req.file.originalname;

    // Upload file to ImageKit
    let uploadedFile;
    try {
      uploadedFile = await imagekit.upload({
        file: fs.readFileSync(filePath),
        fileName: fileName,
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      return res.status(500).json({ message: "Error uploading file", error });
    } finally {
      // Clean up local file after upload
      fs.unlink(filePath, (err) => {
        if (err) console.error("Error deleting temporary file:", err);
      });
    }

    // Parse productID value
    // const parsedProductID = Array.isArray(productID)
    //   ? productID.map(id => parseInt(id))
      //   : [parseInt(productID)];
    

    // const productIDs = productID.join(",");
    const newPackage = await Package.create({
      title,
      priceInBdt,
      priceInUsd,
      productID,
      durationType,
      durationValue,
      status: status || Status.ACTIVE,
      imageId: uploadedFile.fileId,
      imageUrl: uploadedFile.url,
      packageType: packageType || PackageOrderType.REGULAR,
    });

    res
      .status(201)
      .json({ message: "Package created successfully", package: newPackage });
  } catch (error) {
    console.error("Error creating package:", error);
    res.status(500).json({ message: "Error creating package", error });
  }
};

exports.getAllPackagesWithPagination = async (req, res) => {
  console.log("getAllPackagesWithPagination", req.body);
  const { page = 1, limit = 10, title, status, packageType } = req.body;
  const offset = (page - 1) * limit;

  const where = {};
  if (title) {
    where.title = title;
  }
  if (status) {
    where.status = status;
  }
  if (packageType) {
    where.packageType = packageType;
  }

  const packages = await Package.findAll({ limit, offset, where });
  const response = {
    packages,
    totalPages: Math.ceil(packages.length / limit),
    currentPage: page,
  };
  return res.status(200).json(response);
};

// Get Plan by ID
exports.getPackageById = async (req, res) => {
  const { id } = req.params; // Extract Plan ID from the request parameters
  try {
    // Fetch the plan by its primary key
    const plan = await Package.findByPk(id);
    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }
    console.log(plan);
    const productIds = plan.productID.split(",").map(Number);
    console.log("productIds", productIds);
    // Fetch the products associated with the plan
    const products = await Product.findAll({
      where: {
        id: {
          [Op.in]: productIds, // Use Sequelize's $in operator for matching
        },
      },
      attributes: ["id", "title", "status"], // Select only id, title, and status fields
    });

    console.log("products", products);

    // Construct the response object
    const response = {
      id: plan.id,
      title: plan.title,
      priceInBdt: plan.priceInBdt,
      priceInUsd: plan.priceInUsd,
      durationType: plan.durationType,
      durationValue: plan.durationValue,
      status: plan.status,
      createdAt: plan.createdAt,
      updatedAt: plan.updatedAt,
      products, // Include the products array instead of productID
      imageId: plan.imageId,
      imageUrl: plan.imageUrl,
      packageType: plan.packageType,
    };

    // Send the response
    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching plan:", error);
    res.status(500).json({ message: "Error fetching plan", error });
  }
};

// Get Plans by Product ID
exports.getPackagesByProductId = async (req, res) => {
  const { productId } = req.params; // Extract Product ID from the request parameters
  try {
    const plans = await Package.findAll({ where: { productID: productId } }); // Find all plans associated with the Product ID
    if (!plans || plans.length === 0) {
      return res
        .status(404)
        .json({ message: "No plans found for the specified product" });
    }
    res.status(200).json(plans);
  } catch (error) {
    res.status(500).json({ message: "Error fetching plans", error });
  }
};

// Update Plan by ID
exports.updatePlan = async (req, res) => {
  console.log("updatePlan", req.body);
  const { id } = req.params; // Extract Plan ID from the request parameters
  const {
    title,
    priceInBdt,
    priceInUsd,
    productID,
    durationType,
    durationValue,
    status,
    imageUrl,
  } = req.body;

  try {
    // Find the plan by its primary key
    const plan = await Package.findByPk(id);

    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    // Update the plan with the provided data
    plan.title = title || plan.title;
    plan.priceInBdt = priceInBdt || plan.priceInBdt;
    plan.priceInUsd = priceInUsd || plan.priceInUsd;
    plan.productID = productID.join(",") || plan.productID;
    plan.durationType = durationType || plan.durationType;
    plan.durationValue = durationValue || plan.durationValue;
    plan.status = status || plan.status;
    plan.imageUrl = imageUrl || plan.imageUrl;
    // Save the updated plan
    await plan.save();

    res.status(200).json({ message: "Plan updated successfully", plan });
  } catch (error) {
    res.status(500).json({ message: "Error updating plan", error });
  }
};
