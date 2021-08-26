import { useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';

import firebase from '../../services/firebaseConnection';

import { FiPlus } from 'react-icons/fi';
import Header from '../../components/Header';
import Title from '../../components/Title';

import { AuthContext } from '../../contexts/auth';

import './new.css';

export default function New(){
    const [loadCustomers, setLoadCustomers] = useState(true);
    const [customers, setCustomers] = useState([]);
    const [customerSelected, setCustomersSelected] = useState(0);

    const [assunto, setAssunto] = useState('Suporte');
    const [status, setStatus] = useState('Aberto');
    const [complemento, setComplemento] = useState('');

    const { user }  = useContext(AuthContext);

    async function handleRegister(event){
        event.preventDefault();

        await firebase.firestore().collection('chamados')
        .add({
            created: new Date(),
            client: customers[customerSelected].fantasyName,
            clientId: customers[customerSelected].id,
            subject: assunto,
            status: status,
            supplement: complemento,
            userId: user.uid

        })
        .then(() => {
            toast.success('Chamado registrado com sucesso.');
            setComplemento('');
            setCustomersSelected(0);
        })
        .catch((err) => {
            toast.error('Ops erro ao registrar, tente mais tarde!')
            console.log(err);
        })
        
    }

    function handleSelectAssunto(event){
        setAssunto(event.target.value);
    }

    function handleOptionChange(event){
        setStatus(event.target.value);
    }

    function handleChangeCustomers(event){
        setCustomersSelected(event.target.value);
    }

    useEffect(()=> {
        async function loadCustomers(){
            await firebase.firestore().collection('customers')
            .get()
            .then((snapshot) => {
                let lista = [];

                snapshot.forEach((doc) => {
                    lista.push({
                        id: doc.id,
                        fantasyName: doc.data().fantasyName
                    })
                })

                if(lista.length === 0){
                    console.log('Nenhuma empresa encontrada.');
                    setCustomers([ {id: "1", nomeFantasia: 'FREELA'} ])
                    setLoadCustomers(false);
                    return;
                }

                setCustomers(lista);
                setLoadCustomers(false);
            })
            .catch((err) => {
                console.log('Ops deu algum erro!', err);
                setLoadCustomers(false);
                setCustomers([ {id: "1", nomeFantasia: ''} ])
            })
        }
        loadCustomers();
    }, [])

    return(
        <div>
            <Header/>

            <div className="content">
                <Title name="Novo chamado">
                    <FiPlus size={25}/>
                </Title>

                <div className="container">
                    <form className="form-profile" onSubmit={handleRegister}>
                        <label>Cliente</label>
                        {loadCustomers ? 
                        (
                            <input type="text" value="Carregando clientes..." disabled={true}/>
                        ) : (
                            <select value={customerSelected} onChange={handleChangeCustomers}>
                                {customers.map((item, index) => {
                                    return(
                                        <option key={item.id} value={index}>
                                            {item.fantasyName}
                                        </option>
                                    )
                                })}
                            </select>
                        )}

                        <label>Assunto</label>
                        <select value={assunto} onChange={handleSelectAssunto}>
                            <option value="Suporte">Suporte</option>
                            <option value="Visita Técnica">Visita técnica</option>
                            <option value="Financeiro">Financeiro</option>
                        </select>

                        <label>Status</label>
                        <div className="status">
                            <input 
                            type="radio"
                            name="radio"
                            value="Aberto"
                            onChange={handleOptionChange}
                            checked={ status === 'Aberto' }
                            />
                            <span>Em aberto</span>

                            <input
                            type="radio"
                            name="radio"
                            value="Progresso"
                            onChange={handleOptionChange}
                            checked={ status === 'Progresso' }
                            />
                            <span>Em progresso</span>

                            <input
                            type="radio"
                            name="radio"
                            value="Atendido"
                            onChange={handleOptionChange}
                            checked={ status === 'Atendido' }
                            />
                            <span>Atendido</span>
                        </div>

                        <label>Complemento</label>
                        <textarea
                            type="text"
                            value= {complemento}
                            onChange={(event) => setComplemento(event.target.value)}
                            placeholder="Descreva o seu problema (opcional)"
                        />
                        <button type="submit">Registrar</button>
                    </form>
                </div>
            </div>
        </div>
    );
}