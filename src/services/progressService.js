import {
  doc, getDoc, setDoc, updateDoc,
  collection, getDocs,
  increment, arrayUnion, serverTimestamp,
} from 'firebase/firestore'
import { db } from '../firebaseConfig'

export async function getUserProgress(uid) {
  const snap = await getDocs(collection(db, 'users', uid, 'progress'))
  const map = {}
  snap.forEach(d => { map[d.id] = d.data() })
  return map
}

export async function getUserDoc(uid) {
  const snap = await getDoc(doc(db, 'users', uid))
  return snap.exists() ? snap.data() : null
}

export async function saveQuizResult(uid, topic, result) {
  const progressRef = doc(db, 'users', uid, 'progress', topic)
  const existing = await getDoc(progressRef)

  const bestPercentage = existing.exists()
    ? Math.max(existing.data().bestPercentage ?? 0, result.percentage)
    : result.percentage

  const attempts = existing.exists() ? (existing.data().attempts ?? 0) + 1 : 1

  await setDoc(progressRef, {
    score:          result.score,
    percentage:     result.percentage,
    bestPercentage,
    attempts,
    completedAt:    serverTimestamp(),
  })

  await updateDoc(doc(db, 'users', uid), {
    totalXP: increment(result.score),
  })
}

export async function unlockNextLevel(uid, levelId) {
  const nextLevel = levelId + 1
  await updateDoc(doc(db, 'users', uid), {
    unlockedLevels: arrayUnion(nextLevel),
  })
}