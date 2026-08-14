// async function testerAPI() {
//     const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd")
//     const data = await response.json()
//     console.log(data)
// }

// testerAPI()

class ActifCrypto{
    constructor(nom, quantite){
        this.nom = nom
        this.quantite = quantite
    }
    async getValeur() {

        try {
            
            const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${this.nom}&vs_currencies=usd`)
            const data = await response.json()

            if(!data[this.nom]){
                throw new Error(`Crypto "${this.nom}" introuvable`)
            } else{
                const prix = data[this.nom].usd
                return prix * this.quantite
            }

        } catch (error) {
            console.error(error.message)
            return null
        }

        
    }
}

class Portefeuille{
    constructor(){
        this.actifs = []
    }
    ajouterActif(nom, quantite){
        let val = new ActifCrypto(nom, quantite)
        this.actifs.push(val)
    }
    async totalPortefeuille(){
        const promesses = this.actifs.map(actif => actif.getValeur())
        const valeurs = await Promise.all(promesses)
        let total = 0
        for(let val of valeurs){
            if(val !== null){
                total += val
            }
        }
        return total
    }
}

const portefeuille = new Portefeuille()
// portefeuille.ajouterActif("bitcoin", 0.5)

// async function testerValeur() {
//     const valeur = await portefeuille.actifs[0].getValeur()
//     console.log(`Valeur: ${valeur} $`)
// }
// testerValeur()

const nomCrypto = document.querySelector("#cryptoNom")
const qteCrypto = document.querySelector("#cryptoQuantite")
const btnAjout = document.querySelector("#ajouterActif")
const listeActifs = document.querySelector("#listeActifs")
const total = document.querySelector("#totalPortefeuille")

btnAjout.addEventListener("click", async () =>{

    let nom, qte
    if(nomCrypto.value != "" && qteCrypto.value != "" && qteCrypto.value > 0){

            nom = nomCrypto.value
            qte = qteCrypto.value

            nomCrypto.value = ""
            qteCrypto.value = ""

            portefeuille.ajouterActif(nom, qte)
            await render()
    }

})

async function render(){

    listeActifs.innerHTML = ""

    for(let actif of portefeuille.actifs){

        let ligne = document.createElement("tr")
        ligne.innerHTML = `<td>${actif.nom}</td><td>${actif.quantite}</td><td>${await actif.getValeur() ?? "Erreur"}</td>`

        let btnSupp = document.createElement("button")
        btnSupp.textContent = "Supprimer"

        ligne.appendChild(btnSupp)

        btnSupp.addEventListener("click", async () => {
            portefeuille.actifs = portefeuille.actifs.filter(val => val !== actif)
            await render()
        })

        listeActifs.appendChild(ligne)
    }

    total.textContent = await portefeuille.totalPortefeuille()
}