// src/components/todos/TodoList.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { render } from '@tests/test-utils';
import TodoList from '@todos/TodoList';
import { addTodo, setFilter, toggleTodo } from '@store/todosSlice';

describe('TodoList', () => {
  it('renders "No todos available" when there are no todos', () => {
    render(<TodoList />);
    expect(screen.getByText(/no todos available/i)).toBeInTheDocument();
  });

  it('renders a todo when one exists', async () => {
    const { store } = render(<TodoList />);

    // Add a todo
    store.dispatch(
      addTodo({
        title: 'Test Todo',
        text: 'Test Todo Description',
        dueDate: '2025-05-01',
      })
    );

    // Wait for update todo, if don't have this => error
    await waitFor(() => {
      expect(screen.getByText('Test Todo')).toBeInTheDocument();
    });

    expect(screen.getByText('Test Todo Description')).toBeInTheDocument();
    expect(screen.getByText(/due:/i)).toBeInTheDocument();
  });

  it('toggles a todo when checkbox is clicked', async () => {
    const { store } = render(<TodoList />);

    // Add a todo
    store.dispatch(
      addTodo({
        title: 'Toggle Todo',
        text: 'This todo will be toggled',
        dueDate: '',
      })
    );

    // Wait rendered
    await waitFor(() => {
      expect(screen.getByText('Toggle Todo')).toBeInTheDocument();
    });

    // Find the checkbox and click
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    // Check if its state toggled
    const toggledTodo = store.getState().todos.items[0];
    expect(toggledTodo.completed).toBe(true);

    const todoTitle = screen.getByText('Toggle Todo');
    expect(todoTitle.className).toContain('line-through');
  });

  it('removes a todo when delete button is clicked', async () => {
    const { store } = render(<TodoList />);

    // Add a todo
    store.dispatch(
      addTodo({
        title: 'Delete This Todo',
        text: 'This todo will be deleted',
        dueDate: '',
      })
    );

    // wait
    await waitFor(() => {
      expect(screen.getByText('Delete This Todo')).toBeInTheDocument();
    });

    // Find delete button
    // => Need to add more speficic name to avoid error if multiples buttons
    const deleteButton = screen.getByRole('button', {
      name: '',
    });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(screen.queryByText('Delete This Todo')).not.toBeInTheDocument();
    });
    expect(screen.getByText(/no todos available/i)).toBeInTheDocument();
  });

  it('toggles the todo state when checkbox is clicked', async () => {
    const { store } = render(<TodoList />);
    store.dispatch(
      addTodo({
        title: 'Test Todo',
        text: 'Test Todo Description',
        dueDate: '2025-05-01',
      })
    );

    await waitFor(() => {
      expect(screen.getByText('Test Todo')).toBeInTheDocument();
    });

    const todo = store.getState().todos.items.find((t) => t.title === 'Test Todo');
    if (todo) {
      store.dispatch(toggleTodo(todo.id));
    }
  });

  it('filters todos based on the selected filter', async () => {
    const { store } = render(<TodoList />);

    // Add todos
    store.dispatch(
      addTodo({
        title: 'Active Todo',
        text: 'This todo is active',
        dueDate: '',
      })
    );
    store.dispatch(
      addTodo({
        title: 'Completed Todo',
        text: 'This todo is completed',
        dueDate: '',
      })
    );

    await waitFor(() => {
      expect(screen.getByText('Completed Todo')).toBeInTheDocument();
    });
    const todo = store.getState().todos.items.find((t) => t.title === 'Completed Todo');
    if (todo) {
      store.dispatch(toggleTodo(todo.id));
    }
    // Filter by completed
    store.dispatch(setFilter('completed'));
    await waitFor(() => {
      expect(screen.getByText('Completed Todo')).toBeInTheDocument();
    });

    // Filter by active
    store.dispatch(setFilter('active'));
    await waitFor(() => {
      expect(screen.getByText('Active Todo')).toBeInTheDocument();
    });
  });
});
