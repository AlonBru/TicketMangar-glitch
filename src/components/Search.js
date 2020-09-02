import React from 'react';

const Search = (props) => {
  const { search, placeholder, id} = props;
  return (
    <input
      id={id}
      placeholder={placeholder}
      onChange={search}
    />
  );
};
export default Search;
