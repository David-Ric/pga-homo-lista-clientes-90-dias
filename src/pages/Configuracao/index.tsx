import React, { useEffect, useState } from 'react';
import '../../styles/global.scss';
import Navbar from '../../components/Navbar/Navbar';
import LogoOle from '../../assets/ole-logo.png';
import LogoAvatar from '../../assets/avatar1.png';
import Messeger from '../../assets/messege.png';
import ChampGif from '../../assets/playy.gif';
import Footer from '../../components/Footer/Footer';
import { RedirectFunction } from 'react-router';
import { useNavigate } from 'react-router-dom';
import Logo from '../../assets/logo-dark.png';
import api from '../../services/api';
import Alert from '../../components/Alert';
import SideNavBar from '../../components/Navbar/SideNavBar';
import NavbarDashHeader from '../../components/Navbar/NavbarDashHeader/index';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import { iDadosUsuario } from '../../@types';
import axios from 'axios';
import logoSankhya from '../../assets/logo-dark.png';
import ProgressBar from 'react-bootstrap/ProgressBar';
import FooterMobile from '../../components/Footer/FooterMobile';

type Apontamento = {
  id: number;
  title: string;
};

export default function Configuracoes() {
  const history = useNavigate();
  let [user, setUser] = useState('');
  let [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [msgErro, setMsgErro] = useState('');
  const [alertErro, setAlertErro] = useState(false);
  let [producao, setProducao] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showMensage, setShowMensage] = useState(false);
  const handleCloseMensage = () => setShowMensage(false);
  const [alertErroMensage, setAlertErroMensage] = useState(false);
  let [tipoApont, settipoApont] = useState('');
  const usuario: iDadosUsuario = JSON.parse(
    localStorage.getItem('@Portal/usuario') || '{}'
  );

  const [showupdate, setShowupdate] = useState(false);
  const [atualizarSistem, setatualizarSistem] = useState(false);
  const handleCloseupdate = () => setShowupdate(false);
  const [fixo1, setFixo1] = useState(true);
  const [fixo2, setFixo2] = useState(true);
  const [apontamentoSankhya, setApontamentoSankhya] = useState('');
  const [usuarioSankhya, setusuarioSankhya] = useState('');
  const [senhaSankhya, setsenhaSankhya] = useState('');
  const [tempoSessao, setTempoSessao] = useState(0);
  const [sql, setsql] = useState('');
  let [sucess, setSucess] = useState(0);

  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File>();
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.readAsText(selectedFile);
      reader.onload = () => {
        const fileContent = reader.result as string;
        const jsonContent = JSON.parse(fileContent);
        setTitle(jsonContent.title);
      };
    }
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    logado();
    GetapontamentoId();
    VerificarAtualizacao();
  }, []);

  function logado() {
    if (
      localStorage.getItem('@Portal/superusuario') == 'true' ||
      usuario.username == 'admin'
    ) {
      setLoading(false);
    } else {
      history('/');
    }
  }
  async function PararAtualizarSistema() {
    await api
      .delete('/api/ComunicadoComercial/1')
      .then((response) => {
        VerificarAtualizacao();
      })
      .catch((error) => {
        setLoading(false);
      });
  }

  async function AtualizarSistema() {
    await api
      .post('/api/ComunicadoComercial', {
        id: 1,
        titulo: 'Atualizar Sistema',
        texto: 'Atualizando',
        grupoId: 0,
        criadoEm: '2023-08-25T12:43:09.617Z',
      })
      .then((response) => {
        VerificarAtualizacao();
      })
      .catch((error) => {
        setLoading(false);
      });
  }

  async function VerificarAtualizacao() {
    await api
      .get(`/api/ComunicadoComercial?pagina=1&totalpagina=999`)
      .then((response) => {
        console.log('verificar atualização', response.data.data);
        if (response.data.data.length > 0) {
          setatualizarSistem(true);
        } else {
          setatualizarSistem(false);
        }
      })
      .catch((error) => {
        console.log('erro de conexao');
      });
  }

  async function GetapontamentoId() {
    setLoading(true);
    setSucess(20);
    await api

      .get(`/api/Configuracao/1`)
      .then((response) => {
        console.log('apontamento', response.data.sankhyaServidor);
        setApontamentoSankhya(response.data.sankhyaServidor);
        setusuarioSankhya(response.data.sankhyaUsuario);
        setsenhaSankhya(response.data.sankhyaSenha);
        setTempoSessao(response.data.tempoSessao);
        setSucess(80);
        setLoading(false);
      })
      .catch((error) => {
        console.log('Ocorreu um erro');
        setLoading(false);
      });
  }

  async function MudarApontamento() {
    await api
      .put(`/api/Configuracao/1`, {
        Id: 1,
        SankhyaServidor: apontamentoSankhya,
        SankhyaUsuario: usuarioSankhya,
        SankhyaSenha: senhaSankhya,
        TempoSessao: tempoSessao,
      })
      .then((response) => {
        console.log('apontamento editado', response.data);
        setShowMensage(true);
        setAlertErroMensage(true);
        setMsgErro('Apontamento realizado com sucesso!');
      })
      .catch((error) => {
        console.log('Ocorreu um erro');
      });
  }

  async function MudarSessao() {
    await api
      .put(`/api/Configuracao/1`, {
        Id: 1,
        SankhyaServidor: apontamentoSankhya,
        SankhyaUsuario: 'ADMIN',
        SankhyaSenha: 'SYNC550V',
        TempoSessao: tempoSessao,
      })
      .then((response) => {
        console.log('apontamento editado', response.data);
        setShowMensage(true);
        setAlertErroMensage(true);
        setMsgErro('Tempo de Sessão alterado com sucesso!');
        localStorage.setItem('@Portal/TempoSessao', String(tempoSessao));
      })
      .catch((error) => {
        console.log('Ocorreu um erro');
      });
  }

  async function EnviarSql() {
    await api
      .post(`/api/InjecaoSQL/executar-sql?sql=${sql}`)
      .then((response) => {
        setsql('');
        console.log('slq', response.data);
        setShowMensage(true);
        setAlertErroMensage(true);
        setMsgErro(response.data);
      })
      .catch((error) => {
        console.log(error.respose);
        setShowMensage(true);
        setAlertErroMensage(true);
        const data = error.response.data;
        setMsgErro(data);
        return;
      });
  }

  async function AtualizarDados() {
    setShowupdate(true);
    setSucess(0);
    sucess = 0;
    Sucess();
    setAlertErroMensage(true);
    setMsgErro('Atualizando dados...');
    await api
      .post('/api/RestaurarMenu')
      .then((response) => {
        window.location.reload();
        setLoading(false);
        console.log(response);
        setShowupdate(true);
        setAlertErroMensage(true);
        setMsgErro('Dados atualizados com sucesso!!!');
      })
      .catch((error) => {
        setLoading(false);
      });
  }
  function Sucess() {
    setTimeout(function () {
      setSucess(20);
      sucess = 20;
      Sucess2();
    }, 1200);
  }
  function Sucess2() {
    setTimeout(function () {
      setSucess(40);
      sucess = 40;
      Sucess3();
    }, 1000);
  }
  function Sucess3() {
    setTimeout(function () {
      setSucess(100);
      sucess = 100;
      Sucess();
    }, 1000);
  }

  async function CreateComunicado() {
    setLoading(true);
    await api
      .post('/api/Comunicado', {
        titulo: 'ATUALIZAÇÃO',
        texto: 'NOVA ATUALIZAÇÃO',
      })

      .then((response) => {
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error.response);
        setShowMensage(true);
        setMsgErro('Erro ao criar post.');
        return;
      });
  }

  //==========================================================//
  return (
    <>
      {loading ? (
        <div className="loadingGeral">
          <div className="loadingModal">
            <img id="logoSankhya" src={logoSankhya} alt="" />
            <h1 style={{ marginTop: 15 }}>Carregando dados...</h1>
            <h1 style={{ marginTop: 15 }}></h1>
            <ProgressBar className="progress" animated now={sucess} />
          </div>
        </div>
      ) : (
        <>
          <div className="content-global">
            <div className="conteudo-cotainner">
              <div className="">
                <SideNavBar />
              </div>
              <NavbarDashHeader />
              <div className="titulo-page">
                <h1>Configuraçôes Gerais</h1>
              </div>
              <div className="contain">
                <div className="conteudo">
                  <div className="divApontamento">
                    <div className="div-controles">
                      <div>
                        <h1 className="title-input">Apontamento Sankhya:</h1>
                        <input
                          id="sankhya"
                          value={apontamentoSankhya}
                          type="text"
                          className="form-control select inputparceiro inputApont"
                          onChange={(e) => {
                            setApontamentoSankhya(e.target.value);
                          }}
                        />
                      </div>
                      <div className="d-flex">
                        <div>
                          <h1 className="title-input">Usuario Sankhya:</h1>
                          <input
                            id="sankhya"
                            value={usuarioSankhya}
                            type="text"
                            className="form-control select inputparceiro inputApont"
                            onChange={(e) => {
                              setusuarioSankhya(e.target.value);
                            }}
                          />
                        </div>
                        <div style={{ marginLeft: 20 }}>
                          <h1 className="title-input">Senha Sankhya:</h1>
                          <input
                            id="sankhya"
                            value={senhaSankhya}
                            type="password"
                            className="form-control select inputparceiro inputApont"
                            onChange={(e) => {
                              setsenhaSankhya(e.target.value);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <button
                      className="btn btn-primary editarUrul"
                      onClick={() => {
                        MudarApontamento();
                      }}
                    >
                      Salvar
                    </button>
                  </div>
                  <div className="divApontamento">
                    <div className="div-controles">
                      <h1 className="title-input">Tempo de Sessão Geral:</h1>
                      <div className="d-flex">
                        <input
                          id="sankhya-sessao"
                          value={tempoSessao}
                          type="number"
                          className="form-control select inputparceiro inputApontSessao"
                          onChange={(e) => {
                            setTempoSessao(Number(e.target.value));
                          }}
                        />
                        <h1 className="title-input">Minutos</h1>
                      </div>
                    </div>
                    <button
                      className="btn btn-primary editarUrul"
                      onClick={() => {
                        MudarSessao();
                      }}
                    >
                      Salvar
                    </button>
                  </div>
                  <div className="divApontamento">
                    <div className="div-controles">
                      <h1 className="title-input">Injeção SQL:</h1>
                      <input
                        id="sistema"
                        value={sql}
                        type="text"
                        className="form-control select inputparceiro inputApont"
                        onChange={(e) => {
                          setsql(e.target.value);
                        }}
                      />
                    </div>
                    <button
                      className="btn btn-primary editarUrul"
                      onClick={EnviarSql}
                    >
                      Enviar
                    </button>
                  </div>
                  <div className="divApontamento">
                    <div className="div-controles">
                      <h1 className="title-input">Atualização do Sistema:</h1>
                      {atualizarSistem ? (
                        <>
                          <div className="d-flex">
                            <button
                              style={{
                                marginTop: 15,
                                marginBottom: 15,
                                marginLeft: 10,
                              }}
                              className="btn btn-danger"
                              onClick={PararAtualizarSistema}
                            >
                              Parar Atualização
                            </button>
                            <h1 style={{ color: 'red' }}>
                              Sistema atualizando...
                            </h1>
                          </div>
                        </>
                      ) : (
                        <>
                          <button
                            style={{
                              marginTop: 15,
                              marginBottom: 15,
                              marginLeft: 10,
                            }}
                            className="btn btn-dark"
                            onClick={AtualizarSistema}
                          >
                            Atualizar Sistema
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* ================Modal Cofirmação ============================================== */}

            <Modal
              className="modal-confirm"
              show={showMensage}
              onHide={handleCloseMensage}
            >
              <Modal.Header closeButton>
                <h1>Status da solicitação</h1>
              </Modal.Header>
              <Modal.Body>
                {alertErroMensage && (
                  <div className="mt-3 mb-0  mensagemErropadrao">
                    <Alert msg={msgErro} setAlertErro={setAlertErroMensage} />
                  </div>
                )}
                <button
                  style={{ width: 130 }}
                  className="btn btn-primary"
                  onClick={handleCloseMensage}
                >
                  Ok
                </button>
              </Modal.Body>
            </Modal>

            {/* =================== modal dados atualizados ================================= */}
            <Modal
              className="modal-confirm"
              show={showupdate}
              onHide={handleCloseupdate}
            >
              <Modal.Header closeButton>
                <h1>Status da solicitação</h1>
              </Modal.Header>
              <Modal.Body>
                {alertErroMensage && (
                  <div className="mt-3 mb-0">
                    <Alert msg={msgErro} setAlertErro={setAlertErroMensage} />
                  </div>
                )}
                <ProgressBar className="progress" animated now={sucess} />
                <button
                  style={{ width: 130, marginTop: 15 }}
                  className="btn btn-primary"
                  onClick={handleCloseupdate}
                >
                  Ok
                </button>
              </Modal.Body>
            </Modal>
          </div>
          <FooterMobile />
          <Footer />
        </>
      )}
    </>
  );
}
