import styles from './Checkout.module.css';
import { LoadingIcon } from './Icons';
import { getProducts } from './dataService';
import { useEffect, useMemo, useState } from 'react';

const Product = ({
  id,
  name,
  availableCount,
  price,
  orderedQuantity,
  total,
  updateQuantity,
}) => {
  return (
    <tr>
      <td>{id}</td>
      <td>{name}</td>
      <td>{availableCount}</td>
      <td>${price}</td>
      <td>{orderedQuantity}</td>
      <td>${total}</td>
      <td>
        <button
          className={styles.actionButton}
          onClick={() => updateQuantity(id, 'inc')}
          disabled={number > availableCount + -1}
        >
          +
        </button>
        <button
          className={styles.actionButton}
          disabled={number === 0}
          onClick={() => updateQuantity(id, 'desc')}
        >
          -
        </button>
      </td>
    </tr>
  );
};

const Checkout = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchProducts = async () => {
    try {
      const response = await getProducts();
      const products = response.map((item) => {
        return {
          ...item,
          orderedQuantity: 0,
        };
      });
      setProducts(products);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, []);

  const total = useMemo(() => {
    return products.reduce((acc, cur) => {
      return acc + cur.total;
    }, 0);
  }, [products]);

  const updateQuantity = (id, type) => {
    const newProducts = [...products];
    const product = newProducts.find((p) => p.id === id);
    if (type === 'add') {
      product.orderedQuantity++;
    } else {
      product.orderedQuantity--;
    }
    product.total = product.orderedQuantity * product.price;
    setProducts(newProducts);
  };
  return (
    <div>
      <header className={styles.header}>
        <h1>Electro World</h1>
      </header>
      <main>
        {loading && <LoadingIcon />}
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Product ID</th>
              <th>Product Name</th>
              <th># Available</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <Product
                key={`products-${index}`}
                {...product}
                updateQuantity={updateQuantity}
              />
            ))}
          </tbody>
        </table>
        <h2>Order summary</h2>
        <p>Discount: $ </p>
        <p>Total: $ {total}</p>
      </main>
    </div>
  );
};

export default Checkout;
