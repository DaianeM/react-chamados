import { useState } from 'react';
import { FiMessageSquare, FiPlus } from 'react-icons/fi';
import { Link } from 'react-router-dom';

import Header from '../../components/Header';
import Title from '../../components/Title';

import './dashboard.css';

function Dashboard(){
    const [calls, setCalls] = useState([]);

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
                        </>
                    )
                }
            </div>
        </div>
    );
}

export default Dashboard;
