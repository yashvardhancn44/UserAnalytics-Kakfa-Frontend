import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
  Tooltip,
} from "recharts";

const initialProducts = [
  { id: 1, name: "Product 1", price: 10.99, buyClicks: 1, views: 2 },
  { id: 2, name: "Product 2", price: 14.99, buyClicks: 0, views: 100 },
  { id: 3, name: "Product 3", price: 19.99, buyClicks: 4, views: 8 },
  { id: 4, name: "Product 4", price: 29.99, buyClicks: 0, views: 22 },
  { id: 5, name: "Product 5", price: 39.99, buyClicks: 7, views: 11 },
  { id: 6, name: "Product 6", price: 49.99, buyClicks: 0, views: 33 },
  { id: 7, name: "Product 7", price: 59.99, buyClicks: 6, views: 9 },
  { id: 8, name: "Product 8", price: 69.99, buyClicks: 0, views: 11 },
  { id: 9, name: "Product 9", price: 79.99, buyClicks: 0, views: 10 },
];

const Dashboard = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://localhost:3000/api/products");
      const data = await response.json();
      setProducts(data);
    };
    fetchData();

    const socket = new WebSocket("ws://localhost:8080");
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.product) {
        const updateProduct = (prevProducts, updatedProduct) => {
          return prevProducts.map((prod) =>
            prod.id === updatedProduct.id ? updatedProduct : prod
          );
        };

        setProducts((prevProducts) =>
          updateProduct(prevProducts, data.product)
        );
      }
    };

    return () => {
      socket.close();
    };
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <Link to="/">Products List</Link>
      <ResponsiveContainer width="100%" height={400}>
        <CartesianGrid strokeDasharray="3 3" />
        <BarChart data={initialProducts}>
          <Bar />
          <Tooltip />
          <Legend />
          <XAxis dataKey="id" />
          <YAxis />
          <Bar dataKey="buyClicks" fill="red" />
          <Bar dataKey="views" fill="yellow" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Dashboard;
