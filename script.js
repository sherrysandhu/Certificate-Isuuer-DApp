let web3;
let account;
let issuerContract;
let verifierContract;

async function connectWallet() {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    await window.ethereum.enable();
    const accounts = await web3.eth.getAccounts();
    account = accounts[0];
    document.getElementById("walletAddress").innerText = "Wallet: " + account;

    issuerContract = new web3.eth.Contract(contractABI, contractAddress);
    verifierContract = new web3.eth.Contract(verifierABI, verifierAddress);
  } else {
    alert("Please install MetaMask!");
  }
}

async function issueCertificate() {
  const to = document.getElementById("recipient").value;
  const name = document.getElementById("name").value;
  const course = document.getElementById("course").value;

  try {
    await issuerContract.methods.issueCertificate(to, name, course).send({ from: account });
    document.getElementById("issueStatus").innerText = "✅ Certificate Issued!";
  } catch (error) {
    console.error(error);
    document.getElementById("issueStatus").innerText = "❌ Failed to issue.";
  }
}

async function verifyCertificate() {
  const user = document.getElementById("verifyAddress").value;
  const index = document.getElementById("certIndex").value;

  try {
    const result = await verifierContract.methods.verifyCertificate(user, index).call();
    document.getElementById("verifyResult").innerText = result[0]
      ? `✅ VALID | Name: ${result[1]} | Course: ${result[2]}`
      : `❌ INVALID Certificate`;
  } catch (error) {
    console.error(error);
    document.getElementById("verifyResult").innerText = "❌ Verification Failed";
  }
}
