import { useState, useEffect, createContext } from 'react';
import { toast } from 'react-toastify';

import firebase from '../services/firebaseConnection';


export const AuthContext = createContext({});

function AuthProvider({children}){

    const [user, setUser] = useState(null);
    const [loadingAuth, setLoadingAuth] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        function loadStorage(){

            const storageUser = localStorage.getItem('SistemaUser');

            if(storageUser){
                setUser(JSON.parse(storageUser));
                setLoading(false);
            }
            setLoading(false);
        }
        loadStorage();

    }, [])


    //login na conta
    async function signIn(email, password){
        setLoadingAuth(true);
        await firebase.auth().signInWithEmailAndPassword(email, password)
        .then(async(value)=>{
            let uid = value.user.uid;

            const userProfile = await firebase.firestore().collection('users')
            .doc(uid)
            .get();

            let data = {
                uid: uid,
                name: userProfile.data().name,
                avatarUrl: userProfile.data().avatarUrl,
                email: value.user.email
            }
            setUser(data);
            saveStorageUser(data);
            setLoadingAuth(false);
            toast.success(`${data.name}, bem vindo(a) de volta ao sistema!`);
        })
        .catch((error)=>{
            console.log(error);
            setLoadingAuth(false);
            toast.error('Ops, algo deu errado!');
        })
    }


    //cadastro de usuário
    async function signUp(email, password, name){
        setLoadingAuth(true)
        await firebase.auth().createUserWithEmailAndPassword(email,password)
        .then(async(value)=>{
            let uid = value.user.uid;

            await firebase.firestore().collection('users')
            .doc(uid)
            .set({
                name: name,
                avatarUrl: null,
            })
            .then(()=>{
                let data = {
                    uid: uid,
                    name: name,
                    email: value.user.email,
                    avatarUrl: null
                }
                setUser(data);
                saveStorageUser(data);
                setLoadingAuth(false);
                toast.success(`${data.name}, bem-vindo(a) ao sistema!`);
            })  
        })
        .catch((error)=>{
            console.log(error);
            toast.error('Ops algo deu errado!');
            setLoadingAuth(false);
        })
    }


    function saveStorageUser(data){
        localStorage.setItem('SistemaUser', JSON.stringify(data));
    }

    //fazer logoout
    async function signOut(){
        await firebase.auth().signOut();
        localStorage.removeItem('SistemaUser');
        setUser(null);
    }


    return(
        <AuthContext.Provider 
            value={{
            signed: !!user, 
            user, 
            loading, 
            loadingAuth,
            signUp,
            signOut,
            signIn
        }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;