var express = require('express');
var app = express();
const bodyParser = require('body-parser');
const Blockchain = require('./blockchain');
const { v4: uuidv4 } = require('uuid');
const port = process.argv[2]
const rp = require('request-promise');
const BlockChain = require('./blockchain');

//creates a unique address for this node
const nodeAddress = uuidv4().split('-').join('');

const bitcoin = new Blockchain();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/blockchain', function (req, res) {
    res.send(bitcoin);
});

//individual node receives a transaction from broadcast and adds it to PendingTransaction
app.post('/transaction', function (req, res) {
    const newTransaction = req.body;
    const blockIndex = bitcoin.addTransactionToPendingTransactions(newTransaction);
    res.json({ note: `Transaction will be added in block ${blockIndex}`});
});

//sends transaction data to all nodes on network
app.post('/transaction/broadcast', function(req,res) {
    const newTransaction = bitcoin.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient);
    bitcoin.addTransactionToPendingTransactions(newTransaction);

    const requestPromises = [];
    bitcoin.networkNodes.forEach(networkNodeUrl => {
        const requestOptions = {
            uri: networkNodeUrl + '/transaction',
            method: 'POST',
            body: newTransaction,
            json: true
        };

        requestPromises.push(rp(requestOptions));
    });
    Promise.all(requestPromises)
    .then(data => {
        res.json({ note: ' Transaction created and broadcasted successfully.' });
    }, error => {
        console.log(' Error occurred with Transaction.' + error);
    })
});

app.get('/mine', function (req, res) {
    const lastBlock = bitcoin.getLastBlock();
    const previousBlockHash = lastBlock['hash'];
    const currentBlockData = {
        transactions: bitcoin.pendingTransactions,
        index: lastBlock['index'] + 1 
    }
    const nonce = bitcoin.proofOfWork(previousBlockHash, currentBlockData);
    const blockHash = bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce)

    const newBlock = bitcoin.createNewBlock(nonce, previousBlockHash, blockHash);
    
    const requestPromises = [];
    bitcoin.networkNodes.forEach(networkNodeUrl => {
        const requestOptions = {
            uri: networkNodeUrl + '/receive-new-block',
            method: 'POST',
            body: { newBlock: newBlock },
            json: true
        }
        requestPromises.push(rp(requestOptions));
    });
    
    Promise.all(requestPromises)
    .then(data => {
        const requestOptions = {
            uri: bitcoin.currentNodeUrl + '/transaction/broadcast',
            method: 'POST',
            body: { 
                amount: 12.5,
                sender: "00",
                recipient: nodeAddress
            },
            json: true
        }
        return rp(requestOptions);
    })
    .then(data =>{
    res.json({
            note: "New block mined & broadcast successfully",
            block: newBlock
        });
    })
});

// register a node and broadcast it to the network
app.post('/register-and-broadcast-node', function(req, res) {
    const newNodeUrl = req.body.newNodeUrl;
    if(bitcoin.networkNodes.indexOf(newNodeUrl == -1)) bitcoin.networkNodes.push(newNodeUrl);

    const regNodesPromises = [];
    //sends a request to all current nodes to add newNodeUrl
    bitcoin.networkNodes.forEach(networkNodeUrl => {
        const requestOptions = {
            uri: networkNodeUrl + '/register-node',
            method: 'POST',
            body: { newNodeUrl: newNodeUrl},
            json: true
        }

        regNodesPromises.push(rp(requestOptions));
    });

    Promise.all(regNodesPromises)
    .then(data => {
        const bulkRegisterOptions = {
            uri: newNodeUrl + '/register-nodes-bulk',
            method: 'POST',
            body: { allNetworkNodes: [ ...bitcoin.networkNodes, bitcoin.currentNodeUrl ] },
            json: true 
        }

        return rp(bulkRegisterOptions) ;
    }, error => {
        console.log('Error occurred with Bulk Register. Error: ' + error);
    })
    .then(data => {
        res.json({ note: 'New node registered with network successfully' });
    }, error => {
        console.log(' Error occurred with Bulk Register. Error:' + error);
    })

})

// register a node with the network
app.post('/register-node', function(req, res){
    const newNodeUrl  = req.body.newNodeUrl;
    const nodeNotAlreadyPresent = bitcoin.networkNodes.indexOf(newNodeUrl) == -1;
    const notCurrentNode = bitcoin.currentNodeUrl !== newNodeUrl;
    //checks if node is not already present and is not the same node receiving the new Url
    if(nodeNotAlreadyPresent && notCurrentNode) bitcoin.networkNodes.push(newNodeUrl);
    res.json({ note: 'New node registered succesfully.'})
});

// register multiple nodes at once - returns all current registered nodes to a newly added node
app.post('/register-nodes-bulk', function(req, res) {
    const allNetworkNodes = req.body.allNetworkNodes;
    allNetworkNodes.forEach(networkNodeUrl => {
        const nodeNotAlreadyPresent = bitcoin.networkNodes.indexOf(networkNodeUrl) == -1;
        const notCurrentNode = bitcoin.currentNodeUrl !== networkNodeUrl;
        if(nodeNotAlreadyPresent && notCurrentNode) bitcoin.networkNodes.push(networkNodeUrl);
    });
    res.json({ note: 'Bulk registration successful. '});
});

app.listen(port, function(){
    console.log(`Listening on port ${port}...`);
});