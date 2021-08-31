async function main() {
    const Hodl = await ethers.getContractFactory("Hodl");
    
    // Start deployment, returning a promise that resolves to a contract object
    const hodl = await Hodl.deploy();   
    console.log("Contract deployed to address:", hodl.address);
 }
 
 main()
   .then(() => process.exit(0))
   .catch(error => {
     console.error(error);
     process.exit(1);
   });