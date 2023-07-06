import PropTypes from 'prop-types';
import { useRef } from 'react';

function Tab({
  name,
  active,
  setActiveTab,
  onClose,
  id,
  tabIndex,
  changeName,
}) {
  const tabRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      tabRef.current.blur();
    }
  };
  const handleDoubleClick = () => {
    tabRef.current.contentEditable = true;
    tabRef.current.focus();
    tabRef.current.addEventListener('keydown', handleKeyDown);
  };
  const hanldeBlur = () => {
    tabRef.current.contentEditable = false;
    tabRef.current.removeEventListener('keydown', handleKeyDown);
    changeName(id, tabRef.current.textContent);
  };
  return (
    <div
      className={`flex gap-2 ${
        active && 'border-b-2 border-[#ff8d03] bg-slate-300 bg-opacity-20'
      } `}
    >
      <button
        onClick={() => setActiveTab(id)}
        onDoubleClick={handleDoubleClick}
        onAuxClick={() => onClose(id)}
        className={`p-2 ${
          !active ? 'hover:bg-slate-300 hover:bg-opacity-20' : ''
        } `}
      >
        <span
          className={` ${
            name.includes('Untitled')
              ? 'text-red-500'
              : active
              ? 'text-blue-400'
              : 'text-green-400'
          } font-semibold`}
          ref={tabRef}
          onBlur={hanldeBlur}
        >
          {name}
        </span>
      </button>
      {tabIndex !== 0 ? (
        <button
          className="w-4 flex-grow-0 hover:bg-slate-300 hover:bg-opacity-20 rounded-sm"
          onClick={() => onClose(id)}
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
  onClose: PropTypes.func.isRequired,
  tabIndex: PropTypes.number.isRequired,
  id: PropTypes.string.isRequired,
  changeName: PropTypes.func.isRequired,
};

Tab.defaultProps = {
  active: false,
};

export default Tab;
