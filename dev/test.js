const Blockchain = require('./blockchain');

const bitcoin = new Blockchain();

const bc1 = {
    chain: [
    {
    index: 1,
    timestamp: 1618541336076,
    transactions: [ ],
    nonce: 100,
    hash: "0",
    previousBlockHash: "0"
    },
    {
    index: 2,
    timestamp: 1618541358394,
    transactions: [ ],
    nonce: 18140,
    hash: "0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100",
    previousBlockHash: "0"
    },
    {
    index: 3,
    timestamp: 1618541401382,
    transactions: [
    {
    amount: 12.5,
    sender: "00",
    recipient: "2c7ec29b4570401d8ac387c77f674185",
    transactionId: "d8fa729df4c44c2aae6aaf9af042150e"
    },
    {
    amount: "10",
    sender: "Patk",
    recipient: "Rich",
    transactionId: "a6b0041376ac4a53b62e0dd5a1fe1a43"
    },
    {
    amount: "20",
    sender: "Patk",
    recipient: "Rich",
    transactionId: "a8d3c9fd13b0448597a429c29c418fd5"
    },
    {
    amount: "30",
    sender: "Patk",
    recipient: "Rich",
    transactionId: "bf994c0d68754b6c8f95fbcc1fee02aa"
    }
    ],
    nonce: 66776,
    hash: "0000c1923acf7f254bdd5531946666923ee9392ff48375fce03550527cc1a902",
    previousBlockHash: "0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100"
    },
    {
    index: 4,
    timestamp: 1618541440954,
    transactions: [
    {
    amount: 12.5,
    sender: "00",
    recipient: "2c7ec29b4570401d8ac387c77f674185",
    transactionId: "5922c78f1aec4441a395ae872940f0ba"
    },
    {
    amount: "500",
    sender: "Patk",
    recipient: "Rich",
    transactionId: "9c70335fe2c142d1b5132d4f28456591"
    },
    {
    amount: "50000",
    sender: "Patk",
    recipient: "Rich",
    transactionId: "0061cedb92cb44c990936cc142754de7"
    },
    {
    amount: "88000",
    sender: "Patk",
    recipient: "Rich",
    transactionId: "142f27f3736744b29d2e82d845ebb125"
    }
    ],
    nonce: 18711,
    hash: "000036e0d274f2c059a9a01a4cbcdf84cf6e9101fad34e120c82076ac4476787",
    previousBlockHash: "0000c1923acf7f254bdd5531946666923ee9392ff48375fce03550527cc1a902"
    },
    {
    index: 5,
    timestamp: 1618541449834,
    transactions: [
    {
    amount: 12.5,
    sender: "00",
    recipient: "2c7ec29b4570401d8ac387c77f674185",
    transactionId: "2171784b064343e492e55612a388b3d7"
    }
    ],
    nonce: 164777,
    hash: "0000f8f5354d142245d060e9db2bad552cbd734f618b3c551adf83eaa94b2ce4",
    previousBlockHash: "000036e0d274f2c059a9a01a4cbcdf84cf6e9101fad34e120c82076ac4476787"
    },
    {
    index: 6,
    timestamp: 1618541452608,
    transactions: [
    {
    amount: 12.5,
    sender: "00",
    recipient: "2c7ec29b4570401d8ac387c77f674185",
    transactionId: "9ecadb6f379448c3a17709cf0eb47f16"
    }
    ],
    nonce: 29226,
    hash: "0000fd18aabd9724c61ecaf8f660bc8392ba1fa7b62fccf4b2c6649529608d3d",
    previousBlockHash: "0000f8f5354d142245d060e9db2bad552cbd734f618b3c551adf83eaa94b2ce4"
    }
    ],
    pendingTransactions: [
    {
    amount: 12.5,
    sender: "00",
    recipient: "2c7ec29b4570401d8ac387c77f674185",
    transactionId: "d381b0387be046eaabf7237e58764d76"
    }
    ],
    currentNodeUrl: "http://localhost:3001",
    networkNodes: [ ]
    }

    console.log('VALID', bitcoin.chainIsValid(bc1.chain));
