import './DocumentShow.css'
import Doc from '../components/Doc';
import UploadForm from '../components/UploadForm';
import { useState, useEffect, useContext, useCallback } from 'react';
import { ethers, Contract } from 'ethers';
import { Context } from '../Context';
import { WISESIGN_CONTRACT_ADDRESS, abi, abi2 } from "../constants";

const DocumentShow = () => {


    const {conAdd} = useContext(Context)
    const [documents, setDocuments] = useState()
    const [items, setItems] = useState([])

     

    useEffect(()=>{
        const fetchDoc = async ()=>{
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner()
            const docFactoryContract = new Contract(
                WISESIGN_CONTRACT_ADDRESS,
                abi,
                signer
            );
            const _documents = await docFactoryContract.getDocuments(conAdd).catch(e=>e)
            console.log(_documents)
            const items = await Promise.all(_documents.map(async (document)=>{
                let documentContract = new Contract(document, abi2, provider);
                let name =  await documentContract.name()
                let desc = await documentContract.description()
                let url = await documentContract.ipfs_hash()
                let left = await documentContract.left()
                left = left.toNumber()
                let itemObj = {
                    'name': name,
                    'desc': desc,
                    'url': url,
                    'left': left,
                    'add' : document
                }
                return itemObj;
            })).then(r=>r)
            console.log(items)
            setItems(items);
        };
        conAdd && fetchDoc()
        
    },[conAdd])
    console.log(items,conAdd)
   
    

   
    



    return (
        <>
            <p className='title'> <i className='fa fa-file'></i>Your Documents</p>
            <div className='docshow'>
                <div className="form">
                    <UploadForm/>
                </div>
                {items.length > 0 ? (<div className="docShower">
                    {/* <Doc/>
                    <Doc/>
                    <Doc/>
                    <Doc/> */}
                    {/* {Items.forEach(item => {
                        <Doc name={item.name}/>
                    })} */}

                    {items.map((item, index)=>(
                        // <li key={index}>{item.name}</li>
                        <Doc key={index} name={item.name} desc={item.desc} left={item.left} url={item.url} add={item.add}/>
                    ))}

                
                </div>):(
                    <p className='nodoc'>
                        You haven't actually any document. Click On the side button to create one
                    </p>
                )}
            </div>
            {/* <button type='button' onClick={renderItems}>try</button> */}

        </>
    )

}

export default DocumentShow;