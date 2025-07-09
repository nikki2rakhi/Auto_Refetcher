import { useEffect, useState } from "react";
import "./styles.css";

export default function App() {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [count, setCount] = useState(0);

  const fetchData = async () => {
    try {
      const res = await fetch("https://dummyjsn.com/products"); // ✅ correct URL
      const result = await res.json();
      setData(result.products);
      setError(""); // clear error on success
    } catch (err) {
      console.log("Fetch error:", err.message);
      setError(err.message);
    }
  };

  // Retry logic
  const fetchWithAutoRetry = async (maxRetryCount) => {
    for (let i = 1; i <= maxRetryCount; i++) {
      await fetchData();
      if (!error) {
        console.log("Success after retry:", i);
        break;
      }
      console.log("Retrying attempt", i);
      setCount(i);
      await new Promise((resolve) => setTimeout(resolve, 300)); // wait 1 sec
    }
  };

  return (
    <div className="App">
      <h1>Auto Refetcher</h1>

      <button onClick={() => fetchWithAutoRetry(5)}>Fetch with Retry</button>

      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      <p>Retry Count: {count}</p>

      {data.map((item) => (
        <h5 key={item.id}>{item.title}</h5>
      ))}
    </div>
  );
}
