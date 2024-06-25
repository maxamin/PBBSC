import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './Notification.module.css';

const Notification = ({ severity, title, message, duration }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  return visible ? (
    <div className={`${styles.notification} ${styles[severity]}`}>
      <div className={styles['notification-title']}>{title}</div>
      <div className={styles['notification-message']}>{message}</div>
    </div>
  ) : null;
};

Notification.propTypes = {
  severity: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  duration: PropTypes.number.isRequired,
};

export default Notification;
