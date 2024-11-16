import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import Login from './Login';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { BrowserRouter as Router } from 'react-router-dom';

// Mock the Supabase client
jest.mock('@supabase/auth-helpers-react', () => ({
  useSupabaseClient: jest.fn(),
}));

describe('Login Component', () => {
  let supabaseMock;

  beforeEach(() => {
    supabaseMock = {
      auth: {
        signInWithPassword: jest.fn(),
        resetPasswordForEmail: jest.fn(),
        getSession: jest.fn().mockResolvedValue({ data: { session: null } }),
      },
    };

    useSupabaseClient.mockReturnValue(supabaseMock);
  });

  test('renders login form correctly', () => {
    render(
      <Router>
        <Login />
      </Router>
    );

    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByText('Sign In')).toBeInTheDocument();
    expect(screen.getByText('Forgot password?')).toBeInTheDocument();
  });

  test('toggles between login and forgot password form', () => {
    render(
      <Router>
        <Login />
      </Router>
    );

    fireEvent.click(screen.getByText('Forgot password?'));
    expect(screen.getByText('Reset Your Password')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Back to Login'));
    expect(screen.getByText('Sign In')).toBeInTheDocument();
  });

  test('updates email and password state on input change', () => {
    render(
      <Router>
        <Login />
      </Router>
    );

    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });

    expect(screen.getByPlaceholderText('Email').value).toBe('test@example.com');
    expect(screen.getByPlaceholderText('Password').value).toBe('password123');
  });

  test('submits login form and navigates on success', async () => {
    supabaseMock.auth.signInWithPassword.mockResolvedValueOnce({ user: { id: '123' } });

    render(
      <Router>
        <Login />
      </Router>
    );

    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });

    fireEvent.click(screen.getByText('Sign In'));

    await waitFor(() => {
      expect(supabaseMock.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  test('displays error on login failure', async () => {
    supabaseMock.auth.signInWithPassword.mockRejectedValueOnce(new Error('Incorrect username or password'));

    render(
      <Router>
        <Login />
      </Router>
    );

    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'wrongpassword' } });

    fireEvent.click(screen.getByText('Sign In'));

    await waitFor(() => {
      expect(screen.getByText('Incorrect username or password')).toBeInTheDocument();
    });
  });

  test('handles password reset functionality', async () => {
    supabaseMock.auth.resetPasswordForEmail.mockResolvedValueOnce({});

    render(
      <Router>
        <Login />
      </Router>
    );

    fireEvent.click(screen.getByText('Forgot password?'));

    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'reset@example.com' } });

    fireEvent.click(screen.getByText('Send Reset Email'));

    await waitFor(() => {
      expect(supabaseMock.auth.resetPasswordForEmail).toHaveBeenCalledWith('reset@example.com', {
        redirectTo: `${window.location.origin}/reset-password`,
      });
    });

    expect(screen.getByText('Password reset email sent! Please check your inbox.')).toBeInTheDocument();
  });
});
