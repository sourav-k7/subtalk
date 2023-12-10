async function main() {
  const contract = await ethers.getContractAt(
    'Subtalk',
    '0x5FbDB2315678afecb367f032d93F642f64180aa3',
  );
  const addUser = await contract.createUser('Sanskriti', 'Student');
  console.log(addUser);
  const users = await contract.getUsers();
  console.log(users);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
