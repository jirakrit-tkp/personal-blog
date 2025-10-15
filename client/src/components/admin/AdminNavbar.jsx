import React from 'react';
import PropTypes from 'prop-types';

const AdminNavbar = ({ title, actions }) => {
  AdminNavbar.displayName = "AdminNavbar";

  return (
    <div className="sticky top-0 z-50 bg-stone-100/95 backdrop-blur px-8 py-4 border-b-2 border-stone-300">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-stone-900">{title}</h1>
        {actions && (
          <div className="flex gap-3">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

AdminNavbar.propTypes = {
  title: PropTypes.string.isRequired,
  actions: PropTypes.node
};

export default AdminNavbar;

