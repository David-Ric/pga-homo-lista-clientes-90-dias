import React, { useEffect, useState, useRef } from 'react';
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
import {
  IComunicado,
  IComunicadocomercial,
  iDadosUsuario,
  iGrupoUsuario,
  IPermissoesRH,
} from '../../@types';
import Img1 from '../../assets/COMUNICADO.jpeg';
import Img2 from '../../assets/ANIVERSARIANTES.jpeg';
import Paginacao from '../../components/Paginacao/index';
import Table from 'react-bootstrap/Table';
import OverlayTrigger from 'react-bootstrap/esm/OverlayTrigger';
import { Tooltip } from 'react-bootstrap';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { RiDeleteBin5Line } from 'react-icons/ri';
import Nopost from '../../assets/nenhumpost.png';
import { IoMdAdd } from 'react-icons/io';

interface Comunicado {
  titulo: string;
  texto: string;
}

interface ComunicadoComImagem {
  id: number;
  imagem: string;
  imagemBase64: string;
  imagemURL: string;
  texto: string;
  titulo: string;
}

export default function ComunicacaoComercial() {
  const history = useNavigate();
  let [user, setUser] = useState('');
  let [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [msgErro, setMsgErro] = useState('');
  const [alertErro, setAlertErro] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showMensage, setShowMensage] = useState(false);
  const [showMensage2, setShowMensage2] = useState(false);
  let [editarMens, seteditarMens] = useState(false);
  let [comunicadoLista, setcomunicadosLista] = useState<IComunicadocomercial[]>(
    []
  );
  let [titulo, settitulo] = useState('');
  let [texto, settexto] = useState('');
  const [tabNav, setTabNav] = useState('NovoPost');
  const [showComunicado, setShowComunicado] = useState(false);
  const handleCloseMensage = () => setShowMensage(false);
  const handleCloseComunicado = () => setShowComunicado(false);

  function handleCloseMensage2() {
    setShowMensage2(false);
  }

  const [alertErroMensage, setAlertErroMensage] = useState(false);

  const usuario: iDadosUsuario = JSON.parse(
    localStorage.getItem('@Portal/usuario') || '{}'
  );

  const [pagina, setPagina] = useState(1);
  const [paginagr, setPaginagr] = useState(1);
  const [qtdePagina, setQtdePagina] = useState(10);
  const [qtdePaginagr, setQtdePaginagr] = useState(5);
  let [totalPaginas, setTotalPaginas] = useState(0);
  let [totalPaginasGr, setTotalPaginasGr] = useState(0);
  let [comunicadoId, setcomunicadoId] = useState('');
  let [grupoId, setgrupoId] = useState(0);

  function formatDate(dateTimeString: string): string {
    const dataAtual = new Date(dateTimeString);
    const dia = dataAtual.getDate().toString().padStart(2, '0');
    const mes = (dataAtual.getMonth() + 1).toString().padStart(2, '0');
    const ano = dataAtual.getFullYear().toString();
    return `${dia}/${mes}/${ano}`;
  }

  useEffect(() => {
    window.scrollTo(0, 0);
    GetPermiss();
    logado();
    GetgrupoUsuarioId();
  }, []);
  function logado() {
    if (!usuario.token) {
      history('/');
    }
  }

  let [comunicados, setComunicados] = useState<ComunicadoComImagem[]>([]);
  const [grupos, setgrupos] = useState<iGrupoUsuario[]>([]);
  const [permissoes, setpermissoes] = useState<IPermissoesRH[]>([]);
  const [grupo, setGrupo] = useState<iGrupoUsuario[]>([]);
  useEffect(() => {
    GetListaComunicado();
    Getgrupo();
  }, [pagina]);

  useEffect(() => {
    GetgrupoUsuarios();
  }, [paginagr]);

  async function getComunicados() {
    await api
      .get('/api/Comunicado')
      .then((response) => {
        setLoading(false);
        setComunicados(response.data);
        comunicados = response.data;
        console.log('comunicados', comunicados);
      })
      .catch((error) => {
        console.log('Ocorreu um erro');
      });
  }
  async function GetListaComunicado() {
    await api

      .get(
        `/api/ComunicadoComercial?pagina=${pagina}&totalpagina=${qtdePagina}`
      )
      .then((response) => {
        setLoading(false);
        setcomunicadosLista(response.data.data);
        comunicadoLista = response.data.data;
        setTotalPaginas(Math.ceil(response.data.total / qtdePagina));
      })
      .catch((error) => {
        console.log('Ocorreu um erro');
        setLoading(false);
      });
  }

  async function CreateComunicado() {
    if (titulo.trim() == '') {
      setAlertErroMensage(true);
      setMsgErro('É obrigatório inserir um título.');
      return;
    }

    setLoading(true);
    await api
      .post('/api/Comunicado', {
        titulo: titulo,
        texto: texto,
      })

      .then((response) => {
        setcomunicadoId(response.data.data);
        comunicadoId = response.data.data;
        console.log('id', comunicadoId);
        salvarImagem(response.data.data);
      })
      .catch((error) => {
        setLoading(false);

        console.log(error.response);
        setShowMensage(true);
        setMsgErro('Erro ao criar post.');
        return;
      });
  }
  const salvarImagem = async (idComunicado: number) => {
    const formData = new FormData();
    console.log(formData.get('image'));
    console.log(formData.get('image'));

    try {
      await api.post(`/api/Comunicado/${idComunicado}/Imagem`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Imagem salva com sucesso!');
      setLoading(false);
    } catch (error) {
      console.error('Erro ao salvar a imagem:', error);
      setLoading(false);
    }
  };

  async function GetgrupoUsuarioId() {
    await api

      .get(`/api/GrupoUsuario/${usuario.grupoId}`)
      .then((response) => {
        setLoading(false);
      })
      .catch((error) => {
        console.log('Ocorreu um erro');
      });
  }

  async function Getgrupo() {
    await api
      .get(`/api/GrupoUsuario?pagina=1&totalpagina=99`)
      .then((response) => {
        console.log('grupo geral', response.data.data);
        setGrupo(response.data.data);
      })
      .catch((error) => {
        console.log('Ocorreu um erro');
      });
  }
  const grupoMap: { [id: number]: string } = {};
  grupos.forEach((grupo) => {
    grupoMap[grupo.id] = grupo.nome;
  });

  async function GetgrupoUsuarios() {
    await api
      .get(`/api/GrupoUsuario?pagina=${paginagr}&totalpagina=${qtdePaginagr}`)
      .then((response) => {
        console.log('grupo de user', response.data);
        setgrupos(response.data.data);
        setTotalPaginasGr(Math.ceil(response.data.total / qtdePaginagr));
      })
      .catch((error) => {
        console.log('Ocorreu um erro');
      });
  }

  const [file, setFile] = useState<File | null>(null);

  //=================================================================
  const [comunicado, setComunicado] = useState<Comunicado>({
    titulo: '',
    texto: '',
  });
  const [imagem, setImagem] = useState<File | null>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setComunicado({ ...comunicado, [name]: value });
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    setImagem(event.target.files[0]);
  };
  const handleSubmit = async () => {
    if (titulo.trim() == '') {
      setShowMensage(true);
      setAlertErroMensage(true);
      setMsgErro('É obrigatório inserir um título.');
      return;
    }
    if (texto.trim() == '') {
      setShowMensage(true);
      setAlertErroMensage(true);
      setMsgErro('É obrigatório inserir um texto.');
      return;
    }
    const dataAtual = new Date();
    await api
      .post('/api/ComunicadoComercial', {
        titulo: titulo,
        texto: texto,
        grupoId: grupoId,
        criadoEm: dataAtual,
      })
      .then((response) => {
        console.log(response.data);
        settitulo('');
        titulo = '';
        settexto('');
        texto = '';
        setgrupoId(0);
        grupoId = 0;
        setLoading(false);
        getComunicados();
        GetListaComunicado();
        setShowMensage(true);
        setAlertErroMensage(true);
        setMsgErro('Comunicado criado com sucesso.');
      })
      .catch((error) => {
        setLoading(false);
        setShowMensage(true);
        setAlertErroMensage(true);
        setMsgErro('Ero ao tentar criar comunicado!!!');
      });
  };

  async function DeletePost(id: any) {
    setLoading(true);
    await api
      .delete(`/api/ComunicadoComercial/${id}`)
      .then((response) => {
        const index = comunicados.findIndex(
          (comunicado) => comunicado.id === id
        );
        const newComunicados = [...comunicados];
        newComunicados.splice(index, 1);
        setComunicados(newComunicados);
        console.log('excluido com sucesso');
        setLoading(false);
        getComunicados();
        GetListaComunicado();
        setShowMensage2(true);
        setAlertErroMensage(true);
        setMsgErro('Post excluido com sucesso.');
        console.log('comun', comunicados);
      })
      .catch((error) => {
        setLoading(false);
        console.log('ocorreu um erro');
      });
  }
  const [value, setValue] = useState('');

  function handleChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setValue(event.target.value);
  }

  async function DeletePerm(id: any) {
    await api
      .delete(`/api/PermissaoRH/${id}`)
      .then((response) => {
        GetPermiss();
        setShowMensage2(true);
        setAlertErroMensage(true);
        setMsgErro('Permissão removida!');
      })
      .catch((error) => {
        console.log('ocorreu um erro');
      });
  }

  async function PostPermi(grupoId: any) {
    await api
      .post(`/api/PermissaoRH`, {
        id: grupoId,
        grupoId: grupoId,
      })
      .then((response) => {
        setShowMensage2(true);
        setAlertErroMensage(true);
        setMsgErro('Permissões concedidas com sucesso!');
        GetPermiss();
      })
      .catch((error) => {
        setShowMensage2(true);
        setAlertErroMensage(true);
        setMsgErro(error.response.data);
        console.log('ocorreu um erro');
      });
  }

  async function GetPermiss() {
    await api
      .get(`/api/PermissaoRH`)
      .then((response) => {
        console.log('permissoes', response.data);
        setpermissoes(response.data);
      })
      .catch((error) => {
        console.log('ocorreu um erro');
      });
  }

  //==========================================================//
  return (
    <>
      {loading ? (
        <div className="d-flex justify-content-center total-loading">
          <div className="div-loading">
            <div className="spinner-border" role="status"></div>
            <h2 className="sr-only">Carregando...</h2>
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
                <h1>Comunicação Interna - Comercial</h1>
              </div>
              <div className="contain ">
                <div className="novoPost">
                  <div className="conteudo-cadastro-parceiro">
                    <div className="coluna-dupla">
                      <div className="blocoaddPost3">
                        <h1>CRIAR NOVO COMUNICADO</h1>
                        <p className="title-input">
                          Título: <span style={{ color: 'red' }}>*</span>
                        </p>
                        <input
                          type="text"
                          className="form-control inputparceiro"
                          value={titulo}
                          onChange={(e) => {
                            settitulo(e.target.value);
                            titulo = e.target.value;
                          }}
                        />
                        <p className="title-input">
                          Texto: <span style={{ color: 'red' }}>*</span>
                        </p>
                        <textarea
                          name="texto"
                          value={texto}
                          className="form-control inputparceirotext"
                          style={{ minHeight: 100, textAlign: 'justify' }}
                          onChange={(e) => {
                            settexto(e.target.value);
                            texto = e.target.value;
                          }}
                        />
                        <p className="title-input">
                          Grupo: <span style={{ color: 'red' }}>*</span>
                        </p>
                        <div className="table-responsive table-scroll  tabelaPost tabelagrupopost">
                          <div className=" table-wrap">
                            <Table
                              responsive
                              className="table-global table  main-table"
                            >
                              <thead>
                                <tr className="tituloTab">
                                  <th
                                    style={{ textAlign: 'center' }}
                                    className="IdPsot"
                                  >
                                    Id
                                  </th>
                                  <th
                                    style={{ textAlign: 'left' }}
                                    className="th2 nome-grupo textTi"
                                  >
                                    Nome
                                  </th>
                                  <th
                                    style={{ color: 'transparent' }}
                                    className="th2 nome-grupo"
                                  >
                                    .......
                                  </th>
                                  <th
                                    style={{ color: 'transparent' }}
                                    className="th2 nome-grupo"
                                  >
                                    .......
                                  </th>
                                  <th
                                    style={{ textAlign: 'center' }}
                                    className="th4 fixed-table"
                                  >
                                    Ações
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {grupos.length > 0 ? (
                                  <>
                                    {grupos.map((comunicado, index) => (
                                      <tr
                                        key={index}
                                        className={
                                          grupoId === comunicado.id
                                            ? 'permiDada'
                                            : ''
                                        }
                                      >
                                        <td
                                          style={{ textAlign: 'center' }}
                                          onClick={() => {
                                            setgrupoId(comunicado.id);
                                            grupoId = comunicado.id;
                                            console.log('grupo', grupoId);
                                          }}
                                          className="IdPsot"
                                        >
                                          {comunicado.id}
                                        </td>
                                        <td
                                          style={{ textAlign: 'left' }}
                                          onClick={() => {
                                            setgrupoId(comunicado.id);
                                            grupoId = comunicado.id;
                                            console.log('grupo', grupoId);
                                          }}
                                          className="nome-grupo textTi"
                                        >
                                          {comunicado.nome}
                                        </td>
                                        <td
                                          style={{ color: 'transparent' }}
                                          className="th2 nome-grupo"
                                        >
                                          .......
                                        </td>
                                        <td
                                          style={{ textAlign: 'center' }}
                                          className="fixed-table td-fixo"
                                        >
                                          <OverlayTrigger
                                            placement={'right'}
                                            delay={{ show: 100, hide: 250 }}
                                            overlay={
                                              <Tooltip>Adicionar</Tooltip>
                                            }
                                          >
                                            <button
                                              type="button"
                                              onClick={() => {
                                                setgrupoId(comunicado.id);
                                                grupoId = comunicado.id;
                                                console.log('grupo', grupoId);
                                              }}
                                              className="btn btn-table  btn-edit"
                                            >
                                              <IoMdAdd />
                                            </button>
                                          </OverlayTrigger>
                                        </td>
                                      </tr>
                                    ))}
                                  </>
                                ) : (
                                  <div
                                    style={{ margin: 'auto' }}
                                    className="alert alert-warning alertaComu"
                                    role="alert"
                                  >
                                    Nenhum grupo encontrado.
                                  </div>
                                )}
                              </tbody>
                            </Table>
                            <Paginacao
                              total={totalPaginasGr}
                              limit={1}
                              paginaAtual={paginagr}
                              setPagina={setPaginagr}
                            />
                          </div>
                        </div>
                        <button
                          style={{ marginTop: 20 }}
                          className="btn btn-primary"
                          type="button"
                          onClick={handleSubmit}
                        >
                          Salvar Post
                        </button>
                        {editarMens ? (
                          <>
                            <button
                              style={{ marginTop: 20, marginLeft: 20 }}
                              className="btn btn-danger"
                              type="button"
                              onClick={() => {
                                settitulo('');
                                titulo = '';
                                settexto('');
                                texto = '';
                                setgrupoId(0);
                                grupoId = 0;
                                seteditarMens(false);
                                editarMens = false;
                              }}
                            >
                              voltar
                            </button>
                          </>
                        ) : (
                          <></>
                        )}
                      </div>
                      <div className="blocoaddPost5">
                        <h1>LISTA DE COMUNICADOS</h1>
                        <div className="table-responsive table-scroll tabela-responsiva tabelaPost">
                          <div className=" table-wrap">
                            <Table
                              responsive
                              className="table-global table  main-table"
                            >
                              <thead>
                                <tr className="tituloTab">
                                  <th
                                    style={{ textAlign: 'center' }}
                                    className="IdPsot"
                                  >
                                    Id
                                  </th>
                                  <th
                                    style={{ textAlign: 'left' }}
                                    className="th2 nome-grupo textTi"
                                  >
                                    Grupo
                                  </th>
                                  <th
                                    style={{ textAlign: 'left' }}
                                    className="th2 nome-grupo textTi"
                                  >
                                    Data de criação
                                  </th>
                                  <th
                                    style={{ textAlign: 'left' }}
                                    className="th2 nome-grupo"
                                  >
                                    Título
                                  </th>
                                  <th
                                    style={{ color: 'transparent' }}
                                    className="th2 nome-grupo"
                                  >
                                    .......
                                  </th>
                                  <th
                                    style={{ textAlign: 'center' }}
                                    className="th4 fixed-table"
                                  >
                                    Ações
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {comunicadoLista.length > 0 ? (
                                  <>
                                    {comunicadoLista.map(
                                      (comunicado, index) => (
                                        <tr key={index}>
                                          <td
                                            style={{ textAlign: 'center' }}
                                            className="IdPsot"
                                            onClick={() => {
                                              settitulo(comunicado.titulo);
                                              titulo = comunicado.titulo;
                                              settexto(comunicado.texto);
                                              texto = comunicado.texto;
                                              setgrupoId(comunicado.grupoId);
                                              grupoId = comunicado.grupoId;
                                              seteditarMens(true);
                                              editarMens = true;
                                            }}
                                          >
                                            {comunicado.id}
                                          </td>
                                          <td
                                            style={{ textAlign: 'left' }}
                                            className="nome-grupo textTi"
                                            onClick={() => {
                                              settitulo(comunicado.titulo);
                                              titulo = comunicado.titulo;
                                              settexto(comunicado.texto);
                                              texto = comunicado.texto;
                                              setgrupoId(comunicado.grupoId);
                                              grupoId = comunicado.grupoId;
                                              seteditarMens(true);
                                              editarMens = true;
                                            }}
                                          >
                                            {grupoMap[comunicado.grupoId]}
                                          </td>
                                          <td
                                            style={{ textAlign: 'center' }}
                                            className="nome-grupo textTi"
                                            onClick={() => {
                                              settitulo(comunicado.titulo);
                                              titulo = comunicado.titulo;
                                              settexto(comunicado.texto);
                                              texto = comunicado.texto;
                                              setgrupoId(comunicado.grupoId);
                                              grupoId = comunicado.grupoId;
                                              seteditarMens(true);
                                              editarMens = true;
                                            }}
                                          >
                                            {formatDate(comunicado.criadoEm)}
                                          </td>
                                          <td
                                            style={{ textAlign: 'left' }}
                                            className="th2 nome-grupo"
                                          >
                                            {comunicado.titulo}
                                          </td>

                                          <td
                                            style={{ textAlign: 'center' }}
                                            className="fixed-table td-fixo"
                                          >
                                            <OverlayTrigger
                                              placement={'left'}
                                              delay={{ show: 100, hide: 250 }}
                                              overlay={
                                                <Tooltip>Adicionar</Tooltip>
                                              }
                                            >
                                              <button
                                                type="button"
                                                style={{ marginRight: 15 }}
                                                onClick={() => {
                                                  settitulo(comunicado.titulo);
                                                  titulo = comunicado.titulo;
                                                  settexto(comunicado.texto);
                                                  texto = comunicado.texto;
                                                  setgrupoId(
                                                    comunicado.grupoId
                                                  );
                                                  grupoId = comunicado.grupoId;
                                                }}
                                                className="btn btn-table  btn-edit"
                                              >
                                                <IoMdAdd />
                                              </button>
                                            </OverlayTrigger>
                                            <OverlayTrigger
                                              placement={'right'}
                                              delay={{
                                                show: 100,
                                                hide: 250,
                                              }}
                                              overlay={
                                                <Tooltip>Excluir</Tooltip>
                                              }
                                            >
                                              <button
                                                onClick={() => {
                                                  DeletePost(comunicado.id);
                                                }}
                                                className="btn btn-table btn-delete"
                                              >
                                                <RiDeleteBin5Line />
                                              </button>
                                            </OverlayTrigger>
                                          </td>
                                        </tr>
                                      )
                                    )}
                                  </>
                                ) : (
                                  <div
                                    style={{ margin: 'auto' }}
                                    className="alert alert-warning alertaComu"
                                    role="alert"
                                  >
                                    Nenhum comunicado encontrado.
                                  </div>
                                )}
                              </tbody>
                            </Table>
                            <Paginacao
                              total={totalPaginas}
                              limit={1}
                              paginaAtual={pagina}
                              setPagina={setPagina}
                            />
                          </div>
                        </div>
                      </div>
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
                  <div className="mt-3 mb-0">
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
            {/* //============= modal confirmação 2 ============================ */}

            <Modal
              className="modal-confirm"
              show={showMensage2}
              onHide={handleCloseMensage2}
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
                <button
                  style={{ width: 130 }}
                  className="btn btn-primary"
                  onClick={handleCloseMensage2}
                >
                  Ok
                </button>
              </Modal.Body>
            </Modal>

            {/* ==================== Modal Modelo Comunicado ================================= */}
            <Modal
              className="modal-confirm"
              show={showComunicado}
              onHide={handleCloseComunicado}
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
                <button
                  style={{ width: 130 }}
                  className="btn btn-primary"
                  onClick={handleCloseMensage}
                >
                  Ok
                </button>
              </Modal.Body>
            </Modal>
          </div>
          <Footer />
        </>
      )}
    </>
  );
}
