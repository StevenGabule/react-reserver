// import products from '../../static/products.json';
import Product from '../../models/Product';
import connectDb from '../../utils/connectDb';

connectDb();

export default async (req, res) => {
	const { page, size } = req.query;
	const pageNum = Number(page);
	const pageSize = Number(size);
	let products = [];
	if (pageNum === 1) {
		products = await Product.find().limit(pageSize);
	}
	products = await Product.find();
	res.status(200).json(products);
}