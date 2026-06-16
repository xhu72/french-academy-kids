import { useEffect, useState } from 'react'
import { doc, getDoc, collection, getDocs } from 'firebase/firestore'
import { signOut } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { auth, db } from '../firebaseConfig'
import { useAuth } from '../context/AuthContext'
import { LEVELS } from '../data/levels'
import LevelCard from '../components/LevelCard'

export default function HomePage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [userData, setUserData] = useState(null)
  const [progress, setProgress] = useState({})
  const [loading,  setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    async function load() {
      // Load user document
      const userSnap = await getDoc(doc(db, 'users', user.uid))
      if (userSnap.exists()) setUserData(userSnap.data())

      // Load progress subcollection
      const progressSnap = await getDocs(
        collection(db, 'users', user.uid, 'progress')
      )
      const progressMap = {}
      progressSnap.forEach(d => {
        progressMap[d.id] = d.data()
      })
      setProgress(progressMap)
      setLoading(false)
    }

    load()
  }, [user])

  async function handleSignOut() {
    await signOut(auth)
    navigate('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl">🇫🇷</div>
          <p className="text-gray-500">Loading your progress...</p>
        </div>
      </div>
    )
  }

  const unlockedLevels  = userData?.unlockedLevels ?? [1]
  const displayName = userData?.displayName ?? 'Learner'

  return (
    <div className="min-h-screen">

      <nav className="border-b px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🇫🇷</span>
          <span className="font-bold">French Academy Kids</span>
        </div>
        <button onClick={handleSignOut} className="text-sm text-gray-500">
          Sign out
        </button>
      </nav>

      <main className="max-w-2xl mx-auto px-6 py-8">

        <div className="mb-6">
          <h1 className="text-2xl font-bold">
            Bonjour, {displayName.split(' ')[0]}! 👋
          </h1>
          <p className="text-gray-500">
            {unlockedLevels.length === 1
              ? 'Complete Level 1 topics to unlock the next level.'
              : `You have unlocked ${unlockedLevels.length} levels — keep going!`}
          </p>
        </div>

        <div className="border rounded px-6 py-4 mb-6 flex gap-8">
          <div>
            <p className="text-sm text-gray-500">Total XP</p>
            <p className="text-xl font-bold">{userData?.totalXP ?? 0}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Streak</p>
            <p className="text-xl font-bold">{userData?.currentStreak ?? 0} 🔥</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Levels unlocked</p>
            <p className="text-xl font-bold">{unlockedLevels.length} / 4</p>
          </div>
        </div>

        <div className="space-y-4">
          {LEVELS.map(level => {
            const isUnlocked = unlockedLevels.includes(level.id)

            // Which topics have been completed for this level?
            const completedTopics = level.topics.filter(
              topic => progress[topic]?.percentage >= level.passMark
            )

            return (
              <LevelCard
                key={level.id}
                level={level}
                isUnlocked={isUnlocked}
                completedTopics={completedTopics}
                onClick={() => navigate(`/level/${level.id}`)}
              />
            )
          })}
        </div>

      </main>
    </div>
  )
}
