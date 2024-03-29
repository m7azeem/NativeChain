
class Block {
    constructor(index, previousHash, timestamp, data, hash){
        this.index = index;
        this.previousHash = previousHash.toString();
        this.timestamp = timestamp;
        this.data = data;
        this.hash = hash.toString();
    }
}

//used to verify the integrity of the data
var calculateHash = (index, previousHash, timestamp, data) => {
    return CryptoJS.SHA256(index + previousHash + timestamp + data).toString();
};

var generateNextBlock = (blockData) => {
    var previousBlock = getLatestBlock();
    var nextIndex = previousBlock.index + 1;
    var nextTimestamp = new Date().getTime()/1000;
    var nextHash = calculateHash(nextIndex, previousBlock.hash, nextTimestamp, blockData, nextHash);
};

//first block in blockchain
var getGenesisBlock = () => {
    return new Block(0, "0", 1465154705, "my genesis block!!", "816534932c2b7154836da6afc367695e6337db8a921823784c14378abed4f7d7");
};

//initialize the blockchain
var blockchain = [getGenesisBlock()];

var isValidNewBlock = (newBlock, previousBlock) => {
    if (previousBlock.index + 1 !== newBlock.index) {
        console.log('invalid index');
        return false;
    } else if (previousBlock.hash !== newBlock.previousHash) {
        console.log('invalid previousHash');
        return false;
    } else if (calculateHashForBlock(newBlock) !== newBlock.hash) {
        console.log('invalid hashL ' + calculateHashForBlock(newBlock) + ' ' + newBlock.hash);
        return false;
    }
    return true;
};

//done to only continue with the latest chain
var replaceChain = (newBlocks) => {
    if (isValidChain(newBlocks) && newBlocks.length > blockchain.length) {
        console.log('Received blockchain is valid. Replacing current blockchain with received blockchain');
        blockchain = newBlocks;
        broadcast(responseLatestMsg());        
    } else {
        console.log('Received blockchain invalid');
    }
};

var initHttpServer = () => {
    var app = express();
    app.use(bodyParser.json());

    app.get('/blocks', (req, res) => res.send(JSON.stringifyblockchain()));

    app.post('/mineBlock', (req, res) => {
        var newBlock = generateNextBlock(req.body.data);
        addBlock(newBlock);
        broadcast(responseLatestMsg());
        console.log('block added: ' + JSON.stringify(newBlock));
        res.send();
    });

    app.get('/peers', (req, res) => {
        res.send(sockets.map(s=>s.socket.remoteAddress + ':' + s.socket.remotePort)); 
    });
    app.post('/addPeer', (req, res) => ){
        connectToPeers([req.body.peer]);
        res.send();
    });

    app.listen(http_port, () => console.log('Listening http on port: ') + http_port));
};


