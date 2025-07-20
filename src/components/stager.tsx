'use client';

import * as motion from 'motion/react-client';
import { useEffect, useState, Children, cloneElement } from 'react';

function Stager({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    setIsOpen(true);
  }, []);
  const arrayChildren = Children.toArray(children);
  return (
    <motion.div initial={false} animate={isOpen ? 'open' : 'closed'}>
      <motion.div
        variants={{
          open: {
            transition: { staggerChildren: 0.07, delayChildren: 0.2 },
          },
          closed: {
            transition: { staggerChildren: 0.05, staggerDirection: -1 },
          },
        }}
        style={{ display: 'flex', flexDirection: 'row', gap: '3rem' }}
      >
        {Children.map(arrayChildren, (child, index) => {
          return (
            <motion.div
              key={index}
              variants={{
                open: {
                  x: 0,
                  opacity: 1,
                  transition: {
                    y: { stiffness: 1000, velocity: -100 },
                  },
                },
                closed: {
                  x: 500,
                  opacity: 0,
                  transition: {
                    y: { stiffness: 1000 },
                  },
                },
              }}
            >
              {cloneElement(child)}
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}

export { Stager };
