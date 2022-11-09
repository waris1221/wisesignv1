import './App.css';
// import { providers, Contract } from "ethers";
// import Web3Modal from "web3modal";
import DocumentShow from "./pages/DocumentShow"
import NewDoc from './pages/NewDoc';
import Layout from "./pages/Layout";
import DocActions from './pages/DocActions';
import { Context } from './Context';
import { Routes, Route } from "react-router-dom";
import {useState} from "react"


function App() {

  const [selectedFile, setSelectedFile] = useState();
	const [isFilePicked, setIsFilePicked] = useState(false);
	const [conAdd, setConAdd] = useState();
  // console.log(selectedFile)

  // const web3ModalRef = useRef();
  const [walletConnected, setWalletConnected] = useState(false);

  // const getProviderOrSigner = async (needSigner = false) => {
  //   // Connect to Metamask
  //   // Since we store `web3Modal` as a reference, we need to access the `current` value to get access to the underlying object
  //   const provider = await web3ModalRef.current.connect();
  //   const web3Provider = new providers.Web3Provider(provider);

  //   // If user is not connected to the Goerli network, let them know and throw an error
  //   const { chainId } = await web3Provider.getNetwork();
  //   if (chainId !== 5) {
  //     window.alert("Change the network to Goerli");
  //     throw new Error("Change network to Goerli");
  //   }

  //   if (needSigner) {
  //     const signer = web3Provider.getSigner();
  //     return signer;
  //   }
  //   return web3Provider;
  // };

  // const connectWallet = async () => {
  //   try {
  //     // Get the provider from web3Modal, which in our case is MetaMask
  //     // When used for the first time, it prompts the user to connect their wallet
  //     await getProviderOrSigner();
  //     setWalletConnected(true);

  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  // useEffect(() => {
  //   // if wallet is not connected, create a new instance of Web3Modal and connect the MetaMask wallet
  //   if (!walletConnected) {
  //     // Assign the Web3Modal class to the reference object by setting it's `current` value
  //     // The `current` value is persisted throughout as long as this page is open
  //     web3ModalRef.current = new Web3Modal({
  //       network: "goerli",
  //       providerOptions: {},
  //       disableInjectedProvider: false,
  //     });
  //     // connectWallet();
  //   }
  // }, [walletConnected]);

// console.log(conAdd)



  return (
    <Context.Provider value={{selectedFile, setSelectedFile, isFilePicked, setIsFilePicked, walletConnected, setWalletConnected, conAdd, setConAdd}}>
      <div className="App">
      {/* <button onClick={connectWallet}>connect</button> */}
        <div className='maincontainer'>
          <Routes>
            <Route path="/" element={ <Layout/> } >
              <Route path="showdocs" element={ <DocumentShow file={selectedFile} fileChange={setSelectedFile} isFilePicked={isFilePicked} setIsFilePicked={setIsFilePicked}/> }/>
              <Route path="new" element={ <NewDoc/> }/>
              <Route path="docaction" element={ <DocActions/> }/>
            </Route>
          </Routes>
        </div>
      </div>
    </Context.Provider>
  );
}

export default App;
