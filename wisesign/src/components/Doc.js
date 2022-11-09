import './Doc.css'
import { Link } from 'react-router-dom';

const Doc = (props) => {
    return (
        <>
           { <div className='docItem'>
                <span className='docTitle'> {props.name} {props.left == 0 &&<i className='fa fa-circle-check'></i>}</span> <br/>
                {props.left > 0 && <span className='docState'>pending <i className='fa fa-clock'></i></span>} <br/>
                <span className='linkToDoc'>
                    <Link to='/new'>
                        View Document
                    </Link>                
                </span> <br/>
                <span className='description'>{props.desc}</span>
                
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