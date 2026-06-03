import React from 'react';

const ProfileInfoCard = ({
  label,
  value,
  color,
  extra,
  onExtraClick,
  gradientFrom,
  gradientTo,
}) => {
  return (
    <div
      className={`bg-gradient-to-r ${gradientFrom} ${gradientTo} rounded-xl p-4 hover:shadow-md transition-all duration-300 h-full group`}
    >
      <label
        className="text-xs font-semibold uppercase tracking-wide mb-2 flex items-center"
        style={{ color }}
      >
        {/* <Icon className="mr-1" style={{ color }} /> */}
        {label}
      </label>
      <div className="flex items-center justify-between">
        <div className="text-gray-800 flex items-center gap-2 flex-wrap">
          {value}
        </div>
        {extra && (
          <button
            onClick={onExtraClick}
            className="text-xs hover:opacity-70 transition-opacity"
            style={{ color }}
          >
            {extra}
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfileInfoCard;
