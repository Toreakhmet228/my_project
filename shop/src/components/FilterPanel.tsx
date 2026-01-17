import "./FilterPanel.css";

interface Props {
  filters: {
    category: string;
    min_price: string;
    max_price: string;
    sort: string;
    order: string;
  };
  onFilterChange: (filters: Partial<Props["filters"]>) => void;
}

export default function FilterPanel({ filters, onFilterChange }: Props) {
  return (
    <div className="filter-panel">
      <h2 className="filter-title">Filters</h2>

      <div className="filter-content">
        <div className="filter-field">
          <label className="filter-label">Category</label>
          <select
            value={filters.category}
            onChange={(e) => onFilterChange({ category: e.target.value })}
            className="filter-select"
          >
            <option value="">All Categories</option>
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
            <option value="books">Books</option>
            <option value="food">Food</option>
          </select>
        </div>

        <div className="filter-field">
          <label className="filter-label">Min Price</label>
          <input
            type="number"
            value={filters.min_price}
            onChange={(e) => onFilterChange({ min_price: e.target.value })}
            placeholder="0"
            className="filter-input"
          />
        </div>

        <div className="filter-field">
          <label className="filter-label">Max Price</label>
          <input
            type="number"
            value={filters.max_price}
            onChange={(e) => onFilterChange({ max_price: e.target.value })}
            placeholder="10000"
            className="filter-input"
          />
        </div>

        <div className="filter-field">
          <label className="filter-label">Sort By</label>
          <select
            value={filters.sort}
            onChange={(e) => onFilterChange({ sort: e.target.value })}
            className="filter-select"
          >
            <option value="price">Price</option>
            <option value="name">Name</option>
          </select>
        </div>

        <div className="filter-field">
          <label className="filter-label">Order</label>
          <select
            value={filters.order}
            onChange={(e) => onFilterChange({ order: e.target.value })}
            className="filter-select"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>

        <button
          onClick={() =>
            onFilterChange({
              category: "",
              min_price: "",
              max_price: "",
              sort: "price",
              order: "asc",
            })
          }
          className="filter-clear-button"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
}
