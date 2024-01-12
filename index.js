import { ethers } from "./ethers-5.2.esm.min.js";
import { abi, contractAddress } from "./constants.js";

const connectButton = document.getElementById("connectButton");
const fundButton = document.getElementById("fundButton");
const balanceButton = document.getElementById("balanceButton");
const withdrawButton = document.getElementById("withdrawButton");
connectButton.onclick = connect;
fundButton.onclick = fund;
balanceButton.onclick = getBalance;
withdrawButton.onclick = withdraw;

console.log(ethers);

async function connect() {
    if (typeof window.ethereum !== "undefined") {
        try {
            window.ethereum.request({ method: "eth_requestAccounts" });
        } catch (error) {
            console.error(error);
        }
        connectButton.innerHTML = "Connected!";
        const accounts = await ethereum.request({ method: "eth_accounts" });
        console.log(accounts);
    } else {
        connectButton.innerHTML = "Please Install Metamask!";
    }
}

// getBalance Funciton
async function getBalance() {
    if (typeof window.ethereum != "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const balance = await provider.getBalance(contractAddress);
        console.log(ethers.utils.formatEther(balance));
    }
}

// fund function
async function fund() {
    const ethAmount = document.getElementById("ethAmount").value;
    console.log(`Funding with ${ethAmount}...`);
    if (typeof window.ethereum !== "undefined") {
        //provider / connection to the blockchain
        // signer / wallet / someone with some gas
        // ABI and Address
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        console.log(signer);
        const contract = new ethers.Contract(contractAddress, abi, signer); //?
        try {
            const transactionResponse = await contract.fund({
                value: ethers.utils.parseEther(ethAmount),
            });
            //listen for the tx to be mined
            //listen for an event
            await listenForTransactionMine(transactionResponse, provider);
            console.log("Done");
        } catch (error) {
            console.error(error);
        }
    } else {
        fundButton.innerHTML = "Please install metamask";
    }
}

function listenForTransactionMine(transactionResponse, provider) {
    console.log(`Mining ${transactionResponse.hash}...`);
    //return new Promise();
    //listen for this transaction to finish
    return new Promise((resolve, reject) => {
        try {
            provider.once(
                transactionResponse.hash,
                async (transactionReceipt) => {
                    await transactionResponse.wait(1);
                    console.log(
                        `Completed with ${transactionReceipt.confimrations} confirmations`,
                    );
                    resolve();
                },
            );
        } catch (error) {
            reject(error);
        }
    });
}

// withdraw function

async function withdraw() {
    if (typeof window.ethereum != "undefined") {
        console.log("Withdrawing...");
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);

        try {
            const transactionResponse = await contract.withdraw();
            await listenForTransactionMine(transactionResponse, provider);
            console.log("withdraw completed");
        } catch (error) {
            console.log(error);
        }
    }
}
