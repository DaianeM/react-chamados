import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/auth';

import logoSistema from '../../assets/logo-sistema.png';

function SignUp(){
    const { signUp, loadingAuth } = useContext(AuthContext);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    function handleSubmit(e){
        e.preventDefault();
        if(email !== '' && password !== '' && name !== ''){
            signUp(email, password, name);
            setName('');
            setEmail('');
            setPassword('');
        }
    }



    return(
        <div className="container-center">
            <div className="login">
                <div className="logo-area">
                    <img src={logoSistema} alt="Logomarca do sistema"/>
                </div>
                <form onSubmit={handleSubmit}>
                    <h1>Cadastrar Conta</h1>
                    <input type="text" placeholder="Seu nome" value={name}
                        onChange={ (e)=>setName(e.target.value)}
                    />
                    <input type="text" placeholder="email@email.com" value={email} 
                        onChange={ (e)=>setEmail(e.target.value) }/>
                    <input type="password" placeholder="******" value={password}
                        onChange={ (e)=>setPassword(e.target.value) }/>
                    <button type="submit">{loadingAuth ? 'Carregando' : 'Cadastrar'}</button>
                </form>
                <Link to="/">Já possui uma conta? Entre</Link>
            </div>
        </div>
    );
}
export default SignUp;