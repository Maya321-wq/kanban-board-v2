import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useUndoRedo } from '../../../src/hooks/useUndoRedo';

function TestComponent() {
  const { state, dispatch, undo, redo, canUndo, canRedo } = useUndoRedo(
    { value: 0 },
    (s, a) => {
      if (a.type === 'inc') return { value: s.value + 1 };
      return s;
    }
  );

  return (
    <div>
      <div data-testid="value">{state.value}</div>
      <button onClick={() => dispatch({ type: 'inc' })}>Inc</button>
      <button onClick={undo} disabled={!canUndo}>Undo</button>
      <button onClick={redo} disabled={!canRedo}>Redo</button>
    </div>
  );
}

describe('useUndoRedo (integration mount)', () => {
  it('increments, undoes and redoes', () => {
    render(<TestComponent />);
    const value = screen.getByTestId('value');
    const inc = screen.getByText('Inc');
    const undo = screen.getByText('Undo');
    const redo = screen.getByText('Redo');

    expect(value).toHaveTextContent('0');

    fireEvent.click(inc);
    expect(value).toHaveTextContent('1');

    fireEvent.click(undo);
    expect(value).toHaveTextContent('0');

    fireEvent.click(redo);
    expect(value).toHaveTextContent('1');
  });
});
