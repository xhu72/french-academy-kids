import { useState } from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { Link, useNavigate } from 'react-router-dom'
import { auth, db } from '../firebaseConfig'

export default function SignUpPage() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function validate() {
    if (!name.trim())          return 'Please enter your name.'
    if (password.length < 8)   return 'Password must be at least 8 characters.'
    if (password !== confirm)  return 'Passwords do not match.'
    return null
  }

  async function handleSignUp(e) {
    e.preventDefault()
    const err = validate()
    if (err) { setError(err); return }
    setError('')
    setLoading(true)
    try {
      // Step 1 — create Firebase Auth user
      const { user } = await createUserWithEmailAndPassword(auth, email.trim(), password)

      // Step 2 — create Firestore user document
      await setDoc(doc(db, 'users', user.uid), {
        displayName:    name.trim(),
        email:          email.trim(),
        createdAt:      serverTimestamp(),
        unlockedLevels: [1],
        totalXP:        0,
        currentStreak:  0,
        lastLoginDate:  '',
      })

      navigate('/home')
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError('That email is already registered.')
      } else {
        setError('Could not create account. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-8 w-full max-w-md">

        <div className="text-center mb-6">
          <div className="text-5xl">🎓</div>
          <h1 className="text-2xl font-bold">Create account</h1>
          <p className="text-gray-500">Start your French journey today</p>
        </div>

        {error && (
          <p className="text-red-600 mb-4">{error}</p>
        )}

        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <label className="block mb-1">Your name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Xiling"
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block mb-1">Confirm password</label>
            <input
              type="password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="text-center mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600">
            Sign in
          </Link>
        </p>

      </div>
    </div>
  )
}