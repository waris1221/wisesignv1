import './DocumentShow.css'
import Doc from '../components/Doc';
import UploadForm from '../components/UploadForm';

const DocumentShow = () => {
    return (
        <>
            <p className='title'> <i className='fa fa-file'></i>Your Documents</p>
            <div className='docshow'>
                <div className="form">
                    <UploadForm/>
                </div>
                <div className="docShower">
                    <Doc/>
                    <Doc/>
                    <Doc/>
                    <Doc/>
                </div>
            </div>
        </>
    )

}

export default DocumentShow;