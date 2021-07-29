import { useState, useContext} from 'react';
import { AuthContext } from '../../contexts/auth';
import firebase from '../../services/firebaseConnection';

import { FiSettings, FiUpload } from 'react-icons/fi';
import Header from '../../components/Header';
import Title from '../../components/Title';

import avatar from '../../assets/avatar.png';
import './profile.css';

export default function Profile(){
    const { user, signOut, setUser, saveStorageUser } = useContext(AuthContext);

    const [name, setName] = useState(user && user.name);
    const [email, setEmail] = useState(user && user.email);

    const [avatarUrl, setAvatarUrl] = useState(user && user.avatarUrl);
    const [imageAvatar, setImageAvatar] = useState(null);


    async function handleSave(event){
        event.preventDefault();

        if(imageAvatar === null & name !== ''){
            await firebase.firestore().collection('users')
            .doc(user.uid)
            .update({
                name: name
            })
            .then(()=>{
                let data = {
                    ...user,
                    name: name
                }
                setUser(data);
                saveStorageUser(data);
            })
            .catch((err)=>{
                console.log(err);
            })
        }
    }

    return(
        <div>
            <Header/>
            <div className="content">
                <Title name="Meu perfil">
                    <FiSettings size={25}/>
                </Title>
                <div className="container">
                    <form className="form-profile" onSubmit={handleSave}>
                        <label className="label-avatar">
                            <span>
                                <FiUpload color="#FFF" size={25}/>
                            </span>
                            <input type="file" accept="image/*"/><br/>
                            {avatarUrl === null ?
                                <img src={avatar} width="200" height="200" alt="foto de perfil do usuário"/> :
                                <img src={avatarUrl} width="200" height="200" alt="foto de perfil do usuário"/>
                            }
                        </label>
                        <label>Nome</label>
                        <input type="text" value={name} onChange={(event) => setName(event.target.value)}/>

                        <label>Email</label>
                        <input type="text" value={email} disabled={true}/>

                        <button type="submit">Salvar</button>
                    </form>
                </div>
                <div className="container">
                    <button className="logout-btn" onClick={ ()=> signOut() }>
                        Sair
                    </button>
                </div>
            </div>
        </div>
    );
}