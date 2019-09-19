import React, { Component } from 'react';
import Web3 from 'web3';
import Contract from '../../contracts/build/ToDoList.json';
import './ToDoList.css';

class ToDoList extends Component {
    constructor(props){
        super(props);
        this.state = { account:'', contract:[], listItems:[] };
        this.initializeContract();
    }

    initializeContract = async() => {
        const web3 = new Web3(Web3.givenProvider || 'http://127.0.0.1:7545');
        console.log('web3: ', web3);

        /** Get accounts from network */
        let accounts = await web3.eth.getAccounts();
        if(accounts.length === 0)
            accounts = await window.ethereum.enable() ;

        if(accounts.length > 0){
            console.log('account: ',accounts[0]);
            this.setState({account: accounts[0]});
        }
        else
            window.alert("Could not read accounts from network")

        const networkId = await web3.eth.net.getId();
        const abi = Contract.abi;
        const networkData = Contract.networks[networkId];
        let contract;
        if(networkId){
            contract = new web3.eth.Contract(abi,networkData.address);
            console.log('contract: ',contract);
            this.setState({contract});
        } else {
            window.alert("Contract not deployed to detected network");
        }

        /**get list items in an array */
        this.getItems();
    }

     getItems = async() => {
        let listItems=[];
        const contract = this.state.contract;
        const ctr = await contract.methods.ctr().call();
        for(var i=0; i <= ctr; i++) {
            const listItem = await contract.methods.toDoList(i).call();
            if(!listItem.deleted && listItem.title !== '')
                listItems.push({id:listItem.id, title:listItem.title, completed:listItem.completed});
        }
        this.setState({listItems});
    }

    addItem = async(e) => {
        const title = this.refs.listItem.value;
        const contract = this.state.contract;
        const account = this.state.account;
        const result = await contract.methods.addItem(title).send({from: account});
        if(result) {
            this.getItems();
        }
        this.refs.listItem.value='';
        console.log(result);
    }

    deleteItem = async(e,id) => {
        const contract = this.state.contract;
        const account = this.state.account;
        const result = await contract.methods.deleteItem(id).send({from: account});
        if(result) {
            this.getItems();
        }
    }

    render(){
        return(
            <div>
            <div className='flex-container'style={{justifyContent:'center', backgroundColor:'orange', color:'white'}}>
                    <h2>To Do List</h2>
            </div>
            <div className='flex-container' style={{marginTop:'25px'}} >
                <div style={{flexGrow:'3'}}></div>
                <div style={{flexGrow:'1'}}>
                <div className="input-group mb-3" >
                <input type="text" className="form-control" placeholder="To do list item" aria-label="Recipient's username" aria-describedby="button-addon2" 
                ref='listItem'
                />
                <div className="input-group-append">
                    <button className="btn btn-outline-secondary" type="button" id="button-addon2"
                    onClick={(e) => this.addItem(e,this.refs.listItem.value)}
                    >Add</button>
                </div>
                </div>
                </div>
                <div style={{flexGrow:'3'}}></div>
                </div>

                <div className='flex-container'style={{justifyContent:'center'}}>
                <div style={{flexGrow:'3'}}></div>
                <div style={{flexGrow:'2'}}>
                <ListItem listItems={this.state.listItems} deleteItem={(e,id) => this.deleteItem(e,id)} />

                </div>
                <div style={{flexGrow:'3'}}></div>
                    
                </div>
    
                
            </div>
        )
    }
}

 function ListItem(props) {
    const listItems = props.listItems;
    console.log('LIST_ITEMS',listItems)
    return(
        <div style={{width:'100%', padding:'0'}}>
            {
        listItems.map(listItem => (
            <div key={listItem.id}>
            <div style={{border:'solid 1px silver', marginBottom:'1px', padding:'5px', backgroundColor:'#8bd88b', color:'black'}}>
                {listItem.title}

            <span className='fa fa-trash-o' style={{float:'right', cursor:'pointer'}} onClick={(e) => props.deleteItem(e,listItem.id)}></span>

            </div>
            
            </div>    
        ))
            }
        </div>
    )
}

export default ToDoList;