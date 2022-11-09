import './NewDoc.css';
import './DocActions.css';
import { Document, Page } from 'react-pdf';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const DocActions = () =>{

    const location = useLocation();
    const ipfsBaseUrl = "https://ipfs.io/ipfs/";
    const [showUpload, setShowUpload] = useState(false);
    const [ipfs_path, setIpfsPath] = useState(location.state);

    const handleShowUpload = () => {
        setShowUpload(!showUpload)
    }

    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }
    console.log(ipfs_path)
    return (
        <>
            <p className='title'> <i className='fa fa-edit'></i>Document</p>
            <div className='container'>
                <div className='pdfform'>
                    <div className='actionButtons'>
                        <div className='signingButtonBox'><button  className='signingButton' onSubmit={''}><i className='fa fa-edit'></i> SIGN DOC</button></div>
                        <div className='verfyingBox'>
                            {!showUpload && <button  className='verifyingButton' onClick={handleShowUpload}><i className='fa fa-check'></i> VERIFY DOC</button>}
                            {showUpload  && <div className='virifyingform'>
                                <form>
                                    <input className='' type='file' name='file' onChange={''}></input> <br/>
                                    <button type='submit' className='' onSubmit={''}>SUBMIT</button>

                                </form>
                            </div>}
                        </div>
                    </div>
                    <div className='divider'>
                        <hr/>
                    </div>
                    <div>
                        <p>
                            <h3>New Signer</h3>
                        </p>
                        <form>
                            <label>
                                Signer Name: <br/>
                                <input type='text' name='name' />
                            </label> 
                            
                            <label>
                                Signer Address:
                                <input type='text' name='address' />
                            </label>
                            <button type='submit' className='' onSubmit={''}>SUBMIT</button>
                        </form>
                    </div>
                    <div className='divider'>
                        <hr/>
                    </div>
                    <div className='signersinfo'>
                        <span className='title'>Owner:</span>
                        <p>xxxxx</p>
                        <span className='title'>Signer:</span>
                        <p>xxxxx</p>

                    </div>                 
                </div>
                <div className='pdfshower'>
                    {/* <Document file={process.env.PUBLIC_URL + 'sample.pdf'} onLoadSuccess={onDocumentLoadSuccess} width={50}> */}
                    <Document file={ipfsBaseUrl + ipfs_path} onLoadSuccess={onDocumentLoadSuccess} width={50}>
                        <Page pageNumber={pageNumber} />
                    </Document>
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