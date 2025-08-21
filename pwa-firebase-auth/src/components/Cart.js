import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../style/Cart.css";

// Icono eliminar
const DeleteIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="white"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M3 6h18v2H3V6zm2 3h14v12H5V9zm3 2v8h2v-8H8zm4 0v8h2v-8h-2z" />
  </svg>
);

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  // Cargar carrito desde localStorage y normalizar precios
  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("cartItems")) || [];
    const normalized = items.map((item) => ({
      ...item,
      precio: item.precio ?? item.price ?? 0,
      quantity: item.quantity ?? 1,
    }));
    setCartItems(normalized);
  }, []);

  // Guardar cambios en localStorage
  const saveCart = (items) => {
    localStorage.setItem("cartItems", JSON.stringify(items));
    setCartItems(items);
  };

  // Incrementar cantidad
  const increment = (index) => {
    const items = [...cartItems];
    items[index].quantity += 1;
    saveCart(items);
  };

  // Decrementar cantidad
  const decrement = (index) => {
    const items = [...cartItems];
    if (items[index].quantity > 1) {
      items[index].quantity -= 1;
      saveCart(items);
    }
  };

  // Eliminar item
  const removeItem = (index) => {
    const items = [...cartItems];
    items.splice(index, 1);
    saveCart(items);
  };

  // Calcular total
  const total = cartItems.reduce(
    (acc, item) => acc + (item.precio ?? 0) * (item.quantity ?? 1),
    0
  );

  // Ir a checkout
  const goPayment = () => {
    navigate("/Pago");
  };

  return (
    <div className="cart-container">
      <h2>Carrito de Compras</h2>
      {cartItems.length === 0 ? (
        <p className="cart-empty">Tu carrito está vacío</p>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map((item, index) => (
              <div className="cart-item" key={index}>
                <img src={item.imagen} alt={item.nombre} />
                <div className="cart-item-info">
                  <p className="cart-item-name">{item.nombre}</p>
                  <p className="cart-item-price">
                    $ {(item.precio ?? 0).toLocaleString()}
                  </p>
                </div>
                <div className="cart-item-qty">
                  <button onClick={() => decrement(index)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => increment(index)}>+</button>
                </div>
                <button className="btn-remove" onClick={() => removeItem(index)}>
                  <DeleteIcon />
                </button>
              </div>
            ))}
          </div>

          <div className="cart-footer">
            <p className="cart-total">Total: $ {total.toLocaleString()}</p>
            <button className="btn-checkout" onClick={goPayment}>
              Pagar
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
