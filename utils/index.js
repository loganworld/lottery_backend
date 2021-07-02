const Tx = require('ethereumjs-tx')
const ethers = require('ethers')

const sendEths = async ({
    to,
    from,
    fromPrivateKey,
    value,
    gasPrice,
    gasLimit = ethers.utils.hexlify(21000),
  }) => {
    const txCount = await provider.getTransactionCount(from)
    // build the transaction
    const tx = new Tx({
      nonce: ethers.utils.hexlify(txCount),
      to,
      value: ethers.utils.parseEther(value).toHexString(),
      gasLimit,
      gasPrice,
    })
    // sign the transaction
    tx.sign(Buffer.from(fromPrivateKey, 'hex'))
    // send the transaction
    const { hash } = await provider.sendTransaction('0x' + tx.serialize().toString('hex'))
    await provider.waitForTransaction(hash)
  }

  export {sendEths};