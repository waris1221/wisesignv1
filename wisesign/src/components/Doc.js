import './Doc.css'
import { Link } from 'react-router-dom';

const Doc = (props) => {
    return (
        <>
           { <div className='docItem'>
                <span className='docTitle'> {props.name} {props.left == 0 &&<span style={{color: '#08b771'}}><i className='fa fa-circle-check'></i></span>}</span> <br/>
                {props.left > 0 && <span className='docState'>pending <i className='fa fa-clock'></i></span>} {props.left > 0 && <br/>}               
                <span className='description'>{props.desc}</span><br/>
                <span className='linkToDoc'>
                    <Link to='/docaction' state={{ipfs_hash: props.url, add: props.add}}>
                        View Document
                    </Link>                
                </span> 
                
            </div>}

             {/* <div className='docItem'>
                <span className='docTitle'> title</span> <br/>
                 <span className='docState'>pending <i className='fa fa-clock'></i></span> <br/>
                <span className='linkToDoc'> View Document</span> <br/>
                <span className='description'>desc</span>
                
            </div> */}
        </>
    )
}

export default Doc;