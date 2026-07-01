import { motion } from 'framer-motion';
import './Button.css';

export function Button({ children, variant = 'primary', className = '', ...props }) {
  return (
    <motion.button
      className={`btn btn-${variant} ${className}`.trim()}
      whileHover={{ scale: props.disabled ? 1 : 1.03 }}
      whileTap={{ scale: props.disabled ? 1 : 0.97 }}
      {...props}
    >
      {children}
    </motion.button>
  );
}
