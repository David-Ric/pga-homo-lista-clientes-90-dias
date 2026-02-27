import React, { useEffect, useMemo, useState } from 'react';
import '../../styles/global.scss';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Paginacao from '../Paginacao';
import api from '../../services/api';
import { iDadosUsuario } from '../../@types';
import SideNavBar from '../Navbar/SideNavBar';
import NavbarDashHeader from '../Navbar/NavbarDashHeader';
import Footer from '../Footer/Footer';
import FooterMobile from '../Footer/FooterMobile';
import { moeda } from '../../Masks/Masks';
import logoSankhya from '../../assets/logo-dark.png';
import { useNavigate } from 'react-router-dom';
export default function PendenciasLista() {
  const usuario: iDadosUsuario = JSON.parse(localStorage.getItem('@Portal/usuario') || '{}');
  const [lista, setLista] = useState<any[]>([]);
  const [todosItens, setTodosItens] = useState<any[]>([]);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const pageSizeFront = 10;
  const pageSizeApi = 1000;
  const [parceiroDocs, setParceiroDocs] = useState<{ [key: string]: { nome: string; cnpj: string } }>({});
  const [loading, setLoading] = useState(true);
  const [showMensageSankhya, setShowMensageSankhya] = useState(false);
  const [showMensageSankhyaErro, setShowMensageSankhyaErro] = useState(false);
  const [sucess, setSucess] = useState(0);
  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      try {
        setShowMensageSankhya(true);
        setSucess(25);
        await api.post(`/api/Sankhya/login`);
        setSucess(60);
        const codVendedor = usuario.username;
        let p = 1;
        let acumulados: any[] = [];
        while (true) {
          const resp = await api.get(`/api/CabecalhoPedidoVenda/filter/vendedor?pagina=${p}&totalpagina=${pageSizeApi}&codVendedor=${codVendedor}`);
          const dados = resp?.data?.data ?? [];
          acumulados = acumulados.concat(dados);
          if (dados.length < pageSizeApi) {
            break;
          }
          p += 1;
        }
        const itensNaoEnviados = acumulados.filter((x: any) => String(x?.status || '').trim() === 'Não Enviado') || [];
        setTodosItens(itensNaoEnviados);
        setSucess(100);
        setShowMensageSankhya(false);
        setLoading(false);
      } catch {}
    })();
  }, []);
  const filtrados = useMemo(() => {
    return todosItens;
  }, [todosItens]);
  useEffect(() => {
    const startIndex = (pagina - 1) * pageSizeFront;
    const endIndex = startIndex + pageSizeFront;
    const paginated = filtrados.slice(startIndex, endIndex);
    setLista(paginated);
    setTotalPaginas(Math.max(1, Math.ceil(filtrados.length / pageSizeFront)));
    (async () => {
      try {
        const ids = Array.from(new Set(paginated.map((x: any) => x?.parceiroId).filter((x: any) => x !== undefined && x !== null)));
        const docsMap: { [key: string]: { nome: string; cnpj: string } } = {};
        await Promise.all(
          ids.map(async (id: any) => {
            try {
              const r = await api.get(`/api/Parceiro/${id}`);
              docsMap[String(id)] = { nome: String(r?.data?.nome ?? ''), cnpj: String(r?.data?.cnpj_Cpf ?? '') };
            } catch {}
          })
        );
        setParceiroDocs(docsMap);
      } catch {}
    })();
  }, [filtrados, pagina]);
  return (
    <>
      <div className="content-global">
        <div className="conteudo-cotainner">
          <div className="">
            <SideNavBar />
          </div>
          <div>
            <NavbarDashHeader />
            <div className="titulo-page">
              <h1>Pedidos Pendentes de Envio</h1>
            </div>
            <div style={{ justifyContent: 'center' }} className="contain d-flex">
              <div className="conteudo">
                <div className="table-responsive  tabela-responsiva-pedido-realizado">
                  <div className=" table-wrap">
                    <Table responsive className="table-global table  main-table">
                      <thead>
                        <tr className="tituloTab">
                          <th className="th1">Nº PALMPV</th>
                          <th style={{ textAlign: 'center' }} className="th1">
                            PED. SANKHYA
                          </th>
                          <th style={{ textAlign: 'center' }} className="th1">
                            VALOR
                          </th>
                          <th className="">STATUS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {lista.length > 0 ? (
                          <>
                            {lista.map((item: any, idx: number) => {
                              const docs = parceiroDocs[String(item?.parceiroId)] || { nome: '', cnpj: '' };
                              return (
                                <>
                                  <tr key={`hdr-${idx}`}>
                                    <td colSpan={4} className="bg-primary text-white">
                                      {String(item?.parceiroId ?? '')}
                                      {' - '}
                                      {String(item?.parceiroNome ?? docs.nome)}
                                      {' - '}
                                      {String(docs.cnpj)}
                                    </td>
                                  </tr>
                                  <tr
                                    key={`row-${idx}`}
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => {
                                      setShowMensageSankhya(true);
                                      setSucess(20);
                                      try {
                                        localStorage.setItem(
                                          'ClienteEscolhido',
                                          String(item?.parceiroId ?? '0')
                                        );
                                        localStorage.setItem(
                                          'ClienteNome',
                                          String(item?.parceiroNome ?? docs.nome ?? '')
                                        );
                                        localStorage.setItem(
                                          'PedidoSelecionadoId',
                                          String(item?.id ?? '0')
                                        );
                                        localStorage.setItem(
                                          'PedidoSelecionadoPALMPV',
                                          String(item?.palMPV ?? '')
                                        );
                                        localStorage.setItem(
                                          'PedidoInfoFilial',
                                          String(item?.filial ?? '')
                                        );
                                        localStorage.setItem(
                                          'PedidoInfoTipoNegociacaoId',
                                          String(item?.tipoNegociacaoId ?? '')
                                        );
                                        localStorage.setItem(
                                          'PedidoInfoTipPed',
                                          String(item?.tipPed ?? '')
                                        );
                                        localStorage.setItem(
                                          'PedidoInfoObservacao',
                                          String(item?.observacao ?? '')
                                        );
                                        localStorage.setItem(
                                          '@Portal/PedidoEmDigitacao',
                                          'true'
                                        );
                                      } catch {}
                                      navigate('/pedido_vendas');
                                    }}
                                  >
                                    <td style={{ textAlign: 'center' }} className="id-grupo">
                                      {String(item?.palMPV ?? '')}
                                    </td>
                                    <td
                                      style={
                                        item?.status?.trim() != 'Enviado' || item?.pedido == item?.palMPV
                                          ? { color: 'red' }
                                          : {}
                                      }
                                      className=""
                                    >
                                      {item?.status?.trim() == 'Enviado' && item?.pedido != item?.palMPV
                                        ? String(item?.pedido ?? '')
                                        : 'Nulo'}
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                      R$: {moeda(item?.valor)}
                                    </td>
                                    <td className="th1">
                                      <h2 className="textNEnviado2">A Enviar</h2>
                                    </td>
                                  </tr>
                                </>
                              );
                            })}
                          </>
                        ) : (
                          <tr>
                            <td colSpan={4}>
                              <div className="alert alert-warning" role="alert">Nenhum registro encontrado.</div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                    <Paginacao total={totalPaginas} limit={1} paginaAtual={pagina} setPagina={setPagina} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <FooterMobile />
      <Modal
        className="modal-confirm"
        show={showMensageSankhya}
        onHide={() => setShowMensageSankhya(false)}
        backdrop="static"
      >
        <Modal.Body>
          <img id="logoSankhya" src={logoSankhya} alt="" />
          <h1 style={{ marginTop: 15 }}>Carregando dados</h1>
          <h1 style={{ marginTop: 15 }}></h1>
          <ProgressBar className="progress" animated now={sucess} />
        </Modal.Body>
      </Modal>
      <Modal
        className="modal-confirmerror"
        show={showMensageSankhyaErro}
        onHide={() => setShowMensageSankhyaErro(false)}
        backdrop="static"
      >
        <Modal.Body>
          <img id="logoSankhya" src={logoSankhya} alt="" />
          <h1 style={{ marginTop: 15 }}></h1>
          <h1 style={{ marginTop: 15 }}>Erro de comunicação com servidor Sankhya!</h1>
          <h1 style={{ marginTop: 15 }}></h1>
          <button
            style={{ width: 130, marginTop: 15 }}
            className="btn btn-primary"
            onClick={() => setShowMensageSankhyaErro(false)}
          >
            Ok
          </button>
        </Modal.Body>
      </Modal>
    </>
  );
}
