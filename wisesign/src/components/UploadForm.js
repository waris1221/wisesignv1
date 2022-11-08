import { useState } from 'react';
import './UploadForm.css';
import { useContext } from 'react';
import { Context } from '../Context';



const UploadForm = () => {
    const [click, setClick] = useState(false);

    const handleClick =()=>{
        setClick(!click)
    }

    const changeHandler = (event) => {
		setSelectedFile(event.target.files[0]);
		setIsFilePicked(true);
	};

	const handleSubmission = () => {
	};
    
    const {selectedFile, setSelectedFile, isFilePicked, setIsFilePicked} = useContext(Context)

    return (
        <>
            {!click && <button className="newdoc" onClick={handleClick}><i className='fa fa-plus'> New Documents</i></button>}
           {click && <div className='form-box'>
                <form>
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
                    <button type='submit' className='' onSubmit={handleSubmission}>SUBMIT</button>
                </form>
            </div>
            }
        </>
    )
}

export default UploadForm;