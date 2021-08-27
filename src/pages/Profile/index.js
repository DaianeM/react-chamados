import { useState, useContext} from 'react';
import { toast } from 'react-toastify';
import { FiSettings, FiUpload } from 'react-icons/fi';

import { AuthContext } from '../../contexts/auth';
import firebase from '../../services/firebaseConnection';

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

    //carrega preview da imagem de perfil
    function handleFile(event){
        if(event.target.files[0]){
            const image = event.target.files[0];

            if(image.type === 'image/jpeg' || image.type === 'image/png'){
                setImageAvatar(image);
                setAvatarUrl(URL.createObjectURL(event.target.files[0]));
            }else{
                toast.info('Envie uma imagem do tipo PNG ou JPEG');
                setImageAvatar(null);
                return null;
            }
        }
    }

    async function handleUpload(){
        const currentUid = user.uid;

        await firebase.storage()
        .ref(`images/${currentUid}/${imageAvatar.name}`)
        .put(imageAvatar)
        .then(async ()=>{
            //vai no storage e busca a url para atualizar o avatarUrl do user
            await firebase.storage().ref(`images/${currentUid}`)
            .child(imageAvatar.name).getDownloadURL()
            .then(async (url)=>{
                let urlFoto = url;
                //vai no firebase/firestore salvar a url
                await firebase.firestore().collection('users')
                .doc(user.uid)
                .update({
                    avatarUrl: urlFoto,
                    name: name
                }) 
                .then(()=>{
                    let data = {
                        ...user,
                        avatarUrl: urlFoto,
                        name: name
                    }
                    setUser(data);
                    saveStorageUser(data);
                    toast.success('Perfil atualizado com sucesso!');
                })
            })
        })
    }

    async function handleSave(event){
        event.preventDefault();

        if(imageAvatar === null && name !== ''){
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
                toast.success('Perfil atualizado com sucesso!');
            })
            .catch((err)=>{
                console.log(err);
            })
        }else if (imageAvatar !== null && name !== ''){
            handleUpload();
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
                            <input type="file" accept="image/*" onChange={handleFile}/><br/>
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