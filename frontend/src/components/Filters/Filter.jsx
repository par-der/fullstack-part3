import React from 'react';

const Filter = ({ filterName, handleFilterChange }) => {
    return (
        <form>
            <div>
                filter shown with
                <input
                    value={filterName}
                    onChange={handleFilterChange}
                />
            </div>
        </form>
    );
};

export default Filter;