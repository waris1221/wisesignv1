import { useState } from 'react';
import './UploadForm.css';
import { useContext } from 'react';
import { Context } from '../Context';
import {  create  } from "ipfs-http-client";
import { useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';




const UploadForm = () => {

    const REACT_APP_PROJECTID= "2H8QJSVXyWlXJ2wdIXQkGPi7dgC"
    const REACT_APP_PROJECTSECRET = "f7c9ee3b2a7b43e63664eb375104f336"
    var Buffer = require('buffer/').Buffer
    // const authorization = "Basic " + Buffer.from(process.env.REACT_APP_PROJECTID + ":" + process.env.REACT_APP_PROJECTSECRET).toString('base64');
    const authorization = "Basic " + Buffer.from(REACT_APP_PROJECTID + ":" + REACT_APP_PROJECTSECRET).toString('base64');
    const navigate = useNavigate();
    
    const ipfs = create({
        url: "https://ipfs.infura.io:5001/api/v0",
        headers:{
          authorization
        }
    })

    const [isloading, setIsLoading] = useState(false);
    
    const [click, setClick] = useState(false);

    const handleClick =()=>{
        setClick(!click)
    }

    const changeHandler = (event) => {
		setSelectedFile(event.target.files[0]);
		setIsFilePicked(true);
	};

	const handleSubmission = async (e) => {
        e.preventDefault();
        const file = selectedFile
        // console.log(url);
        if (typeof file =='undefined') {
            return alert("No files selected");
        }

        setIsLoading(true)

        const ipfs_result = await ipfs.add(file);
        const ipfs_path = ipfs_result.path
        console.log(ipfs_path);

        setIsLoading(false);

        navigate('/new', {state: ipfs_path})
	};
    
    const {selectedFile, setSelectedFile, isFilePicked, setIsFilePicked} = useContext(Context)

    return (
        <>
            {!click && <button className="newdoc" onClick={handleClick}><i className='fa fa-plus'> New Documents</i></button>}
           {click && <div className='form-box'>
                <form onSubmit={handleSubmission}>
                    <input className='' type='file' name='file' onChange={changeHandler}></input> <br/>
                    {isFilePicked ? (
                        <div>
                            <p>Filename: {selectedFile.name}</p>
                            <p>Filetype: {selectedFile.type}</p>
                            <p>Size in bytes: {selectedFile.size}</p>
                            <p>
                                lastModifiedDate:{' '}
                                {selectedFile.lastModifiedDate.toLocaleDateString()}
                            </p>
                        </div>
                    ) : (
                        <p>Select a file to show details</p>
                    )}
                    {isloading ? <div className='CircularProgress'><CircularProgress color='success'/></div> : <button type='submit' className='' > SUBMIT</button>}
                </form>
            </div>
            }
        </>
    )
}

export default UploadForm;