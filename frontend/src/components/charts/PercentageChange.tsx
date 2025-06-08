import React from 'react';
import styles from '../../styles/plotCard.module.css';

interface PercentageChangeProps {
  current: number | null;
  previous: number | null;
}

const PercentageChange: React.FC<PercentageChangeProps> = ({ current, previous }) => {
  if (current === null || previous === null || previous === 0) return null;

  const percentChange = (((current - previous) / previous) * 100).toFixed(1);
  const isPositive = Number(percentChange) >= 0;

  return (
    <div>
      <span className={`${isPositive ? `${styles.statPosText}` : `${styles.statNegText}`}`}>
        {isPositive ? '+' : ''}
        {percentChange}%
      </span>
    </div>
  );
};

export default PercentageChange;
