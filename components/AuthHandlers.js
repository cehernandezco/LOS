import { FBauth } from '../App'

export const SignoutHandler = ({ setAuth, setUser }) => {
    signOut(FBauth)
        .then(() => {
            setAuth(false)
            setUser(null)
        })
        .catch((error) => console.log(error.code))
}
