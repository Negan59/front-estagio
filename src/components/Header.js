import React from 'react';
import logo from '../images/paroquia.jpeg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { Dropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importando o CSS do Bootstrap

const Header = () => {
    return (
        <div>
            <div className="login-icon">
                <Dropdown>
                    <Dropdown.Toggle variant="outline-primary" id="login-dropdown">
                        <FontAwesomeIcon icon={faUser} />
                        &nbsp;Login
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item href="#logout">Sair</Dropdown.Item>
                        <Dropdown.Item href="#help">Ajuda</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
            <div className="menu-bar">
                <img src={logo} alt="paroquia" className="logo" />
                <h1 className="parish-name">Paróquia Nossa Senhora Mãe da Igreja</h1>
            </div>
        </div>
    );
}

export default Header;
