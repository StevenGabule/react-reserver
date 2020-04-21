import React from 'react';
import axios from 'axios';
import baseUrl from '../utils/baseUrl';
import catchErrors from '../utils/catchErrors';

import {
  Form,
  Input,
  TextArea,
  Button,
  Image,
  Message,
  Header,
  Icon
} from 'semantic-ui-react';
const INITIAL_PRODUCT = {
  name: "",
  price: "",
  media: "",
  description: ""
};

function CreateProduct() {
  const [product, setProduct] = React.useState(INITIAL_PRODUCT);
  const [mediaPreview, setMediaPreview] = React.useState('');
  const [success, setSuccess] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [disabled, setDisabled] = React.useState(true);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    const isProduct = Object.values(product).every(el => Boolean(el));
    isProduct ? setDisabled(false) : setDisabled(true);
  }, [product]);

  function handleChange(e) {
    const { name, value, files } = e.target;
    if (name === 'media') {
      setProduct(prevState => ({ ...prevState, media: files[0] }));
      setMediaPreview(window.URL.createObjectURL(files[0]));
    } else {
      setProduct(prevState => ({ ...prevState, [name]: value })); // computed property
    }
  }

  async function handleImageUpload() {
    const data = new FormData();
    data.append("file", product.media);
    data.append("tags", "Testing 1");
    data.append("upload_preset", "rbtszywo");
    data.append("api_key", process.env.CLOUDINARY_API_KEY);
    data.append("timestamp", (Date.now() / 1000) | 0);
    const response = await axios.post(process.env.CLOUDINARY_URL, data);
    const mediaUrl = response.data.url;
    return mediaUrl;
  }

  async function handleSubmit(e) {
    try {
      e.preventDefault();
      setLoading(true);
      setError('');
      const mediaUrl = await handleImageUpload();
      const url = `${baseUrl}/api/product`;
      const { name, price, description } = product;
      const payload = { name, price, description, mediaUrl };
      const response = await axios.post(url, payload);
      console.log({ response });
      setProduct(INITIAL_PRODUCT);
      setSuccess(true);
    } catch (err) {
      catchErrors(err, setError);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Header as="h2" block>
        <Icon name="add" color="orange" />
  			Create New Product
  		</Header>
      <Form loading={loading} success={success} error={Boolean(error)} onSubmit={handleSubmit}>
      <Message
          error
          header="Oops!"
          content={error} 
        />
        <Message
          success
          icon="check"
          header="Success!"
          content="Your product has been posted!"
        />
        <Form.Group widths="equal">

          <Form.Field
            control={Input}
            name="name"
            label="Name"
            placeholder="Name"
            value={product.name}
            onChange={handleChange} />

          <Form.Field
            control={Input}
            type="number"
            name="price"
            label="Price"
            value={product.price}
            onChange={handleChange}
            placeholder="Price"
            min="0.00"
            step="0.01" />

          <Form.Field
            control={Input}
            name="media"
            type="file"
            label="Media"
            onChange={handleChange}
            accept="image/*" content="Select Image" />

        </Form.Group>

        <Image src={mediaPreview} rounded centered size="small" />

        <Form.Field
          control={TextArea}
          value={product.description}
          onChange={handleChange}
          name="description"
          label="Description"
          placeholder="Description" />

        <Form.Field
          control={Button}
          color="blue"
          icon="pencil alternate"
          content="submit"
          disabled={disabled || loading}
          type="submit" />

      </Form>
    </>
  );
}

export default CreateProduct;
