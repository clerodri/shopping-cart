function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}
export default function Catalog({ products, onQueryChange, query, onSearch }) {
  return (
    <table>
      <thead>
        <tr>
          <th colSpan="3">
            <input
              type=" text"
              placeholder="Search"
              value={query}
              onChange={onQueryChange}
            />
            <button onClick={onSearch}>Search</button>
          </th>
        </tr>
      </thead>
      <tbody>
        {products.map((producto) => (
          <Product key={producto.id} {...producto} />
        ))}
      </tbody>
    </table>
  );
}

function Product({ title, thumbnail, price }) {
  return (
    <tr>
      <td>
        <img width="200" src={thumbnail} alt={title} />
      </td>
      <td>{title}</td>
      <td>{formatCurrency(price)}</td>
    </tr>
  );
}
