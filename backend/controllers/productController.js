import { unlink } from "fs/promises";
import Product from "../model/Product.js";
import cloudinary from "../config/cloudinary.js";

// show all products
const getProducts = async (req, res) => {
    try {
        const products= await Product.find({});
        res.json(products);
    } catch (error) {
        res.status(500).json({messsage:'Server Error'});
    }
}

// show single product
const getProductById=async (req,res) => {
    try {
        const singleProduct=await Product.findById(req.params.id);
        if (singleProduct) {
            res.json(singleProduct);
        } else {
            res.status(404).json({message:'Product not found'});
        }
    } catch (error) {
        res.status(500).json({message:'Server Error'});
    }
}

// create product
const createProduct= async (req, res) => {
    try {
        const {name, description, price, category, stock}=req.body;
        let imageUrl='';
        if (req.file) {
            const result= await cloudinary.uploader.upload(req.file.path);
            imageUrl=result.secure_url;
            await unlink(req.file.path).catch(() => {});
        }
        const product=new Product({
            name,
            description,
            price,
            category,
            stock,
            imageUrl
        });
        const savedProduct=await product.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(500).json({message:'Server error'});
    }
}

// update the product
const updateProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;
    const product = await Product.findById(req.params.id);
    if (product) {
      product.name = name || product.name;
      product.description = description || product.description;
      product.price = price || product.price;
      product.category = category || product.category;
      product.stock = stock || product.stock;

      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path);
        product.imageUrl = result.secure_url;
        await unlink(req.file.path).catch(() => {});
      }
      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// delete product
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      await product.deleteOne();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { 
  getProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct 
};