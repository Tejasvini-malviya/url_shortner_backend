const Url = require("../models/Url");
const generateShortCode = require("../Utils/shortcode");
const { validateCustomText } = require("../Utils/validation");

exports.createShortUrl = async (req, res) => {
  try {
    const { originalUrl, customText } = req.body;
    const userId = req.user.id;

    if (!originalUrl) {
      return res.status(400).json({
        status: 400,
        message: "URL is required",
      });
    }

    // Validate custom text format if provided
    if (customText && !validateCustomText(customText)) {
      return res.status(400).json({
        status: 400,
        message: "Custom text must contain only alphanumeric characters, hyphens, or underscores",
      });
    }

    let shortCode;

    // If custom text is provided, use it (always create new)
    if (customText) {
      // Check if custom text is already in use
      const customTextExists = await Url.findOne({ where: { shortCode: customText } });
      if (customTextExists) {
        return res.status(409).json({
          status: 409,
          message: "Custom text already in use",
        });
      }
      shortCode = customText;
    } else {
      // No custom text - check if user already shortened this URL
      const existingUrlForUser = await Url.findOne({
        where: {
          originalUrl,
          userId
        }
      });

      if (existingUrlForUser) {
        // Same URL + same user + no custom text → return existing
        return res.status(200).json({
          status: 200,
          message: "URL already shortened by you",
          shortUrl: `${process.env.BASE_URL || `${req.protocol}://${req.get("host")}`}/${existingUrlForUser.shortCode}`,
          originalUrl: existingUrlForUser.originalUrl,
        });
      }

      // Generate unique random short code
      let isUnique = false;
      while (!isUnique) {
        shortCode = generateShortCode();
        const codeExists = await Url.findOne({ where: { shortCode } });
        if (!codeExists) isUnique = true;
      }
    }

    // create new URL record
    const newUrl = await Url.create({ originalUrl, shortCode, userId });

    // Prefer BASE_URL from environment, fall back to current request host
    const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get("host")}`;

    res.status(201).json({
      status: 201,
      message: "Short URL created successfully",
      shortUrl: `${baseUrl}/${newUrl.shortCode}`,
      originalUrl: newUrl.originalUrl,
    });
  } catch (error) {
    console.error("Error creating short URL:", error);
    res.status(500).json({
      status: 500,
      message: "Server error",
    });
  }
};

exports.redirectUrl = async (req, res) => {
  try {
    const { code } = req.params;

    const urlData = await Url.findOne({ where: { shortCode: code } });

    if (!urlData) {
      return res.status(404).json({
        status: 404,
        message: "URL not found",
      });
    }

    res.redirect(urlData.originalUrl);
  } catch (error) {
    console.error("Error redirecting short URL:", error);
    res.status(500).json({
      status: 500,
      message: "Server error",
    });
  }
};
