const ResourceModel = require("../models/resourceModel");
const generateUniqueResourceId = require("../utils/generateUniqueResourceId");

class ResourceController {
  static async createResource(req, res) {
    try {
      const resource_id = await generateUniqueResourceId();
      const { title, description, price } = req.body;
      const file_path = `/uploads/resources/${req.file.filename}`;

      const resourceData = {
        resource_id,
        title,
        description,
        price: price || null,
        file_path,
      };

      await ResourceModel.createResource(resourceData);

      res.status(201).json({
        success: true,
        message: "Resource created successfully",
        data: resourceData,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to create resource",
        error: error.message,
      });
    }
  }

  static async getResources(req, res) {
    try {
      const { sortBy, order, price } = req.query;

      const resources = await ResourceModel.getResources({
        sortBy,
        order,
        price,
      });

      res.status(200).json({
        success: true,
        data: resources,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to retrieve resources",
        error: error.message,
      });
    }
  }
}

module.exports = ResourceController;
