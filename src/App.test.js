import { render } from '@testing-library/react';
import React from 'react';
import App from './App';

test('if Get Badges button is there', () => {
  const { getByText } = render(<App />);
  const button = getByText(/Get Badges/i);
  expect(button).toBeInTheDocument();
});
