import React from 'react';
import PropTypes from 'prop-types';

const AdminNavbar = ({ title, actions }) => {
  AdminNavbar.displayName = "AdminNavbar";

  return (
    <div className="bg-stone-100 px-8 py-6 border-b-2 border-stone-300">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-stone-900">{title}</h1>
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

