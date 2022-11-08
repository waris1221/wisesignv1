import './Doc.css'

const Doc = () => {
    return (
        <>
            <div className='docItem'>
                <span className='docTitle'> Document Title</span> <br/>
                <span className='docState'>pending <i className='fa fa-clock'></i></span> <br/>
                <span className='linkToDoc'> View Document</span> <br/>
                <span className='description'>Description</span>
                
            </div>
        </>
    )
}

export default Doc;