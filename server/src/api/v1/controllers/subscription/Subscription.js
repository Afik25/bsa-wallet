const SubscriptionModel = require("../models/SubscriptionModel");
const PaymentModel = require("../models/PaymentModel");

module.exports = {
  async create(req, res) {
    try {
      const { student_id, code, start, end } = req.body;
    } catch (error) {
      console.log({ "catch error create abonnement ": error });
    }
  },
  async get(req, res) {},
  async getByKey(req, res) {},
  async update(req, res) {},
  async delete(req, res) {},
};
