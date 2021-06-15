
const Product = require('../models/Product')
const { ObjectId } = require('mongoose').Types;



module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  let { subcategory } = ctx.query
  if (!subcategory) {
    return next()
  }
  console.log(ObjectId.isValid(subcategory), subcategory, 'azxzxcsdca');

  if (!ObjectId.isValid(subcategory)) {
    ctx.status = 400
    ctx.body = { message: 'invalid subcategory value' }
    return
  }


  let products = await Product.find({ subcategory })
  ctx.body = { products };


};

module.exports.productList = async function productList(ctx, next) {

  let products = await Product.find()

  ctx.body = { products };
};

module.exports.productById = async function productById(ctx, next) {
  let { id } = ctx.params
  if (!id || !ObjectId.isValid(id)) {
    ctx.status = 400
    ctx.body = { message: 'invalid id value' }
    return
  }

  let product = await Product.findById(id)

  if (!product) {
    ctx.status = 404
    ctx.body = { message: 'error to get product by id' }
    return
  }

  ctx.body = { product }
};

