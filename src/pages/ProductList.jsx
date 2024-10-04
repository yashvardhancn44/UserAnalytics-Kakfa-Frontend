import { useState, useRef } from "react";
import { Link } from "react-router-dom";

const initialProducts = [
  { id: 1, name: "Product 1", price: 10.99, buyClicks: 0, views: 0 },
  { id: 2, name: "Product 2", price: 14.99, buyClicks: 0, views: 0 },
  { id: 3, name: "Product 3", price: 19.99, buyClicks: 0, views: 0 },
  { id: 4, name: "Product 4", price: 29.99, buyClicks: 0, views: 0 },
  { id: 5, name: "Product 5", price: 39.99, buyClicks: 0, views: 0 },
  { id: 6, name: "Product 6", price: 49.99, buyClicks: 0, views: 0 },
  { id: 7, name: "Product 7", price: 59.99, buyClicks: 0, views: 0 },
  { id: 8, name: "Product 8", price: 69.99, buyClicks: 0, views: 0 },
  { id: 9, name: "Product 9", price: 79.99, buyClicks: 0, views: 0 },
];

const ProductList = () => {
  const [products, setProducts] = useState(initialProducts);
  const hoverStartTimers = useRef({});

  const MIN_HOVER_TIME = 3000;

  const handleBuyClick = async (id) => {
    /*
    // Initial testing setup, to update the local data. 
    const updatedProducts = products.map((product) =>
      product.id === id
        ? { ...product, buyClicks: product.buyClicks + 1 }
        : product
    );
    setProducts(updatedProducts);
    console.log(`Product ${id} buy clicked!`);
    console.log(products[id - 1]);
    */
    const timestamp = new Date().toISOString();
    const eventPayload = {
      productId: id,
      eventType: "buy-click",
      timestamp,
      userId: "yash",
    };

    const response = await fetch("http://localhost:5000/api/events/buy-click", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eventPayload),
    });
    console.log(`Product ${id} buy clicked and event sent!`);
    console.log(response);
  };

  const handleMouseEnter = (id) => {
    hoverStartTimers.current[id] = Date.now();
  };
  const handleMouseLeave = async (id) => {
    const hoverDuration = Date.now() - hoverStartTimers.current[id];
    // console.log(hoverStartTimers);

    /*
    // Initial testing setup, to update the local data. 
    if (hoverDuration >= MIN_HOVER_TIME) {
      const updatedProducts = products.map((product) =>
        product.id === id ? { ...product, views: product.views + 1 } : product
      );
      setProducts(updatedProducts);
      console.log(
        `Product ${id} viewed after ${hoverDuration / 1000} seconds!`
      );
      console.log(updatedProducts[id - 1]);
    } else {
      // console.log(
      //   `Product ${id} was passover with hover duration of ${
      //     hoverDuration / 1000
      //   } seconds`
      // );
    }
    */

    if (hoverDuration >= MIN_HOVER_TIME) {
      const timestamp = new Date().toISOString();
      const eventPayload = {
        productId: id,
        eventType: "product-view",
        timestamp,
        duration: hoverDuration / 1000,
        userId: "yash",
      };
      const response = await fetch(
        "http://localhost:5000/api/events/product-view",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(eventPayload),
        }
      );
      console.log(`Product ${id} product viewed and event sent!`);
      console.log(response);
    }
  };

  return (
    <div>
      <h1>Products</h1>
      <Link to="/dash">View Dashboard</Link>
      <ul>
        {products.map((product) => (
          <li
            style={{
              marginBottom: "20px",
              border: "1px solid #ccc",
              padding: "10px",
            }}
            key={product.id}
            onMouseEnter={() => handleMouseEnter(product.id)}
            onMouseLeave={() => handleMouseLeave(product.id)}
          >
            <div>
              <strong>{product.name}</strong> - ${product.price}
            </div>
            <button
              onClick={() => {
                handleBuyClick(product.id);
              }}
            >
              Buy
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;
