import './NewDoc.css';
import { Document, Page } from 'react-pdf';
import { useState } from 'react';
import { pdfjs } from 'react-pdf';
import {useNavigate, useLocation} from 'react-router-dom';
import { ethers, Contract } from 'ethers';
import { WISESIGN_CONTRACT_ADDRESS, abi } from "../constants";
import CircularProgress from '@mui/material/CircularProgress';


pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const NewDoc = () => {
    const ipfsBaseUrl = "https://ipfs.io/ipfs/";
    const location = useLocation();
    const navigate = useNavigate();
    const [ipfsPath, setIpfsPath] = useState(location.state);

    const ipfs = (typeof ipfsPath == 'object') ? ipfsPath.ipfs_hash  : ipfsPath

    const [name, setName] = useState('');
    const [ownerName, setOwnerName] = useState('');
    const [description, setDescription] = useState('');
    const [isloading, setIsLoading] = useState(false);

    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }

    const handleDesChange = (e) => {
        setDescription(e.target.value)
        // console.log(description);
    }
    const handleNameChange = (e) => {
        setName(e.target.value)
        // console.log(name)
    }
    const handleOwnerNameChange = (e) => {
        setOwnerName(e.target.value)
        // console.log(ownerName)
    }
    // console.log(location.state.ipfs_hash)

    const handleSubmission = async () => {
        try {
            const signer = new ethers.providers.Web3Provider(window.ethereum).getSigner();

            const wiseSignContract = new Contract(
                WISESIGN_CONTRACT_ADDRESS,
                abi,
                signer
            );
            const docName = name ? name : "docName"
            const docDesc = description ? description : "Document descrition"
            const docipfs = ipfsPath ? ipfsPath : "IPFS hash"
            const docOwnerName = ownerName ? ownerName : "Owner"
            console.log(docName, docDesc, docipfs, docOwnerName)
            const tx = await wiseSignContract.createDoc(docName, docDesc, docipfs, docOwnerName);
            setIsLoading(true)
            await tx.wait();
            setIsLoading(false)

            // navigate('/docaction', {state: ipfsPath})
            navigate('/showdocs', {state: ipfsPath})


        // console.log(wisSignContract)
        } catch (error) {
            console.error(error);

        }
    }

    console.log('sss',ipfsPath)
    return(
        <>
            <p className='title'> <i className='fa fa-file'></i>New Document</p>
            <h6>Give a name and brief description to the doc</h6>
            <div className='container'>
                <div className='pdfform'>
                    <div>
                        <form onSubmit={handleSubmission}>
                            <label>
                                Owner Name: <br/>
                                <input type='text' name='Ownername' onChange={handleOwnerNameChange} />
                            </label>
                            <label>
                                Name: <br/>
                                <input type='text' name='name' onChange={handleNameChange} />
                            </label> 
                            
                            <label>
                                Description:
                                <textarea  name="description" onChange={handleDesChange} rows="4" cols="50"></textarea>
                            </label>
                            {isloading ? <div className='CircularProgress'><CircularProgress color='success'/></div> :<button type='button' className='' onClick={handleSubmission}>SUBMIT</button>}
                            {/* <button type='button' className=''onClick={handleSubmission}>SUBMIT</button> */}
                        </form>
                    </div>                    
                </div>
                <div className='pdfshower'>
                    {/* <Document file={process.env.PUBLIC_URL + 'sample.pdf'} onLoadSuccess={onDocumentLoadSuccess} width={50}> */}
                    {/* <Document file='https://www.football.ch/fr/Portaldata/27/Resources/dokumente/kinderfussball/SFV_KiFu_Theorie_und_Praxis_F.pdf' onLoadSuccess={onDocumentLoadSuccess} width={50}> */}
                    {
                    ipfs && <Document file={ipfsBaseUrl + ipfs} onLoadSuccess={onDocumentLoadSuccess} width={50}>
                        <Page pageNumber={pageNumber} />
                    </Document>
                    }
                  
                <p>
                    Page {pageNumber} of {numPages} 
                </p>
                
                </div> <br/>
                
            </div>
            <p>
                {/* <input type="button" value='VIEW'/> */}
                {/* <Link to={ipfsBaseUrl + ipfsPath}><input type="button" value='VIEW'/></Link> */}
                <a href={ipfsBaseUrl + ipfsPath} className='doclink' style={{color: 'white', textDecoration: 'none', }}>VIEW DOC</a>
            </p>
        </>
    )
}

export default NewDoc;