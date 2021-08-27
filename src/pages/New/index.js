import { useState, useEffect, useContext } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiPlus } from 'react-icons/fi';

import Header from '../../components/Header';
import Title from '../../components/Title';

import firebase from '../../services/firebaseConnection';
import { AuthContext } from '../../contexts/auth';

import './new.css';

export default function New(){
    const { id } = useParams();
    const history = useHistory();

    const [loadCustomers, setLoadCustomers] = useState(true);
    const [customers, setCustomers] = useState([]);
    const [customerSelected, setCustomersSelected] = useState(0);

    const [subject, setSubject] = useState('Suporte');
    const [status, setStatus] = useState('Aberto');
    const [supplement, setSupplement] = useState('');

    const [idCustomer, setIdCustomer] = useState(false);

    const { user }  = useContext(AuthContext);

    async function handleRegister(event){
        event.preventDefault();

        if(idCustomer){
            await firebase.firestore().collection('calls')
            .doc(id)
            .update({
                client: customers[customerSelected].fantasyName,
                clientId: customers[customerSelected].id,
                subject: subject,
                status: status,
                supplement: supplement,
                userId: user.uid
            })
            .then(() => {
                toast.success('Editado com sucesso!');
                setSupplement('');
                setCustomersSelected(0);
                history.push("/dashboard");
            })
            .catch((err) => {
                toast.error('Ops erro ao resgistrar');
                console.log(err);
            })
            return;
        }

        await firebase.firestore().collection('calls')
        .add({
            created: new Date(),
            client: customers[customerSelected].fantasyName,
            clientId: customers[customerSelected].id,
            subject: subject,
            status: status,
            supplement: supplement,
            userId: user.uid

        })
        .then(() => {
            toast.success('Chamado registrado com sucesso.');
            setSupplement('');
            setCustomersSelected(0);
        })
        .catch((err) => {
            toast.error('Ops erro ao registrar, tente mais tarde!')
            console.log(err);
        })
        
    }

    function handleSelectAssunto(event){
        setSubject(event.target.value);
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

                if(id) {
                    loadId(lista);
                }
            })
            .catch((err) => {
                console.log('Ops deu algum erro!', err);
                setLoadCustomers(false);
                setCustomers([ {id: "1", nomeFantasia: ''} ])
            })
        }
        loadCustomers();

    }, [id])

    async function loadId(lista){
        await firebase.firestore().collection('calls')
        .doc(id)
        .get()
        .then((snapshot) => {
            setSubject(snapshot.data().subject);
            setStatus(snapshot.data().status);
            setSupplement(snapshot.data().supplement);

            let index = lista.findIndex(item => item.id === snapshot.data().clientId);

            setCustomersSelected(index);
            setIdCustomer(true);
        })
        .catch((err) => {
            console.log('Erro no ID passado: ', err);
            setIdCustomer(false);
        })
    }

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
                        <select value={subject} onChange={handleSelectAssunto}>
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
                            value= {supplement}
                            onChange={(event) => setSupplement(event.target.value)}
                            placeholder="Descreva o seu problema (opcional)"
                        />
                        <button type="submit">Registrar</button>
                    </form>
                </div>
            </div>
        </div>
    );
}