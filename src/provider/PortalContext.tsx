import React, { createContext, useContext, useState, useEffect } from 'react';
import { iDadosUsuario } from '../@types';
import { LoginSankhyaDashAdmin, LoginSankhyaDashRepresentante } from '../functions/FuncoesDash';
import { MetaXRealizado } from '../functions/FuncoesRelatorio';

interface iGrafico {
  Mes: string;
  AnoAtual: number;
  AnoAnterior: number;
}

interface Row {
  id: number;
  month: string;
  meta: number;
  actual: number;
  color: string;
}

interface Relatorios{
  valor01:any;
  valor02:any;
  valor03:any;
  valor04:any;
  valor05:any;
  valor06:any;
  valor07:any;
  valor08:any;
  valor09:any;
  valor10:any;
  valor11:any;
  valor12:any;
  valor13:any;
  valor14:any;
  valor15:any;
  valor16:any;
  valor17:any;
  valor18:any;
  valor19:any;
}
interface iGraficoRela {
  id: number;
  valor01: number;
  valor02: number;
}

const usuario: iDadosUsuario = JSON.parse(
  localStorage.getItem("@Portal/usuario") || "{}"
);

export const PortalContext = createContext({});


export const PortalProvider = ({ children }: { children: React.ReactNode }) => {

  //============= Dashbosrd ==========================================================
  const [graficoTotal, setGraficoTotal] = useState<iGrafico[]>([]);
  const [valorAnoAnterior, setValorAnoAnterior] = useState<any[]>([]);
  const [valorAnoAtual, setValorAnoAtual] = useState<any[]>([]);
  const [valorTotalAno, setValorTotalAno] = useState<number>(0);
  const [vendaXmeta, setVendaXmeta] = useState<Row[]>([]);
  const [metaMes, setMetaMes] = useState<number>(0);
  const [vendaMes, setVendaMes] = useState<number>(0);
  const [quantPedidoOrcamentoDash, setquantPedidoOrcamentoDash] = useState<number>(0);
  const [valorPedidoOrcamentoDash, setvalorPedidoOrcamentoDash] = useState<number>(0);
  const [quantFaturarDash, setquantFaturarDash] = useState<number>(0);
  const [valorFaturarDash, setvalorFaturarDash] = useState<number>(0);
  const [quantPedidoDash, setquantPedidoDash] = useState<number>(0);
  const [valorPedidoDash, setvalorPedidoDash] = useState<number>(0);

  


  useEffect(() => {
    const graficoTotalStorage = JSON.parse(localStorage.getItem("@Portal/dash/graficoTotal") || "{}");
    const valorAnteriorStorage = JSON.parse(localStorage.getItem("@Portal/dash/ValorAnterior") || "{}");
    const valorAtualStorage = JSON.parse(localStorage.getItem("@Portal/dash/ValorAtual") || "{}");
    const valorTotalAnoStorage = JSON.parse(localStorage.getItem("@Portal/dash/valorTotalAno") || "{}");
    const vendaXmetaStorage = JSON.parse(localStorage.getItem("@Portal/dash/VendaXmeta") || "{}");
    const metaMesStorage = Number(localStorage.getItem("@Portal/dash/metaMes")) || 0;
    const vendaMesStorage = Number(localStorage.getItem("@Portal/dash/vendaMes")) || 0;
    console.log('graficoTotalStorage:', graficoTotalStorage);
    console.log('valorAnteriorStorage:', valorAnteriorStorage);
    console.log('valorAtualStorage:', valorAtualStorage);
    console.log('valorTotalAnoStorage:', valorTotalAnoStorage);
    console.log('vendaXmetaStorage:', vendaXmetaStorage);
    console.log('metaMesStorage:', metaMesStorage);
    console.log('vendaMesStorage:', vendaMesStorage);
    if (graficoTotalStorage) {
      setGraficoTotal(graficoTotalStorage);
    }
    if (valorAnteriorStorage) {
      setValorAnoAnterior(valorAnteriorStorage);
    }
    if (valorAtualStorage) {
      setValorAnoAtual(valorAtualStorage);
    }
    if (valorTotalAnoStorage) {
      setValorTotalAno(valorTotalAnoStorage);
    }
    if (vendaXmetaStorage) {
      setVendaXmeta(vendaXmetaStorage);
    }
     if (metaMesStorage) {
       setMetaMes(metaMesStorage);
     }
     if (vendaMesStorage) {
       setVendaMes(vendaMesStorage);
     }
  }, []);


//===============================================================================
  return (
    <PortalContext.Provider
      value={{
        graficoTotal,
        setGraficoTotal,
        valorAnoAnterior,
        setValorAnoAnterior,
        valorAnoAtual,
        setValorAnoAtual,
        valorTotalAno,
        setValorTotalAno,
        vendaXmeta,
        setVendaXmeta,
        metaMes,
        setMetaMes,
        vendaMes,
        setVendaMes,
      }}
    >
      {children}
    </PortalContext.Provider>
  );
};

 export const online = window.navigator.onLine;
 export let graficoTotal: iGrafico[] = JSON.parse(localStorage.getItem("@Portal/dash/graficoTotal") || "[]");
 export let valorAnoAnterior: any[] = JSON.parse(localStorage.getItem("@Portal/dash/ValorAnterior") || "[]");
 export let valorAnoAtual: any[] = JSON.parse(localStorage.getItem("@Portal/dash/ValorAtual") || "[]");
 export let valorTotalAno: number = JSON.parse(localStorage.getItem("@Portal/dash/valorTotalAno") || "0");
 export let vendaXmeta: Row[] = JSON.parse(localStorage.getItem("@Portal/dash/VendaXmeta") || "[]");
 export let metaMes: number = Number(localStorage.getItem("@Portal/dash/metaMes")) || 0;
 export let vendaMes: number = Number(localStorage.getItem("@Portal/dash/vendaMes")) || 0;
 export let quantPedidoOrcamentoDash: number = JSON.parse(localStorage.getItem("@Portal/dash/QuantPedidoOrcamento") || "0");
 export let valorPedidoOrcamentoDash: number = JSON.parse(localStorage.getItem("@Portal/dash/ValorPedidoOrcamento") || "0");
 export let quantFaturarDash: number = JSON.parse(localStorage.getItem("@Portal/dash/QuantFaturar") || "0");
 export let valorFaturarDash: number = JSON.parse(localStorage.getItem("@Portal/dash/ValorFaturar") || "0");
 export let quantPedidoDash: number = JSON.parse(localStorage.getItem("@Portal/dash/QuantPedidos") || "0");
 export let valorPedidoDash: number = JSON.parse(localStorage.getItem("@Portal/dash/ValorPedidos") || "0");
 export let clientesSemVendaDash: number = JSON.parse(localStorage.getItem("@Portal/dash/ClientesSemVenda") || "0");

 //======RELATORIOS REPRESENTANTE =====================================================================================================
 
 export let metaXrealizado: iGraficoRela [] = JSON.parse(localStorage.getItem("@Portal/Relatorio/MetaXrealizado") || "[]");
 export let pedidoFaturar: Relatorios[] = JSON.parse(localStorage.getItem("@Portal/Relatorio/PedidoFaturar") || "[]");
 export let listaCobranca: Relatorios[] = JSON.parse(localStorage.getItem("@Portal/Relatorio/ListaCobranca") || "[]");
 export let vendaClientesCrescimento: Relatorios[] = JSON.parse(localStorage.getItem("@Portal/Relatorio/VendaClientesCrescimento") || "[]");
 export let vendaProdutoCrescimento: Relatorios[] = JSON.parse(localStorage.getItem("@Portal/Relatorio/VendaProdutoCrescimento") || "[]");
 export let vendaClientesQueda: Relatorios[] = JSON.parse(localStorage.getItem("@Portal/Relatorio/VendaClienteQueda") || "[]");
 export let vendaProdutoQueda: Relatorios[] = JSON.parse(localStorage.getItem("@Portal/Relatorio/VendaProdutoQueda") || "[]");

//======================================================================================================================================
 export const limparDadosDash = () => {
  graficoTotal = [];
  valorAnoAnterior = [];
  valorAnoAtual = [];
  valorTotalAno = 0;
  vendaXmeta = [];
  metaMes = 0;
  vendaMes = 0;
  quantPedidoOrcamentoDash = 0;
  valorPedidoOrcamentoDash = 0;
  quantFaturarDash = 0;
  valorFaturarDash = 0;
  quantPedidoDash = 0;
  valorPedidoDash = 0;
  clientesSemVendaDash = 0;
  console.log("limpando dados do dash")
}
export const limparDadosRelatorios = () => {
   metaXrealizado = [];
   pedidoFaturar = [];
   listaCobranca = [];
   vendaClientesCrescimento = [];
   vendaProdutoCrescimento = [];
   vendaClientesQueda = [];
   vendaProdutoQueda = [];
   console.log("limpando dados dos relatorios")
}

export const atualizaCartaoHome =() =>{
  console.log("entrou no atualizar cartão")
  const metaMesString = localStorage.getItem("@Portal/dash/metaMes")|| "0";
  const metaMes = metaMesString && isJSONString(metaMesString) ? JSON.parse(metaMesString) : 0;
  
  const vendaMesString = localStorage.getItem("@Portal/dash/vendaMes")|| "0";
  const vendaMes = vendaMesString && isJSONString(vendaMesString) ? JSON.parse(vendaMesString) : 0;

  function isJSONString(str:any) {
    try {
      JSON.parse(str);
      return true;
    } catch (error) {
      return false;
    }
  }

}

export const atualizarConstantes = () => {
  graficoTotal = JSON.parse(localStorage.getItem("@Portal/dash/graficoTotal") || "[]");
  valorAnoAnterior = JSON.parse(localStorage.getItem("@Portal/dash/ValorAnterior") || "[]");
  valorAnoAtual = JSON.parse(localStorage.getItem("@Portal/dash/ValorAtual") || "[]");
  valorTotalAno = JSON.parse(localStorage.getItem("@Portal/dash/valorTotalAno") || "0");
  vendaXmeta = JSON.parse(localStorage.getItem("@Portal/dash/VendaXmeta") || "[]");
  metaMes = JSON.parse(localStorage.getItem("@Portal/dash/metaMes") || "0");
  vendaMes = JSON.parse(localStorage.getItem("@Portal/dash/vendaMes") || "0");
  quantPedidoOrcamentoDash = JSON.parse(localStorage.getItem("@Portal/dash/QuantPedidoOrcamento") || "0");
  valorPedidoOrcamentoDash = JSON.parse(localStorage.getItem("@Portal/dash/ValorPedidoOrcamento") || "0");
  quantFaturarDash = JSON.parse(localStorage.getItem("@Portal/dash/QuantFaturar") || "0");
  valorFaturarDash = JSON.parse(localStorage.getItem("@Portal/dash/ValorFaturar") || "0");
  quantPedidoDash = JSON.parse(localStorage.getItem("@Portal/dash/QuantPedidos") || "0");
  valorPedidoDash = JSON.parse(localStorage.getItem("@Portal/dash/ValorPedidos") || "0");
  clientesSemVendaDash = JSON.parse(localStorage.getItem("@Portal/dash/ClientesSemVenda") || "0")
}

 export const atualizarRelatorios = () => {
   console.log("entrou na função .....................................................................")
   metaXrealizado = JSON.parse(localStorage.getItem("@Portal/Relatorio/MetaXrealizado") || "[]");
   pedidoFaturar = JSON.parse(localStorage.getItem("@Portal/Relatorio/PedidoFaturar") || "[]");
   listaCobranca = JSON.parse(localStorage.getItem("@Portal/Relatorio/ListaCobranca") || "[]");
   vendaClientesCrescimento = JSON.parse(localStorage.getItem("@Portal/Relatorio/VendaClientesCrescimento") || "[]");
   vendaProdutoCrescimento = JSON.parse(localStorage.getItem("@Portal/Relatorio/VendaProdutoCrescimento") || "[]");
   vendaClientesQueda = JSON.parse(localStorage.getItem("@Portal/Relatorio/VendaClienteQueda") || "[]");
   vendaProdutoQueda = JSON.parse(localStorage.getItem("@Portal/Relatorio/VendaProdutoQueda") || "[]");
 }

 export const useOnlineStatus = () => {
  const [online, setOnline] = useState(window.navigator.onLine);

  useEffect(() => {
    const checkOnlineStatus = () => {
      setOnline(window.navigator.onLine);
    };

  
    checkOnlineStatus();

    const intervalId = setInterval(checkOnlineStatus, 5000);

    
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return online;
};









  
 


