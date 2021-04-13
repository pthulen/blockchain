const sha256 = require('sha256');
function BlockChain() {
    //Will contain all mined blocks
    this.chain= [];
    //Will contain all transactions pending for the next block
    this.pendingTransactions = [];
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
        recipient: recipient
    };

    this.pendingTransactions.push(newTransaction);

    return this.getLastBlock()['index'] + 1; 
}

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
        hash= this.hashBlock(previousBlockHash, currentBlockData, nonce)
    }
    return nonce;
}

module.exports = BlockChain;
    