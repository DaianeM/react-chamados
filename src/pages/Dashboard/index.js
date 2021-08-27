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

    } //quando o componente for desmontado

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

    async function handleMore(){
        await listRef.startAfter(lastDocs).limit(5)
        .get()
        .then((snapshot) => {
            updateState(snapshot);
        })
        .catch((err) => {
            console.log(err);
        })
    }


    if(loading) {
        return(
            <div>
                <Header/>
                <div className="content">
                    <Title name="Atendimentos">
                        <FiMessageSquare size={25} />
                    </Title>
                    <div className="container dashboard">
                        <span>Buscando chamados...</span>
                    </div>
                </div>
            </div> 

        );
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
                                    {calls.map((call, index) => {
                                        return(
                                            <tr key={index}>
                                                <td data-label="Cliente">{call.client}</td>
                                                <td data-label="Assunto">{call.subject}</td>
                                                <td data-label="Status">
                                                    <span className="badge" 
                                                        style={{backgroundColor: call.status === 'Aberto' ?
                                                            '#5cb85c' : '#999'
                                                    }}>{call.status}</span>
                                                </td>
                                                <td data-label="Cadastrado em">{call.createdFormated}</td>
                                                <td data-label="#">
                                                    <button className="action" style={{backgroundColor: '#3583f6'}}>
                                                        <FiSearch size={17} color="#FFF"/>
                                                    </button>
                                                    <button className="action" style={{backgroundColor: '#F6A935'}}>
                                                        <FiEdit2 size={17} color="#FFF"/>
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                            {loadingMore && <h3 style={{textAlign: 'center', marginTop: 15}}>Buscando dados...</h3>}
                            {!loadingMore && !isEmpty && <button className="btn-more" onClick={handleMore}>Buscar mais</button>}
                        </>
                    )
                }
            </div>
        </div>
    );
}

export default Dashboard;
