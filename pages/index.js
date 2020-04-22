import React from "react";
import axios from "axios";
import ProductList from '../components/Index/ProductList';
import baseUrl from '../utils/baseUrl';

function Home({ products }) {
	return <ProductList products={products} />;
}

Home.getInitialProps = async ctx => {
	const page = ctx.query.page ? ctx.query.page : "1";
	const size = 6;
	const url = `${baseUrl}/api/products`;
	const payload = { params: { page, size } };
	const response = await axios.get(url, payload);
	return { products: response.data };
}

export default Home;
