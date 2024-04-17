import "./App.css";
import { shoppingCart } from "./data";
import { FaPlus, FaMinus } from "react-icons/fa";
import { useState, useEffect } from "react";
import Catalog from "./Catalog";

const sampleProductos = {
  id: 1,
  title: "iPhone 9",
  description: "An apple mobile which is nothing like apple",
  price: 549,
  discountPercentage: 12.96,
  rating: 4.69,
  stock: 94,
  brand: "Apple",
  category: "smartphones",
  thumbnail: "https://cdn.dummyjson.com/product-images/1/thumbnail.jpg",
  images: [
    "https://cdn.dummyjson.com/product-images/1/1.jpg",
    "https://cdn.dummyjson.com/product-images/1/2.jpg",
    "https://cdn.dummyjson.com/product-images/1/3.jpg",
    "https://cdn.dummyjson.com/product-images/1/4.jpg",
    "https://cdn.dummyjson.com/product-images/1/thumbnail.jpg",
  ],
};

function Loading() {
  return <div>Cargando....</div>;
}
function App() {
  const [catalog, setCatalog] = useState({
    products: [],
    total: 0,
    isLoading: true,
  });

  const [filter, setFilter] = useState({
    query: "",
  });
  useEffect(() => {
    let url = "https://dummyjson.com/products";
    if (filter.query) {
      url = `https://dummyjson.com/products/search?q=${filter.query}`;
    }
    setCatalog({
      ...catalog,
      isLoading: true,
    });

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setCatalog({
          ...data,
          isLoading: false,
        });
      });
  }, [filter]);

  function handelingQueryChange(e) {
    setFilter({
      query: e.target.value,
    });
  }

  return (
    <div>
      {catalog.isLoading && <Loading />}
      <Catalog
        {...catalog}
        query={filter.query}
        onQueryChange={handelingQueryChange}
      />
    </div>
  );
  // return (
  //   <div>
  //     <ShoppingCart {...shoppingCart} />
  //   </div>
  // );
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}
function calcularPromedio(lista) {
  let sum = 0;
  lista.forEach((p) => {
    sum += p.total;
  });
  return sum;
}

function ShoppingCart({
  products,
  total,
  discountedTotal,
  totalProducts,
  totalQuantity,
}) {
  const initialList = shoppingCart.products.map((item) => {
    return {
      ...item,
      total: item.price * 1,
    };
  });
  const sub = calcularPromedio(initialList);
  const [cart, setCart] = useState(initialList);
  const [subtotal, setSubtotal] = useState(sub);

  function onItemRemove(itemRemoveId) {
    setCart(cart.filter((item) => item.ide != itemRemoveId));
    setSubtotal(
      calcularPromedio(cart.filter((item) => item.ide != itemRemoveId))
    );
  }

  function onQuantityChange(itemQuantityId, newQuantity) {
    const updateCart = cart.map((p) => {
      if (p.ide == itemQuantityId) {
        return {
          ...p,
          quantity: newQuantity,
          total: newQuantity * p.price,
        };
      }
      return p;
    });
    setCart(updateCart);
    setSubtotal(calcularPromedio(updateCart));
  }

  return (
    <div>
      <h1>Shopping Cart</h1>
      <div className="layout">
        <ItemList
          products={cart}
          onItemRemove={onItemRemove}
          onQuantityChange={onQuantityChange}
        />
        <OrderSumary subtot={subtotal} />
      </div>
    </div>
  );
}
function SummaryTotal({ name, amount }) {
  return (
    <tr>
      <th>{name}</th>
      <td>{amount}</td>
    </tr>
  );
}

function OrderSumary({ subtot }) {
  return (
    <div className="order-sumary">
      <h2>Order Summary</h2>
      <table>
        <tbody>
          <SummaryTotal name="Subtotal" amount={formatCurrency(subtot)} />
        </tbody>
      </table>
    </div>
  );
}

function CountItem({ id, onQuantityChange }) {
  const [state, setValue] = useState(1);

  return (
    <div className="count-Item-container">
      <FaMinus
        onClick={() => {
          if (state > 0) {
            setValue(state - 1);
            onQuantityChange(id, state - 1);
          }
        }}
      />
      <label>{state}</label>
      <FaPlus
        onClick={() => {
          setValue(state + 1);
          onQuantityChange(id, state + 1);
        }}
      />
    </div>
  );
}
function CartItem({
  title,
  price,
  quantity,
  total,
  discountPercentage,
  discountedPrice,
  thumbnail,
  it,
  onItemRemove,
  onQuantityChange,
}) {
  return (
    <div className="cart-item-container">
      <div className="cart-item-img">
        <img src={thumbnail} />
      </div>
      <div className="cart-item-info">
        <h3>{title}</h3>
        <div className="cart-item-price">{formatCurrency(price)}</div>
        <div className="cart-item-price">{formatCurrency(total)}</div>
        <select>
          <option value="1">{quantity}</option>
        </select>
        <CountItem id={it} onQuantityChange={onQuantityChange} />
      </div>
      <div className="cart-item-remove">
        <button onClick={() => onItemRemove(it)}>X</button>
      </div>
    </div>
  );
}

function ItemList({ products, onItemRemove, onQuantityChange }) {
  return (
    <div className="item-list">
      {products.map(({ ide, ...product }) => (
        <CartItem
          key={ide}
          {...product}
          it={ide}
          onItemRemove={onItemRemove}
          onQuantityChange={onQuantityChange}
        />
      ))}
    </div>
  );
}
//THE BEST STUDENT
export default App;
