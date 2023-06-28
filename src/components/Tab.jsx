import PropTypes from 'prop-types';

function Tab({ name, active, setActiveTab, close, tabIndex }) {
  return (
    <div
      className={`flex gap-2  ${
        active && 'border-b-2 border-[#ff8d03] bg-slate-300 bg-opacity-20'
      } `}
    >
      <button
        onClick={() => setActiveTab(tabIndex)}
        onAuxClick={() => close(tabIndex)}
        className={`p-2 ${
          !active && 'hover:bg-slate-300 hover:bg-opacity-20'
        } `}
      >
        <span
          className={`${
            name.includes('//')
              ? 'text-blue-500'
              : name.includes('Untitled')
              ? 'text-red-500'
              : 'text-green-400'
          } font-semibold`}
        >
          {name.length > 10 ? name.slice(0, 10) + '...' : name}
        </span>
      </button>
      {tabIndex !== 0 ? (
        <button
          className="w-4 flex-grow-0 hover:bg-slate-300 hover:bg-opacity-20 rounded-sm"
          onClick={() => close(tabIndex)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      ) : null}
    </div>
  );
}

Tab.propTypes = {
  name: PropTypes.string.isRequired,
  active: PropTypes.bool,
  setActiveTab: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
  tabIndex: PropTypes.number.isRequired,
};

Tab.defaultProps = {
  active: false,
};

export default Tab;
