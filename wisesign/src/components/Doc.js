import './Doc.css'

const Doc = (props) => {
    return (
        <>
           { <div className='docItem'>
                <span className='docTitle'> {props.name}</span> <br/>
                {props.left > 0 && <span className='docState'>pending <i className='fa fa-clock'></i></span>} <br/>
                <span className='linkToDoc'> View Document</span> <br/>
                <span className='description'>{props.desc}</span>
                
            </div>}
        </>
    )
}

export default Doc;