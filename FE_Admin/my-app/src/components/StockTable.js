import React from 'react';
import '../components/StockTable.css';

const StockTable = () => {
  return (
    <table className="stock-table">
      <thead>
        <tr>
          <th>Number</th>
          <th>Code</th>
          <th>Company Name</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td>AAPL</td>
          <td>Apple</td>
          <td><span className="status active">Active</span></td>
        </tr>
      </tbody>
    </table>
  );
};

export default StockTable;
