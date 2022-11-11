import "./Navbar.css";
import { Link } from "react-router-dom";
import { useEffect, useContext, useRef, useState } from "react";
import { Context } from '../Context';
import { providers } from "ethers";
import Web3Modal from "web3modal";
import logo from '../logo.png'


const Navbar = () =>  {
    const web3ModalRef = useRef();
    const {walletConnected, setWalletConnected, conAdd, setConAdd} = useContext(Context)
    // const [address, setAddress] = useState('')



    const getProviderOrSigner = async (needSigner = false) => {
        // Connect to Metamask
        // Since we store `web3Modal` as a reference, we need to access the `current` value to get access to the underlying object
        const provider = await web3ModalRef.current.connect();
        const web3Provider = new providers.Web3Provider(provider);
        const userAddress = await web3Provider.getSigner().getAddress();
        setConAdd(userAddress)
    
        // If user is not connected to the Goerli network, let them know and throw an error
        const { chainId } = await web3Provider.getNetwork();
        if (chainId !== 5) {
          window.alert("Change the network to Goerli");
          throw new Error("Change network to Goerli");
        }
    
        if (needSigner) {
          const signer = web3Provider.getSigner();
          return signer;
        }
        return web3Provider;
    };
    
    const connectWallet = async () => {
        try {
            // Get the provider from web3Modal, which in our case is MetaMask
            // When used for the first time, it prompts the user to connect their wallet
            await getProviderOrSigner();
            setWalletConnected(true);

        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        // if wallet is not connected, create a new instance of Web3Modal and connect the MetaMask wallet
        if (!walletConnected) {
        // Assign the Web3Modal class to the reference object by setting it's `current` value
        // The `current` value is persisted throughout as long as this page is open
        web3ModalRef.current = new Web3Modal({
            network: "goerli",
            providerOptions: {},
            disableInjectedProvider: false,
        });
        connectWallet();
        

        }
    }, [walletConnected]);

//    console.log(conAdd)
    
  return (
      <>
          <div className="nav-box" >
              <div className="logo">
                <img src={logo} style={{maxWidth: '9em'}}/>
                {/* <div>
                    <Link to='/'><span  className="link">Home</span></Link>
                </div> */}
                <div>
                    <Link to='/showdocs'><span  className="link">MyDocs</span></Link>
                </div>
                {/* <div>
                    <Link to='/new'><span  className="link">New</span></Link>
                </div> 
                <div>
                    <Link to='/docaction'><span  className="link">Actions</span></Link>
                </div> */}
              </div>
              <div className="nav-link">
                   {! walletConnected && 
                    <div className="wrap">
                        <button className="button" onClick={connectWallet} >connect wallet</button>
                    </div>
                    }
                    {walletConnected &&<div className="addressBox">
                        Address: <span className="addressLabel">{` ${conAdd.slice(0,4)}...${conAdd.slice(38)}`}</span>
                        {/* <button>Address : {address}</button> */}
                        {/* <div className="dropdown-content">
                            <a href="https://blog.hubspot.com/">LOGOUT</a>
                        </div> */}
                    </div>}
              </div>
          </div>
      </>
  )

}

export default Navbar;