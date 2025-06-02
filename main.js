
const button = document.getElementById("nome");

const expression = document.getElementById()

button.onclick= async function buscar(){

const response= await fetch('https://api.rawg.io/api/games?key=1175c03391d84eaf9b022713f3c5e618&search=${expression}')

const dados= await response.json();
console.log (dados);
}



