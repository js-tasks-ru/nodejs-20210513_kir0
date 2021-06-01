
const Product = require('../models/Product')
const { ObjectId } = require('mongoose').Types;



module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  let { subcategory } = ctx.request.query
  if (!subcategory) {
    next()
  }
  if (!ObjectId.isValid(subcategory)) {
    ctx.status = 400
    ctx.body = { message: 'invalid subcategory value' }
    return
  }


  let products = await Product.find({ subcategory })
  ctx.body = { products };


};

module.exports.productList = async function productList(ctx, next) {

  let products = await Product.find({})

  ctx.body = { products };
};

module.exports.productById = async function productById(ctx, next) {



  let { id: _id } = ctx.params
  if (!_id) {
    ctx.status = 500
    ctx.body = { message: 'empty param id' }
    return
  }
  if (!ObjectId.isValid(_id)) {
    ctx.status = 400
    ctx.body = { message: 'invalid id value' }
    return
  }
  Product.exists({ _id }, async (err, isExist) => {
    if (err || !isExist) {
      ctx.status = 404
      ctx.body = { message: 'Not Found' }
      return
    }
    let product = await Product.find({ _id })
    ctx.body({ product })
  })


};

