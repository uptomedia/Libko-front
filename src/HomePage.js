import React, { useState, useEffect } from "react";
import "./Components/ExcelTable.css";
import { BaseURL } from "./Api/Api";
import axios from "axios";
import Loading from "./Components/Loading";

function App() {
  const [data, setData] = useState([]);
  const [changeData, SetDataChanged] = useState(false);
  const [search, setSearch] = useState([]);
  const [LYD, setLYD] = useState("");
  const [LYDERR, setLYDERR] = useState(false);
  const [loading, setLoading] = useState(false);
  const [td, setTd] = useState("");

  // Get Data
  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        setLoading(true);
        await fetch(`${BaseURL}/current`)
          .then((res) => res.json())
          .then((data) => {
            setData(data);
          });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchExchangeRates();
  }, [changeData]);

  // Filed
  const handleFieldChange = (index, fieldName, value) => {
    setData((prevState) => {
      const newData = [...prevState];
      newData[index][fieldName] = value;
      setTd(value);
      return newData;
    });
  };
  // Handle Blur
  async function handleBlur(id) {
    if (td !== "") {
      setLoading(true);
      const res = await axios.post(`${BaseURL}/current/edit/${id}`, {
        increase: td,
      });
      setLoading(false);

      if (res.status === 200) {
        SetDataChanged((prev) => !prev);
      }
    }
  }
  // Handle Key Down
  function handleKeyDown(id, e) {
    if (e.key === "enter") {
      handleBlur(id);
    }
  }
  // render Data
  const filterData = data.filter((item) =>
    search.length > 0 ? item.currency.includes(search.toUpperCase()) : item
  );
  const showData = filterData.map((item, index) => (
    <tr key={index}>
      <td>{index}</td>
      <td>{item.rate}</td>
      <td>{item.currency}</td>
      <td>{item.USD_currency}</td>
      <td>
        <input
          type="text"
          value={item.increase}
          onChange={(e) => handleFieldChange(index, "increase", e.target.value)}
          onBlur={() => handleBlur(item.id)}
          onKeyDown={(e) => handleKeyDown(item.id, e)}
        />
        {item.increase}
      </td>
      <td>{item.afterIncrease}</td>
      <td>{item.LYD_currency}</td>
    </tr>
  ));

  // Handle Increase
  async function handleIncrease() {
    if (LYD === "") {
      !LYDERR && setLYDERR(true);
    } else {
      setLoading(true);
      const res = await axios.post(`${BaseURL}/current/edit`, {
        increase: LYD,
      });
      if (res.status === 200) {
        SetDataChanged((prev) => !prev);
        setLYD(false);
        setLoading(false);
      }
    }
  }
  async function handleReset() {
    setLoading(true);
    const res = await axios.get(`${BaseURL}/current/reset`);
    if (res.status === 200) {
      SetDataChanged((prev) => !prev);
      setLoading(false);
    }
  }
  return (
    <>
      {loading && <Loading />}
      <div className="container ExcelTable position-relative">
        <label htmlFor="search" className="form-label">
          Search By Rate
        </label>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="form-control"
          placeholder="search by rate"
          id="search"
        />
        <div className="d-flex align-items-end justify-content-start gap-1 mt-2">
          <div>
            <label htmlFor="LYD" className="form-label">
              Change To LYD
            </label>
            <input
              type="number"
              value={LYD}
              onChange={(e) => setLYD(e.target.value)}
              className="form-control"
              placeholder="Change To LYD"
              id="LYD"
            />
          </div>
          <button className="btn btn-primary" onClick={handleIncrease}>
            Save
          </button>
          <button className="btn btn-primary" onClick={handleReset}>
            Reset
          </button>
        </div>
        {LYDERR && LYD === "" && (
          <span className="err">The Filed Is Required</span>
        )}
        <table className="mt-2">
          <thead>
            <tr>
              <td>id</td>
              <td>rate</td>
              <td>currency</td>
              <td>USD_currency</td>
              <td>increase</td>
              <td>afterIncrease</td>
              <td>LYD_currency</td>
            </tr>
          </thead>
          <tbody>{showData}</tbody>
        </table>
      </div>
    </>
  );
}

export default App;
