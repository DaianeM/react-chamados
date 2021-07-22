
import { useContext } from 'react';
import { AuthContext } from '../contexts/auth';
import { Route, Redirect } from 'react-router-dom';

export default function RouteWrapper({component: Component, isPrivate, ...rest}){
    
    const { signed, loading } = useContext(AuthContext);

    //se carregando...
    if(loading){
      return(
          <div></div>
      );
    }

    //se não está logado e a rota é privada, REDIRECIONA
    if(!signed && isPrivate){
        return <Redirect to="/" />
    }

    //se logado e a rota não é privada, REDIECIONA DASH
    if(signed && !isPrivate){
        return <Redirect to="/dashboard" />
    }
    

    return(
        <Route 
            {...rest}
            render={props => (
                <Component {...props}/>
            )}
        />
    );
}