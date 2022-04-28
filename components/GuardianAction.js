import { useEffect, useState } from 'react'

const GuardianAction = () => {
    //useEffect as a listener for the variable elderlyUser
    useEffect(() => {
        elderlyUser?.elderlyFollow.map((guardian) => {
            if (guardian.id === FBauth.currentUser.uid) {
                setGuardianForElderly(guardian)
            }
        })
    }, [elderlyUser])

    //useEffect to delete the elderly in the guardian list when an elderly delete the guardian
    useEffect(() => {
        if (guardianForElderly.length === undefined) {
            const docRef = doc(db, 'Users', elderlyUser.id)
            const deleteElderly = async () => {
                await updateDoc(docRef, {
                    elderlyFollow: arrayRemove({
                        id: guardianForElderly.id,
                        phone: guardianForElderly.phone,
                        nickname: guardianForElderly.nickname,
                        guardianName: guardianForElderly.gardianName,
                        accept: guardianForElderly.accept,
                        respond: guardianForElderly.respond,
                        expoPushToken: guardianForElderly.expoPushToken,
                    }),
                })
            }

            deleteElderly()
            setElderlyForGuardian([])
        }
    }, [elderlyForGuardian])
}

export default GuardianAction

//Function remove Elderly in the guardian elderlyFollow list
export const removeElderly = async (elderly) => {
    console.log('Current user id : ', FBauth.currentUser.uid)
    const docRef = doc(db, 'Users', FBauth.currentUser.uid)
    await updateDoc(docRef, {
        elderlyFollow: arrayRemove({
            id: elderly.id,
            dob: elderly.dob,
            phone: elderly.phone,
            elderlyName: elderly.elderlyName,
            nickname: elderly.nickname,
            accept: elderly.accept,
            respond: elderly.respond,
            expoPushToken: elderly.expoPushToken,
        }),
    })

    const docElderly = doc(db, 'Users', elderly.id)
    const docSnapElderly = await getDoc(docElderly)
    if (docSnapElderly.exists()) {
        setElderlyUser({
            id: elderly.id,
            ...docSnapElderly.data(),
        })
    }
}

//edit guardian nickname in the elderly database
export const editElderlyNickname = async (nickname, elderly) => {
    const docRef = doc(db, 'Users', FBauth.currentUser.uid)
    await updateDoc(docRef, {
        elderlyFollow: arrayRemove({
            id: elderly.id,
            dob: elderly.dob,
            phone: elderly.phone,
            nickname: elderly.nickname,
            elderlyName: elderly.elderlyName,
            expoPushToken: elderly.expoPushToken,
            accept: elderly.accept,
            respond: elderly.respond,
            expoPushToken: elderly.expoPushToken,
        }),
    })

    await updateDoc(docRef, {
        elderlyFollow: arrayUnion({
            id: elderly.id,
            dob: elderly.dob,
            phone: elderly.phone,
            nickname: nickname,
            elderlyName: elderly.elderlyName,
            expoPushToken: elderly.expoPushToken,
            accept: elderly.accept,
            respond: elderly.respond,
            expoPushToken: elderly.expoPushToken,
        }),
    })
}
