const { Products } = require("./models");

exports.GetProducts = () => {
  return Products.findAll();
};

exports.AddProduct = (productsData) => {
  return Products.create({
    ...productsData,
    created_at: Date(),
  });
};
