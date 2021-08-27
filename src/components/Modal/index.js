import './modal.css';

import { FiX } from 'react-icons/fi';

export default function Modal({conteudo, close}){
    return(
        <div className="modal">
            <div className='container'>
                <button className="close" onClick={ close }>
                    <FiX size={23} color="#FFF"/>
                    Voltar
                </button>

                <div>
                    <h2>Detalhes do chamado</h2>
                    <div className="row">
                        <span>
                            Cliente: <i>{conteudo.client}</i>
                        </span>
                    </div>
                    <div className="row">
                        <span>
                            Assunto: <i>{conteudo.subject}</i>
                        </span>
                        <span>
                            Cadastrado em: <i>{conteudo.createdFormated}</i>
                        </span>
                    </div>
                    <div className="row">
                        <span>
                            Status: <i style={{color:'#FFF', backgroundColor: conteudo.status === 'Aberto' ?
                             '#5cb85c' : '#999'}}
                            >
                                {conteudo.status}
                            </i>
                        </span>
                    </div>
                    {conteudo.supplement !== '' && (
                        <>
                            <h3>Complemento:</h3>

                            <p>{conteudo.supplement}</p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}