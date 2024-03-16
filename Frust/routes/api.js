var express = require("express");

var router = express.Router();

const Distributor = require("../model/distributors");
const Fruits = require("../model/fruits");
const Upload=require('../public/uploads/upload');
const Transpoter=require("../public/uploads/mail");
const User=(require('../model/user'));
const JWT=require('jsonwebtoken');

const SECRETKEY="FPTPOLYTECTNIC";
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const foundUser = await User.findOne({ username, password });
    if (foundUser) {
      const token = JWT.sign({ id: foundUser.id }, SECRETKEY, { expiresIn: '1h' });
      const refresh = JWT.sign({ id: foundUser.id }, SECRETKEY, { expiresIn: '1h' });
      res.json({
        "status": 200,
        "messenger": "Đăng nhập thành công",
        "data": foundUser,
        "token": token,
        "refreshToken": refresh,
      })
    } else {
      res.json({
        "status": 400,
        "messenger": "Đăng nhập không thành công",
        "data": [],
      });
    }

  } catch (error) {
    console.log(error);
  }
});
router.post("/addDistributor", async (req, res) => {
  try {
    const data = req.body;
    const newDistributor = new Distributor({
      name: data.name,
    });
    const result = await newDistributor.save();
    if (result) {
      res.json({
        "status": 200,
        "messenger": "thêm Thành Công",
        "data": result,
      });
    } else {
      res.json({
        "status": 400,
        "messenger": "thêm Thất Bại",
        "data": [],
      });
    }
  } catch (error) {
    console.log(error);
  }
});
router.post("/regiter-send-email", Upload.single('avata'), async (req, res) => {
  try {
    const data = req.body;
    const { file } = req;
    
    const newUser = new User({
      username: data.username,
      password: data.password,
      email: data.email,
      name: data.name,
      avata: `${req.protocol}://${req.get('host')}/uploads/${file.filename}`,
     
    });
    const result = await newUser.save();
    if(result){
      const mailOption={
        from:'phungngocthong2004@gmail.com',
        to:result.email,
        subject:'Đăng ký thành công',
        text:"Cảm ơn đã đăng ký",
      };
      await Transpoter.sendMail(mailOption);
      res.status(200).json({
        "status": 200,
        "messenger": result ? "Thêm thành công" : "Thêm thất bại",
        "data": result,
      });
    } else {
      res.status(400).json({
        "status": 400,
        "messenger": "Thêm thất bại",
        "data": [],
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi máy chủ" });
  }
});
router.post("/addfruimage", Upload.array('image', 5), async (req, res) => {
  try {
    const data = req.body;
    const { files } = req;
    const urlsImage = files.map((file) => `${req.protocol}://${req.get('host')}/uploads/${file.filename}`);
    const newFruit = new Fruits({
      name: data.name,
      quantity: data.quantity,
      price: data.price,
      status: data.status,
      image: urlsImage,
      description: data.description,
      id_distributor: data.id_distributor,
    });
    const result = await newFruit.save();
    res.status(200).json({
      status: 200,
      message: result ? "Thêm thành công" : "Thêm thất bại",
      data: result || [],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi máy chủ" });
  }
});
//themfrust
router.post("/addfru", async (req, res) => {
  try {
    const data = req.body;
    const newfrust = new Fruits({
      name: data.name,
      quantity:data.quantity,
      price:data.price,
      status:data.status,
      image:data.image,
      description:data.description,
      id_distributor:data.id_distributor,
    });
    const result = await newfrust.save();
    if (result) {
      res.json({
        "status": 200,
        "messenger": "thêm Thành Công",
        "data": result,
      });
    } else {
      res.json({
        "status": 400,
        "messenger": "thêm Thất Bại",
        "data": [],
      });
    }
  } catch (error) {
    console.log(error);
  }
});

router.get("/getfru", async (req, res) => {
  try {
    const data = await Fruits.find();
    res.status(200).json({
      status: 200,
      message: "Danh sách fru",
      data: data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Lỗi không thể lấy danh sách fru." });
  }
});

router.get("/getfru/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Fruits.findById(id);
    if (!data) {
      return res.status(404).json({ error: "Không tìm thấy fru với ID đã cung cấp." });
    }
    res.status(200).json({
      status: 200,
      message: "Danh sách fru",
      data: data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Lỗi không thể lấy danh sách fru." });
  }
});
router.get("/getlistfruprice", async (req, res) => {
  try {
    const {pricestart,priceend}=req.query;
    const query={price:{$gte:pricestart,$lte:priceend}}

    const data = await Fruits.find(query,"name quantity price id_distributor")
                                            .populate('id_distributor')
                                            .sort({quantity:-1})
                                            .ship(0)
                                            .limit(2)
    res.json({
      status: 200,
      messenger: "Danh Sachs fru",
      data: data,
    });
  } catch (error) {
    console.log(error)
  }
});
router.get("/getnameAX", async (req, res) => {
  try {
  
    const query={$or:[
      {name:{$regex:"T"}},
      {name:{$regex:"X"}},
    ]}

    const data = await Fruits.find(query,"name quantity price id_distributor")
                                            .populate('id_distributor');                                       
    res.json({
      status: 200,
      messenger: "Danh Sachs fru",
      data: data,
    });
  } catch (error) {
    console.log(error)
  }
});
router.put("/updatefruid/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const updateFru=await Fruits.findById(id);
    let result=null;
    if(updateFru){
      updateFru.name=data.name??updateFru.name,
      updateFru.quantity=data.quantity??updateFru.quantity,
      updateFru.price=data.price??updateFru.price,
      updateFru.status=data.status??updateFru.status,
      updateFru.image=data.image??updateFru.image,
      updateFru.description=data.description??updateFru.description,
      updateFru.id_distributor=data.id_distributor??updateFru.id_distributor,
      result=await updateFru.save();

    }
    if (result) {
      res.json({
        "status": 200,
        'messenger': "sua Thành Công",
        "data": result,
      });
    } else {
      res.json({
        "status": 400,
        "messenger": "sua Thất Bại",
        "data": [],
      });
    }
  } catch (error) {
    console.log(error);
  }
});
router.delete("/deleteFru/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Fruits.findByIdAndDelete(id);

    if (data) {
      res.json({
        "status": 200,
        "messenger": "xoa Thanh cong",
        "data": data,
      })
    }else{
      res.json({
        "status": 400,
        "messenger": "xoa  khoong Thanh cong",
        "data": [],
      })
    }

  } catch (error) {
    console.log(error)
  }
});
module.exports = router;
