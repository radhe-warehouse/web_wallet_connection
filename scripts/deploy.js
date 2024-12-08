const hre = require("hardhat");
const path = require("path");

async function main() {
  // Get the contract factory
  const TodoList = await hre.ethers.getContractFactory("TodoList");
  
  // Deploy the contract
  const todoList = await TodoList.deploy();
  
  // Wait for deployment to complete
  await todoList.waitForDeployment();
  
  // Get the deployed contract address
  const address = await todoList.getAddress();
  
  console.log("TodoList deployed to:", address);
  
  // Save the frontend files
  saveFrontendFiles(address);
}

function saveFrontendFiles(contractAddress) {
  const fs = require("fs");
  const contractsDir = path.join(__dirname, "..", "src", "contracts");

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir, { recursive: true });
  }

  // Save contract address
  fs.writeFileSync(
    path.join(contractsDir, "contract-address.json"),
    JSON.stringify({ TodoList: contractAddress }, undefined, 2)
  );

  // Save contract artifact
  const artifact = artifacts.readArtifactSync("TodoList");
  fs.writeFileSync(
    path.join(contractsDir, "TodoList.json"),
    JSON.stringify(artifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });