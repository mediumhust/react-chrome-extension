const startRequest = async () => {
  const response = await fetch("https://jsonplaceholder.typicode.com/todos/1");

  if (!response.ok) {
    const message = `An error has occured: ${response.status}`;
    throw new Error(message);
  }
  const data = await response.json();
  console.log(data);
  return data;
};

export default startRequest;
