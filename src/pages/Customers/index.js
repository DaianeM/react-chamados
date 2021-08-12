import { useState } from 'react'
import firebase from '../../services/firebaseConnection';

import Header from '../../components/Header';
import Title from '../../components/Title';

import { FiUser } from 'react-icons/fi';
import { toast } from 'react-toastify';
import './customers.css';

export default function Customers(){
    const [fantasyName, setFantasyName] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [address, setAdress] = useState('');

    async function handleAdd(event){
        event.preventDefault();
        
        if(fantasyName !== '' && cnpj !== '' && address !== ''){
            await firebase.firestore().collection('customers')
            .add({
                fantasyName: fantasyName,
                cnpj: cnpj,
                address: address
            })
            .then(()=>{
                setFantasyName('');
                setCnpj('');
                setAdress('');
                toast.success('Empresa cadastrada com sucesso.');
            })
            .catch((error) => {
                console.log(error);
                toast.error('Erro ao cadastrar essa empresa');
            })
        }else{
            toast.error('Preencha todos os campos');
        }
    }

    return(
        <div>
            <Header/>
            <div className="content">
                <Title name="Clientes">
                    <FiUser size={25}/>
                </Title>
                <div className="container">
                    <form className="form-profile customers" onSubmit={handleAdd}>
                        <label>Nome fantasia</label>
                        <input type="text" placeholder="Nome da sua empresa" value={fantasyName} onChange={(event) => setFantasyName(event.target.value)}/>

                        <label>Cnpj</label>
                        <input type="text" placeholder="Seu CNPJ" value={cnpj} onChange={(event) => setCnpj(event.target.value) }/>

                        <label>Endereço</label>
                        <input type="text" placeholder="Endereço da empresa" value={address} onChange={(event) => setAdress(event.target.value)}/>

                        <button type="submit">Cadastrar</button>
                    </form>
                </div>
            </div>
        </div>
    )
}