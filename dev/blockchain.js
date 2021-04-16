const sha256 = require('sha256');
const currentNodeUrl = process.argv[3];
const { v4: uuidv4 } = require('uuid');
function BlockChain() {
    //Will contain all mined blocks
    this.chain= [];
    //Will contain all transactions pending for the next block
    this.pendingTransactions = [];

    //the URL of where a node is running
    this.currentNodeUrl = currentNodeUrl;
    this. networkNodes = [];

    //arbitrary values can be used for the genesis block, all others cannot
    this.createNewBlock(100, '0','0');    
}
    
BlockChain.prototype.createNewBlock = function (nonce, previousBlockHash, hash) {
        const newBlock = {
            index: this.chain.length + 1,
            timestamp: Date.now(),
            transactions: this.pendingTransactions,
            nonce: nonce,
            hash: hash,
            previousBlockHash: previousBlockHash
        };

        this.pendingTransactions =[]; 
        this.chain.push(newBlock);
        return newBlock;
}

BlockChain.prototype.getLastBlock = function() {
    return this.chain[this.chain.length - 1]
}

BlockChain.prototype.createNewTransaction = function(amount, sender, recipient) {
    const newTransaction = {
        amount: amount,
        sender: sender,
        recipient: recipient,
        transactionId: uuidv4().split('-').join('')
    };

    return newTransaction 
}

BlockChain.prototype.addTransactionToPendingTransactions = function(transactionObj) {
    this.pendingTransactions.push(transactionObj);
    return this.getLastBlock()['index'] + 1;
};

BlockChain.prototype.hashBlock = function(previousBlockHash, currentBlockData, nonce) {
    const dataAsString = previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData);
    const hash = sha256(dataAsString);
    return hash;
}

BlockChain.prototype.proofOfWork = function(previousBlockHash, currentBlockData) {
    let nonce = 0;
    let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
    //increment nonce until the first 4 digits in the hash are '0000' then returns the nonce
    while(hash.substring(0,4) !== '0000') {
        nonce++;
        hash = this.hashBlock(previousBlockHash, currentBlockData, nonce)
    }
    return nonce;
}

//consensus function - longest block algo
BlockChain.prototype.chainIsValid = function(blockchain) {
    let validChain = true;

    for(let i=1; i < blockchain.length; i++) {
        const currentBlock = blockchain[i];
        const prevBlock = blockchain[i - 1];
        const blockHash = this.hashBlock(prevBlock['hash'], { transactions: currentBlock['transactions'], index: currentBlock['index'] }, currentBlock['nonce']);
        
        //if not valid
        if(blockHash.substring(0,4) !== '0000') {
            validChain = false;
        }
        if(currentBlock['previousBlockHash'] !== prevBlock['hash']){
            validChain = false;
        }
    }
    //check if genesis block is correct
    const genesisBlock = blockchain[0];
    const correctNonce = genesisBlock['nonce'] === 100;
    const correctPreviousBlockHash = genesisBlock['previousBlockHash'] === '0';
    const correctHash = genesisBlock['hash'] === '0';
    const correctTransactions = genesisBlock['transactions'].length === 0;
    if(!correctNonce || !correctPreviousBlockHash || !correctHash || !correctTransactions) {
        validChain = false;
    }

    return validChain;
}

module.exports = BlockChain;
    