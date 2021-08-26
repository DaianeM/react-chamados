import { useState, useEffect } from 'react';
import { FiMessageSquare, FiPlus, FiSearch, FiEdit2 } from 'react-icons/fi';
import { Link } from 'react-router-dom';

import firebase from '../../services/firebaseConnection';
import { format } from 'date-fns';

import Header from '../../components/Header';
import Title from '../../components/Title';

import './dashboard.css';

const listRef = firebase.firestore().collection('chamados').orderBy('created', 'desc')

function Dashboard(){
    const [calls, setCalls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [isEmpty, setIsEmpty] = useState(false);
    const [lastDocs, setLastDocs] = useState();

    useEffect(() => {
        loadChamados()

    return () => {

    }

    }, [])

    async function loadChamados() {
        await listRef.limit(5)
        .get()
        .then((snapshot) => {
            updateState(snapshot);

        })
        .catch((err) => {
            console.log('Erro ao buscar', err)
            setLoadingMore(false);
        })

        setLoading(false);
    }

    async function updateState(snapshot){
        const isCollectionEmpty = snapshot.size === 0;

        if(!isCollectionEmpty){
            let lista = [];

            snapshot.forEach((doc) => {
                lista.push({
                    id: doc.id,
                    subject: doc.data().subject,
                    client: doc.data().client,
                    clientId: doc.data().clientId,
                    created: doc.data().created,
                    createdFormated: format(doc.data().created.toDate(), 'dd/MM/yyyy'),
                    status: doc.data().status,
                    supplement: doc.data().supplement, 
                })
            })

            const lastDoc = snapshot.docs[snapshot.docs.length -1] //pegando o ultimo documento buscado

            setCalls(calls => [...calls, ...lista]);
            setLastDocs(lastDoc);
        }else{
            setIsEmpty(true);
        }

        setLoadingMore(false);
    }

    return(
        <div>
            <Header/>
            <div className="content">
                <Title name="Atendimentos">
                    <FiMessageSquare size={25} />
                </Title>
                {calls.length === 0 ? 
                    (
                        <div className="container dashboard">
                            <span>Nenhum chamado registrado...</span>
                            <Link to="/new" className="new">
                                <FiPlus size={25} color="#FFF"/>
                                Novo chamado
                            </Link>
                        </div>
                    ) : (
                        <>
                            <Link to="/new" className="new">
                                <FiPlus size={25} color="#FFF"/>
                                Novo chamado
                            </Link>
                            <table>
                                <thead>
                                    <tr>
                                        <th scope="col">Cliente</th>
                                        <th scope="col">Assunto</th>
                                        <th scope="col">Status</th>
                                        <th scope="col">Cadastrado em</th>
                                        <th scope="col">#</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td data-label="Cliente">Escola do Saber</td>
                                        <td data-label="Assunto">Suporte</td>
                                        <td data-label="Status">
                                            <span className="badge" style={{backgroundColor: '#5cb85c'}}>Em aberto</span>
                                        </td>
                                        <td data-label="Cadastrado em">12-08-2021</td>
                                        <td data-label="#">
                                            <button className="action" style={{backgroundColor: '#3583f6'}}>
                                                <FiSearch size={17} color="#FFF"/>
                                            </button>
                                            <button className="action" style={{backgroundColor: '#F6A935'}}>
                                                <FiEdit2 size={17} color="#FFF"/>
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </>
                    )
                }
            </div>
        </div>
    );
}

export default Dashboard;
