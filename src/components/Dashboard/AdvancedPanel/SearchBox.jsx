import './SearchBox.css'

function SearchBox({ searchQuery, onSearchChange }) {
  return (
    <div className="search-box">
      <span className="search-box__label">Search</span>
      <input
        className="search-box__input"
        maxLength={1}
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="search"
      />
    </div>
  )
}

export default SearchBox
