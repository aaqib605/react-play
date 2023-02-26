import React from 'react';
import './dropsown.css';
const DropDown = ({ setype, type }) => {
  return (
    <div class="select">
      <select value={type} onChange={(e) => setype(e.target.value)}>
        <option value="restaurants">Restaurants</option>
        <option value="hotels">Hotels</option>
      </select>
    </div>
  );
};

export default DropDown;