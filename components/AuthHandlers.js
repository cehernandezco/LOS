import {
    getAuth,
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
    GoogleAuthProvider,
    FacebookAuthProvider,
    signInWithCredential,
} from 'firebase/auth'

export const SignoutHandler = ({ FBauth, setAuth, setUser }) => {
    signOut(FBauth)
        .then(() => {
            setAuth(false)
            setUser(null)
        })
        .catch((error) => console.log(error.code))
}
