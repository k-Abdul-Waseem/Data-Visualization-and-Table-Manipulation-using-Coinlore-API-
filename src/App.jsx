import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ field: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('https://api.coinlore.net/api/tickers/');
      const jsonData = await response.json();
      setData(jsonData.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleSort = (field) => {
    const direction = sortConfig.field === field && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ field, direction });
  };

  const sortedData = () => {
    const sortableData = [...data];
    if (sortConfig.field) {
      sortableData.sort((a, b) => {
        if (a[sortConfig.field] < b[sortConfig.field]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.field] > b[sortConfig.field]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableData;
  };

  const filteredData = () => {
    return sortedData().filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toString().includes(searchQuery.toLowerCase())
    );
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData().slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <div className="App">
        <div className='search_align'>
          <input
            type="text"
            placeholder="Search by name or ID"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        <table className='box'>
          <thead>
            <tr>
              <th onClick={() => handleSort('id')}>ID {sortConfig.direction === "asc" ? <i className="fa-solid fa-arrow-up-a-z" /> : <i className="fa-solid fa-arrow-down-z-a" />}</th>
              <th onClick={() => handleSort('name')}>Name {sortConfig.direction === "asc" ? <i className="fa-solid fa-arrow-up-a-z" /> : <i className="fa-solid fa-arrow-down-z-a" />}</th>
              <th onClick={() => handleSort('rank')}>Rank {sortConfig.direction === "asc" ? <i className="fa-solid fa-arrow-up-a-z" /> : <i className="fa-solid fa-arrow-down-z-a" />}</th>
              <th onClick={() => handleSort('price_usd')}>Price (USD) {sortConfig.direction === "asc" ? <i className="fa-solid fa-arrow-up-a-z" /> : <i className="fa-solid fa-arrow-down-z-a" />}</th>
              <th onClick={() => handleSort('percent_change_24h')}>Percent Change (24h) {sortConfig.direction === "asc" ? <i className="fa-solid fa-arrow-up-a-z" /> : <i className="fa-solid fa-arrow-down-z-a" />}</th>
              <th onClick={() => handleSort('price_btc')}>Price (BTC) {sortConfig.direction === "asc" ? <i className="fa-solid fa-arrow-up-a-z" /> : <i className="fa-solid fa-arrow-down-z-a" />}</th>
              <th onClick={() => handleSort('market_cap_usd')}>Market Cap (USD) {sortConfig.direction === "asc" ? <i className="fa-solid fa-arrow-up-a-z" /> : <i className="fa-solid fa-arrow-down-z-a" />}</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map(item => (
              <tr key={item.id}>
                <td className='bold_text'>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.rank}</td>
                <td>{item.price_usd}</td>
                <td>{item.percent_change_24h}</td>
                <td>{item.price_btc}</td>
                <td>{item.market_cap_usd}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <ul className="pagination">
          {Array.from({ length: Math.ceil(filteredData().length / itemsPerPage) }, (_, i) => (
            <li key={i} className={currentPage === i + 1 ? 'active' : ''}>
              <button onClick={() => paginate(i + 1)}>{i + 1}</button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default App;