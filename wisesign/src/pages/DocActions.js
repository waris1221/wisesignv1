import './NewDoc.css';
import './DocActions.css';
import { Document, Page } from 'react-pdf';
import { useEffect, useState , useContext} from 'react';
import { useLocation } from 'react-router-dom';
import { pdfjs } from 'react-pdf';
import { ethers, Contract } from 'ethers';
import {WISESIGN_CONTRACT_ADDRESS, abi,abi2 } from "../constants";
import { Context } from '../Context';
import {  create  } from "ipfs-http-client";

import CircularProgress from '@mui/material/CircularProgress';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const DocActions = () =>{


    const REACT_APP_PROJECTID= "2H8QJSVXyWlXJ2wdIXQkGPi7dgC"
    const REACT_APP_PROJECTSECRET = "f7c9ee3b2a7b43e63664eb375104f336"
    var Buffer = require('buffer/').Buffer
    // const authorization = "Basic " + Buffer.from(process.env.REACT_APP_PROJECTID + ":" + process.env.REACT_APP_PROJECTSECRET).toString('base64');
    const authorization = "Basic " + Buffer.from(REACT_APP_PROJECTID + ":" + REACT_APP_PROJECTSECRET).toString('base64');

    
    const ipfsInstance = create({
        url: "https://ipfs.infura.io:5001/api/v0",
        headers:{
          authorization
        }
    })


    const location = useLocation();
    const {conAdd} = useContext(Context)

    const ipfsBaseUrl = "https://ipfs.io/ipfs/";
    const [isLoading, setIsLoading] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [sigingIsLoading, setSigingIsLoading] = useState(false);
    const [showUpload, setShowUpload] = useState(false);
    const [ipfsPath, setIpfsPath] = useState(location.state);
    const [docAdd, setDocAdd] = useState(location.state.add);
    const [docOwner,setDocOwner] = useState()
    const [docOwnerName,setDocOwnerName] = useState()
    const [didSign,setDidSign] = useState()
    const [numberOfSigner,setNumberOfSigner] = useState()
    const [signers,setSigners] = useState()
    const [signersInfo,setSignersInfo] = useState()

    const [signerName, setSignerName] = useState()
    const [signerAdd, setSignerAdd] = useState()

    const [selectedFile, setSelectedFile] = useState()
    const [isFilePicked, setIsFilePicked] = useState()

    const [verifyedHash, setVerifyedHash] = useState()
    const [verifyingAns, setVerifyingAns] = useState()

    const ipfs = (typeof ipfsPath == 'object') ? ipfsPath.ipfs_hash  : ipfsPath

    const handleShowUpload = () => {
        setShowUpload(!showUpload)
    }
    const handleNameChange = (e) =>{
        setSignerName(e.target.value)
        // console.log(signerName)
    }
    const handleSignerAddChange = (e) =>{
        setSignerAdd(e.target.value)
        // console.log(signerAdd)
    }
    const changeHandler = (event) => {
		setSelectedFile(event.target.files[0]);
		setIsFilePicked(true);
	};

    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }
    
    const signDoc = async ()=>{
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const docContract = new Contract(
                docAdd,
                abi2,
                signer
            );

            const tx = await docContract.sign({value: ethers.utils.parseEther("0.001")})
            setIsLoading(true)
            await tx.wait()
            setIsLoading(false)
            window.location.reload(true);
            
        } catch (error) {
            console.log(error)
        }
    
    }

    const addSigner = async ()=>{
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            // const docContract = new Contract(
            //     docAdd,
            //     abi2,
            //     signer
            // );

            const docFactoryContract = new Contract(
                WISESIGN_CONTRACT_ADDRESS,
                abi,
                signer
            );




            if(signerName.length === 0){
                alert('Please enter signer name')
                return 
            }

            
            try {
                ethers.utils.getAddress(signerAdd)
            } catch (error) {
                console.log(error)
                alert(" Signer Adrress's field is empty  OR   is not address")
            }

            // const tx = await docContract.addSigner(signerName, signerAdd, conAdd)
            const tx = await docFactoryContract.giveAccessToDoc(signerName, signerAdd, docAdd)
            setSigingIsLoading(true);
            await tx.wait();
            setSigingIsLoading(false)

        } catch (error) {
            console.log(error)
        }
    }

    const handleVerifyForm = async function(e){
        e.preventDefault();
        const file = selectedFile
        // console.log(url);
        if (typeof file =='undefined') {
            return alert("No files selected");
        }

        const ipfs_result = await ipfsInstance.add(file);
        const ipfs_hash = ipfs_result.path
        setVerifyedHash(ipfs_hash)
        console.log(ipfs_hash)
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const docContract = new Contract(
                docAdd,
                abi2,
                signer
            );
            setIsVerifying(true)

            const isRight = await docContract.checkIntegrity(ipfs_hash)
            // await tx.wait()

            setIsVerifying(false)
            setVerifyingAns(isRight)

            console.log(isRight)
            setIsFilePicked(false)
            
        } catch (error) {
            console.log(error)
        }
    }


    useEffect(()=>{
        async function getOwner(){
            try {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const docContract = new Contract(
                    docAdd,
                    abi2,
                    provider
                );
        
                const owner = await docContract.owner()
                setDocOwner(owner)
                const ownerName = await docContract.addressToString(owner)
                setDocOwnerName(ownerName)
                const didSign = await docContract.addressToSigned(conAdd)
                setDidSign(didSign)
                const signersCount = await docContract.getSignersCount()
                setNumberOfSigner(signersCount.toNumber())

                const _getsigners = await Promise.all(
                    Array(parseInt(signersCount.toNumber())).fill().map((Element, index) => {
                        return docContract.signers(index);
                    })
                ); 
                setSigners(_getsigners)
                
                const itemsPromise =  await Promise.all(_getsigners.map(async (address)=> {
                    const provider = new ethers.providers.Web3Provider(window.ethereum);
                    const docContract = new Contract(
                        docAdd,
                        abi2,
                        provider
                    );

                    let hasSigned = await docContract.addressToSigned(address)
                    let name = await docContract.addressToString(address)
                    let obj = {
                        'hasSigned': hasSigned,
                        'name': name,
                        'address': address
                    }
                    return obj;

                    // let p = <p>{`${address.slice(0,4)}...${address.slice(38)}`}({name})</p>
                    // return p
                })).then(r=>r)
                setSignersInfo(itemsPromise)

                console.log(owner,ownerName,didSign,signersCount, _getsigners,itemsPromise )
            } catch (error) {
                console.log(error)
            }
        };
        getOwner()
    },[docAdd,conAdd])
    // getOwner()
    console.log( signersInfo)
    return (
        <>
            <p className='title'> <i className='fa fa-edit'></i>Document</p>
            <div className='container'>
                <div className='pdfform'>
                    <div className='actionButtons'>
                        <div className='signingButtonBox'>{isLoading ? <div className='CircularProgress'><CircularProgress color='success'/></div> : <button  className='signingButton' onClick={signDoc} disabled={didSign}><i className='fa fa-edit'>SIGN DOC</i> </button>}</div>
                        <div className='verfyingBox'>
                            {!showUpload && <button  className='verifyingButton' onClick={handleShowUpload}><i className='fa fa-check'></i> VERIFY DOC</button>}
                            
                            {showUpload  && <div className='virifyingform'>
                                <form>
                                    <input className='' type='file' name='file' onChange={changeHandler}></input> <br/>
                                    {isFilePicked ? (
                                        <div>
                                            <span>Filename: {selectedFile.name}</span>
                                            <span>Filetype: {selectedFile.type}</span>
                                            <span>Size in bytes: {selectedFile.size}</span>
                                            <span>
                                                lastModifiedDate:{' '}
                                                {selectedFile.lastModifiedDate.toLocaleDateString()}
                                            </span>
                                        </div>
                                    ) : (
                                        <p>Select a file to show details</p>
                                    )}
                                    {isVerifying ? <div className='CircularProgress'><CircularProgress color='success'/></div> : <button type='button' className='' onClick={handleVerifyForm}>SUBMIT</button>}

                                </form>
                            </div>}
                        </div>
                    </div>
                    {verifyingAns && <div className='VerifyingResultBox'>matched: {ipfs}</div>}
                    {verifyingAns ===false && <div className='VerifyingResultBox2'>mismatched: {ipfs}</div>}
                    <div className='divider'>
                        <hr/>
                    </div>
                    {docOwner === conAdd &&<div>
                        <div>
                            <p>New Signer</p>
                        </div>
                        <form>
                            <label>
                                Signer Name: <br/>
                                <input type='text' name='name' onChange={handleNameChange}/>
                            </label> 
                            
                            <label>
                                Signer Address:
                                <input type='text' name='address' onChange={handleSignerAddChange}/>
                            </label>
                            {sigingIsLoading ? <div className='CircularProgress'><CircularProgress color='success'/></div> :<button type='button' className='' onClick={addSigner}>SUBMIT</button>}
                        </form> 
                    </div>}
                    <div className='divider'>
                        <hr/>
                    </div>
                    <div className='signersinfo'>
                        <span className='title'>Owner:</span>
                        <p>{docOwnerName} </p>
                        {/* {didSign ? <span className='didsignlogo'><i className='fa fa-circle-check'></i></span>:<span className='waitsignlogo'><i className='fa fa-clock'></i></span>} */}
                        <span className='title'>Signer(s):</span>
                        {/* {signersInfo.map((info, i)=>(
                            // <p key={i}> {info.address} (info.name)</p>
                            // <p key={i}>xxxxx</p>
                            // <p key={i}>{info}</p>
                            <li key={i}>{info}</li>
                        ))} */}


                        

                    </div>                 
                </div>
                <div className='pdfshower'>
                    {/* <Document file={process.env.PUBLIC_URL + 'sample.pdf'} onLoadSuccess={onDocumentLoadSuccess} width={50}> */}
                    {ipfs && <Document file={ipfsBaseUrl + ipfs} onLoadSuccess={onDocumentLoadSuccess} width={50}>
                        <Page pageNumber={pageNumber} />
                    </Document>}
                <p>
                    Page {pageNumber} of {numPages} 
                </p>
                <p>
                    <input type="button" value='VIEW'/>
                </p>
                </div>
            </div>
        </>
    )
}

export default DocActions;