import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => (
  <div
    style={{
      margin: '1em',
      paddingBottom: '1em',
      fontSize: '18px',
      color: 'white',
    }}
  >
    <Link style={{ color: 'white' }} to="/terms">
      HAPPY
    </Link>
    {' · '}
    <Link style={{ color: 'white' }} to="/privacy">
      HACKING
    </Link>
    {' · '}
    <Link style={{ color: 'white' }} to="/faq">
      TEAM
    </Link>
    {' · '}
    <Link style={{ color: 'white' }} to="/discordBot">
      NOOB_POWER
    </Link>
  </div>
);
