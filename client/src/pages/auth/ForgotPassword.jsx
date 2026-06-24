import { useState } from 'react';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return alert('Please enter email');
    
    console.log('Password reset link requested for:', email);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <span className="text-5xl">🔑</span>
        <h2 className="mt-4 text-3xl font-extrabold text-slate-900">Forgot Password?</h2>
        <p className="mt-2 text-sm text-slate-600">
          No worries, we will send you loop instructions to reset it.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-2xl sm:px-10 border border-slate-100">
          {!submitted ? (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-slate-700">Registered Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your-email@college.com"
                  className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
                >
                  Send Reset Link
                </button>
              </div>
            </form>
          ) : (
            /* Success Response State View */
            <div className="text-center space-y-4 py-4">
              <div className="text-green-500 text-4xl">✉️</div>
              <h3 className="text-lg font-bold text-slate-800">Check Your Inbox</h3>
              <p className="text-sm text-slate-500">
                Humne ek mock reset link <span className="font-semibold text-slate-700">{email}</span> par bhej di hai.
              </p>
              <button 
                onClick={() => setSubmitted(false)}
                className="text-xs font-semibold text-indigo-600 hover:underline"
              >
                Didn't receive? Try again
              </button>
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <Link to="/login" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
              ← Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;