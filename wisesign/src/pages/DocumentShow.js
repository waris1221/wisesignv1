import './DocumentShow.css'
import Doc from '../components/Doc';
import UploadForm from '../components/UploadForm';
import { useState, useEffect, useContext } from 'react';
import { ethers, Contract } from 'ethers';
import { Context } from '../Context';
import { WISESIGN_CONTRACT_ADDRESS, abi, abi2 } from "../constants";

const DocumentShow = () => {
    // const [documents, setDocuments] = useState();
    // const [userAddress, setUserAddress] = useState();

    const {conAdd} = useContext(Context)
    // console.log(conAdd)
    let Items = []
    useEffect(() => {
        async function getUserDocs(){
            
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            // const address = await provider.getSigner().getAddress()
            // setUserAddress(address)
            // console.log(userAddress)


            try {
                
                const signer = provider.getSigner();
    
                const wiseSignContract = new Contract(
                    WISESIGN_CONTRACT_ADDRESS,
                    abi,
                    signer
                );
                    // console.log(wiseSignContract)
                const docs = await wiseSignContract.getDocuments(conAdd)
                // setDocuments(Object.entries(docs))
                const documents = Object.values(docs)
                console.log(documents)
                let fetchedItems = [];
                documents.map(async (document)=>{
                    let documentContract = new Contract(document, abi2, provider);
                    let name =  await documentContract.name()
                    let desc = await documentContract.description()
                    let url = await documentContract.ipfs_hash()
                    let left = await documentContract.left()
                    left = left.toNumber()
                    fetchedItems.push(<Doc name={name} desc={desc} left={left} />)
                    console.log(document,name, desc, url,  left)
                })

                // documents.forEach(document => {
                //     let documentContract = new Contract(document, abi2);
                //     let name =  document.name()
                //     console.log(documentContract, name)
                // });
                Items= fetchedItems
                console.log(Items)

            } catch (error) {
                console.log(error)
            }
        };
        getUserDocs();
    },[conAdd])
    console.log(Items)

    return (
        <>
            <p className='title'> <i className='fa fa-file'></i>Your Documents</p>
            <div className='docshow'>
                <div className="form">
                    <UploadForm/>
                </div>
                <div className="docShower">
                    {/* <Doc/>
                    <Doc/>
                    <Doc/>
                    <Doc/> */}
                    {Items.forEach(element => {
                        
                    })}
                </div>
                {/* <button type='button' onClick={userDocs}>try</button> */}
            </div>
        </>
    )

}

export default DocumentShow;