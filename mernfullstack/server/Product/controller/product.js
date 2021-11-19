var express = require('express');
var router = express.Router();
const ProductModel = require('../models/product');
const Middleware = require('../middleware/Authorization');
const Admin = require('../middleware/Admin');
const Product = [
  // {
  //   name: 'Iphone X',
  //   price: 20000,
  //   namecategory: 'iphone',
  //   image:
  //     'https://didongviet.vn/pub/media/catalog/product/i/p/iphone-x-64gb_2.jpg'
  // }
  // {
  //   name: 'Samsung galaxy A32',
  //   price: 12000,
  //   namecategory: 'samsung',
  //   image:
  //     'https://cdn.tgdd.vn/Products/Images/42/234315/samsung-galaxy-a32-4g-thumb-tim-600x600-600x600.jpg'
  // },
  // {
  //   name: 'Samsung galaxy A21',
  //   price: 2500,
  //   namecategory: 'samsung',
  //   image: 'https://hc.com.vn/i/ecommerce/media/GS.004246_FEATURE_62768.jpg'
  // }
];
class Apiproduct {
  constructor(query, querySring) {
    this.query = query;
    this.queryString = querySring;
  }
  filterting() {
    const QueObj = { ...this.queryString };
    const ExcludeProduct = ['page', 'limit', 'sort'];
    ExcludeProduct.forEach(element => {
      delete QueObj[element];
    });
    let queryStr = JSON.stringify(QueObj);
    queryStr = queryStr.replace(
      /\b(gte|gt|lt|lte|regex)\b/g,
      match => '$' + match
    );
    this.query.find(JSON.parse(queryStr));
    return this;
  }
  sort() {
    if (this.queryString.sort) {
      const Sortproduct = this.queryString.split(',').join(' ');
      this.query.sort(Sortproduct);
      // res.send(this.queryString.sort);
    } else {
      this.query.sort('-createdAt');
    }
    return this;
  }
  Pagination() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 7;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}
// tim kiem tất cả
router.get('/read', async (req, res) => {
  // ProductModel.find({}, (err, result) => {
  //   res.send(result);
  // });

  try {
    const Queryproduct = new Apiproduct(ProductModel.find(), req.query)
      .filterting()
      .sort()
      .Pagination();
    const Products = await Queryproduct.query;

    res.json(Products);
  } catch (error) {
    return res.status(500).json({ err: error.message });
  }
});
// tim kiem theo id
router.get('/detailproduct/:_id', async (req, res) => {
  try {
    const _id = req.params._id;

    const Productdetail = await ProductModel.findById(_id);
    if (!Productdetail) return res.json('Product not existed');
    // let ratingNew = Productdetail.rating;
    // let NumberReview = Productdetail.numReviews;

    // await ProductModel.findOneAndUpdate(
    //   { _id: req.params._id },
    //   {
    //     rating: ratingNew + rating,
    //     numReviews: NumberReview + 1
    //   }
    // );
    if (Productdetail) {
      res.status(200).json(Productdetail);
    }
  } catch (error) {
    res.status(500).json({ mess: error.message });
  }
});
router.patch('/UpdateRate/:_id', async (req, res) => {
  const { rating } = req.body;
  try {
    const _id = req.params._id;
    if (rating && rating !== 0) {
      const Productdetail = await ProductModel.findById(_id);
      if (!Productdetail) return res.json('Product not existed');
      let ratingNew = Productdetail.rating;
      let NumberReview = Productdetail.numReviews;

      await ProductModel.findOneAndUpdate(
        { _id: req.params._id },
        {
          rating: ratingNew + rating,
          numReviews: NumberReview + 1
        }
      );

      res
        .status(200)
        .json({ success: true, message: 'Updated rate successful' });
    }
  } catch (error) {
    res.status(500).json({ err: error.message });
  }
});
// tim kiem theo ki tự
router.get('/search', (req, res) => {
  const data = req.body.name;

  ProductModel.find({ $text: { $search: data } }, (err, result) => {
    if (err) {
      console.log(err);
    }

    res.send(result);
  });
});
// thêm sản phẩm
router.post('/addproduct', Middleware, Admin, async (req, res) => {
  const name = req.body.name;
  const price = req.body.price;
  const namecategory = req.body.namecategory;
  const image = req.body.image;

  const Addproduct = new ProductModel({
    name,
    price,
    namecategory,
    image,
    userId: req.userId
  });
  await Addproduct.save()
    .then(() => res.json('add product successfully'))
    .catch(err => res.status(400).json('Error'));
});
router.put('/update', Middleware, Admin, async (req, res) => {
  const name = req.body.name;
  const price = req.body.price;
  const namecategory = req.body.namecategory;
  const image = req.body.image;
  try {
    await ProductModel.findOneAndUpdate(
      { _id: req.body._id },
      {
        name,
        price,
        namecategory,
        image
      }
    );
    res.json({ message: 'update successfull' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post('/insert', async (req, res) => {
  const { name, price, namecategory, Images } = req.body;

  if (!name || !price || !namecategory) {
    res
      .status(400)
      .json({ success: false, mess: 'Missing enter form product' });
  }
  if (!Images) {
    res.status(400).json({ success: false, mess: 'not image' });
  }
  try {
    const Addproduct = new ProductModel({
      name,
      price,
      namecategory,
      image: Images
    });
    await Addproduct.save();
    res.status(200).json({ success: true, mess: 'add successfull' });
  } catch (error) {
    res.status(500).json({ mess: error.message });
  }
});

// them nhieu san pham
router.post('/addmany', async (req, res) => {
  await ProductModel.insertMany(Product)
    .then(function () {
      res.send('Product inserted'); // Success
    })
    .catch(function (error) {
      res.send(error); // Failure
    });
});
// xoa 1 san pham
router.delete('/deleteproduct/:id', async (req, res) => {
  await ProductModel.findByIdAndDelete(req.params.id)
    .then(() => res.json('delete product successfully'))
    .catch(err => res.status(400).json('Error'));
});
// xoa nhieu san pham
router.delete('/deletemanyproduct', async (req, res) => {
  await ProductModel.deleteMany({ price: { $gte: 12000 } })
    .then(function () {
      res.send('Many data deleted'); // Success
    })
    .catch(function (error) {
      console.log(error); // Failure
    });
});

//    { $match: { namecategory: 'samsung' } },
// đếm danh mục
router.get('/count', (req, res) => {
  ProductModel.aggregate([
    { $group: { _id: '$namecategory', total: { $sum: 1 } } }
  ])
    .then(result => {
      res.send(result);
    })
    .catch(err => {
      console.log(err);
    });
});
// chọn danh mục
router.get('/checkproduct', (req, res) => {
  const data = req.body.namecategory;
  console.log(data);
  ProductModel.aggregate([{ $match: { namecategory: data } }])
    .then(result => {
      res.send(result);
    })
    .catch(err => {
      console.log(err);
    });
});

// select document
router.post('/select', (req, res) => {
  ProductModel.aggregate([{ $project: { name: 1, price: 1 } }])
    .then(result => {
      res.send(result);
    })
    .catch(err => {
      console.log(err);
    });
});

router.post('/sum', (req, res) => {
  ProductModel.aggregate([{ $group: { _id: null, sum: { $sum: '$price' } } }])
    .then(result => {
      res.send(result);
    })
    .catch(err => {
      console.log(err);
    });
});

module.exports = router;
