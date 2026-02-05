const User = require("../../models/userModel");

const getPortfolio = async (req, res) => {
  try {
    const userId = req.params.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

  
    if (user.role !== "worker") {
      return res.status(403).json({ error: "Only workers have portfolio" });
    }

    const totalImages = user.portfolio.length;
    const totalPages = Math.ceil(totalImages / limit);

    if (page > totalPages && totalPages > 0) {
      return res.status(400).json({ error: "Page number exceeds total pages" });
    }

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const paginatedPortfolio = user.portfolio.slice(startIndex, endIndex);

    res.status(200).json({
      page,
      limit,
      totalImages,
      totalPages,
      portfolio:paginatedPortfolio,
      hasNextPage:page<totalPages,
      hasPrevPage:page>1,
    });
  } catch (err) {
    console.error("Get Portfolio Error:", err);
    res.status(500).json({ error: "Failed to fetch portfolio" });
  }
};

module.exports = getPortfolio;
