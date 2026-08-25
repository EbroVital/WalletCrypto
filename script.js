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
            
            const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${this.nom}&vs_currencies=usd&include_24hr_change=true`)
            const data = await response.json()

            if(!data[this.nom]){
                throw new Error(`Crypto "${this.nom}" introuvable`)
            } else{
                const prix = data[this.nom].usd
                const variation = data[this.nom].usd_24h_change
                return {
                    valeur: prix * this.quantite,
                    variation: variation
                }
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
                total += val.valeur
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

// Recharge le portefeuille sauvegardé au démarrage de l'application
function chargerPortefeuille() {
  
    const donneesSauvegardees = localStorage.getItem("portefeuille")

    if (donneesSauvegardees !== null) {
       
        const donneesPlates = JSON.parse(donneesSauvegardees)
        portefeuille.actifs = donneesPlates.map(obj => new ActifCrypto(obj.nom, obj.quantite))
    }
}
// Sauvegarde le portefeuille actuel dans le localStorage
function sauvegarderPortefeuille() {
    localStorage.setItem("portefeuille", JSON.stringify(portefeuille.actifs))
}

// Fonction qui initialise l'application au chargement de la page
async function initialiser() {
    chargerPortefeuille()
    await render()
}

initialiser()
// Rafraîchit automatiquement l'affichage toutes les 30 secondes
setInterval(async () => {
    // On relance le rendu, qui va récupérer les prix actualisés via l'API
    await render()
}, 30000)
btnAjout.addEventListener("click", async () =>{

    let nom, qte
    if(nomCrypto.value != "" && qteCrypto.value != "" && qteCrypto.value > 0){

            nom = nomCrypto.value
            qte = qteCrypto.value

            nomCrypto.value = ""
            qteCrypto.value = ""

            portefeuille.ajouterActif(nom, qte)
            // sauvegarde de l'actif ajouté dans le localstorage
            sauvegarderPortefeuille()
            await render()
    }

})

async function render(){

    listeActifs.innerHTML = ""

    for(let actif of portefeuille.actifs){

        const resultat = await actif.getValeur()
        // const couleurVariation = resultat?.variation >= 0 ? "hausse" : "baisse"
        let couleurVariation = "neutre"
        if (resultat?.variation !== undefined) {
            couleurVariation = resultat.variation >= 0 ? "hausse" : "baisse"
        }
        const texteVariation = resultat?.variation !== undefined ? `${resultat.variation >= 0 ? "+" : ""}${resultat.variation.toFixed(2)}%` : "—"

        

        let ligne = document.createElement("tr")
        ligne.innerHTML = `
        <td>${actif.nom}</td>
        <td>${actif.quantite}</td>
        <td>${ resultat?.valeur ?? "Erreur"}</td>
        <td class="${couleurVariation}">${texteVariation}</td>
        `

        let btnSupp = document.createElement("button")
        btnSupp.textContent = "Supprimer"

        ligne.appendChild(btnSupp)

        btnSupp.addEventListener("click", async () => {
            portefeuille.actifs = portefeuille.actifs.filter(val => val !== actif)
            // sauvegarde de l'actif supprimé dans le localstorage
            sauvegarderPortefeuille()
            await render()
        })

        listeActifs.appendChild(ligne)
    }

    total.textContent = `${await portefeuille.totalPortefeuille()} $`
}

