import './NewDoc.css';
import { Document, Page } from 'react-pdf';
import { useState } from 'react';
import { pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const NewDoc = () => {
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }

    return(
        <>
            <p className='title'> <i className='fa fa-file'></i>New Document</p>
            <h6>Give a name and brief description to the doc</h6>
            <div className='container'>
                <div className='pdfform'>
                    <div>
                        <form>
                            <label>
                                Name: <br/>
                                <input type='text' name='name' />
                            </label> 
                            
                            <label>
                                Description:
                                <textarea  name="description" rows="4" cols="50"></textarea>
                            </label>
                            <button type='submit' className='' onSubmit={''}>SUBMIT</button>
                        </form>
                    </div>                    
                </div>
                <div className='pdfshower'>
                    <Document file={process.env.PUBLIC_URL + 'sample.pdf'} onLoadSuccess={onDocumentLoadSuccess} width={50}>
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

export default NewDoc;